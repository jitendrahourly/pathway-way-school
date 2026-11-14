import { Service, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { ContentRow } from '../models/supabase.model';

/**
 * Generic content access over Supabase tables. Table names and row shapes are
 * provided by callers; this service performs no schema assumptions.
 */
@Service()
export class ContentService {
  private readonly client = inject(SupabaseService).client;

  readonly loading = signal(false);
  readonly error = signal<Error | null>(null);

  async select<T = ContentRow>(table: string, columns = '*'): Promise<T[]> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.client.from(table).select(columns);
      if (error) {
        this.error.set(error);
        return [];
      }
      return (data ?? []) as T[];
    } catch (err) {
      this.error.set(err as Error);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async selectById<T = ContentRow>(
    table: string,
    idColumn: string,
    id: string | number,
    columns = '*',
  ): Promise<T | null> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.client
        .from(table)
        .select(columns)
        .eq(idColumn, id)
        .maybeSingle();
      if (error) {
        this.error.set(error);
        return null;
      }
      return (data ?? null) as T | null;
    } catch (err) {
      this.error.set(err as Error);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async insert<T = ContentRow>(
    table: string,
    payload: Partial<T> | Partial<T>[],
  ): Promise<T[] | null> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.client.from(table).insert(payload as any).select();
      if (error) {
        this.error.set(error);
        return null;
      }
      return (data ?? []) as T[];
    } catch (err) {
      this.error.set(err as Error);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async update<T = ContentRow>(
    table: string,
    idColumn: string,
    id: string | number,
    payload: Partial<T>,
  ): Promise<T[] | null> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.client
        .from(table)
        .update(payload as any)
        .eq(idColumn, id)
        .select();
      if (error) {
        this.error.set(error);
        return null;
      }
      return (data ?? []) as T[];
    } catch (err) {
      this.error.set(err as Error);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async remove(table: string, idColumn: string, id: string | number): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { error } = await this.client.from(table).delete().eq(idColumn, id);
      if (error) {
        this.error.set(error);
        return false;
      }
      return true;
    } catch (err) {
      this.error.set(err as Error);
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}
