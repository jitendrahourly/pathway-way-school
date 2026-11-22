import { Service, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { StorageUploadResult } from '../models/supabase.model';

/**
 * Helpers for Supabase Storage: upload, public URL retrieval and deletion.
 * Bucket names are passed by callers; no buckets are created here.
 */
@Service()
export class StorageService {
  private readonly client = inject(SupabaseService).client;

  readonly loading = signal(false);
  readonly error = signal<Error | null>(null);

  async upload(bucket: string, path: string, file: File | Blob): Promise<StorageUploadResult> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.client.storage.from(bucket).upload(path, file, {
        upsert: true,
      });
      if (error) {
        this.error.set(error);
        return { path: null, publicUrl: null, error };
      }
      const publicUrl = this.getPublicUrl(bucket, data?.path ?? path);
      return { path: data?.path ?? path, publicUrl, error: null };
    } catch (err) {
      const error = err as Error;
      this.error.set(error);
      return { path: null, publicUrl: null, error };
    } finally {
      this.loading.set(false);
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /** Object path inside a bucket for one of its public URLs, or null. */
  publicPath(url: string, bucket = 'school-assets'): string | null {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = url.indexOf(marker);
    return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length));
  }

  async remove(bucket: string, paths: string | string[]): Promise<{ error: Error | null }> {
    this.loading.set(true);
    this.error.set(null);
    const list = Array.isArray(paths) ? paths : [paths];
    try {
      const { error } = await this.client.storage.from(bucket).remove(list);
      if (error) {
        this.error.set(error);
        return { error };
      }
      return { error: null };
    } catch (err) {
      const error = err as Error;
      this.error.set(error);
      return { error };
    } finally {
      this.loading.set(false);
    }
  }
}
