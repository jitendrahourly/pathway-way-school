import { Service, inject, signal } from '@angular/core';
import { mergeWithSeed } from '../data/seed-merge';
import { SITE_SETTINGS } from '../data/site.seed';
import type { SiteSettings } from '../models/site-settings.model';
import { SupabaseService } from './supabase.service';

/** The single site_settings row that holds the editable school details. */
const SETTINGS_KEY = 'site';

const UNCONFIRMED_MESSAGE =
  'Supabase accepted the save but the site_settings row could not be confirmed. Check that the site_settings policies allow admins to insert and update the row, and that the row is public.';

interface WriteResult {
  readonly count: number;
  readonly error: Error | null;
  readonly code?: string;
}

function toError(value: unknown): Error {
  if (value instanceof Error) return value;

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const parts = [record['message'], record['details'], record['hint']].filter(
      (part): part is string => typeof part === 'string' && part.length > 0,
    );
    if (typeof record['code'] === 'string' && record['code']) {
      parts.push(`code ${record['code']}`);
    }
    return new Error(parts.length ? parts.join(' — ') : UNCONFIRMED_MESSAGE);
  }

  return new Error(UNCONFIRMED_MESSAGE);
}

/**
 * School details shown across the site (header, footer, Contact page). Reads
 * the saved site_settings row and falls back to the seed copy for any field it
 * does not contain.
 *
 * Uses the Supabase client directly rather than ContentService so each write
 * reports its own result: ContentService keeps one shared loading/error signal,
 * which can hide a failed write behind a concurrent request.
 */
@Service()
export class SiteSettingsService {
  private readonly client = inject(SupabaseService).client;
  private readonly state = signal<SiteSettings>(SITE_SETTINGS);
  private readonly hasRecord = signal(false);
  private loadRequest: Promise<void> | null = null;

  readonly settings = this.state.asReadonly();

  constructor() {
    void this.load();
  }

  /** Resolves once the saved settings have been read, or the seed is kept. */
  load(): Promise<void> {
    this.loadRequest ??= this.fetchSettings();
    return this.loadRequest;
  }

  /** Saves the whole settings object and applies it to the site immediately. */
  async save(settings: SiteSettings): Promise<Error | null> {
    const payload = {
      setting_key: SETTINGS_KEY,
      setting_value: settings as unknown as Record<string, unknown>,
      is_public: true,
      updated_at: new Date().toISOString(),
    };

    try {
      const result = await this.upsertRow(payload);
      if (result.error) return result.error;
      if (result.count === 0) return new Error(UNCONFIRMED_MESSAGE);
      return this.apply(settings);
    } catch (err) {
      return toError(err);
    }
  }

  private apply(settings: SiteSettings): null {
    this.hasRecord.set(true);
    this.state.set(settings);
    return null;
  }

  private async upsertRow(payload: Record<string, unknown>): Promise<WriteResult> {
    const { data, error } = await this.client
      .from('site_settings')
      .upsert(payload, { onConflict: 'setting_key' })
      .select('id');

    if (error) return { count: 0, error: toError(error), code: error.code };
    return { count: data?.length ?? 0, error: null };
  }

  private async fetchSettings(): Promise<void> {
    try {
      const { data, error } = await this.client
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', SETTINGS_KEY)
        .maybeSingle();

      if (error) {
        // Keep the seed copy and allow the next load() call to retry the read.
        this.loadRequest = null;
        return;
      }

      const row = data as { setting_value?: Record<string, unknown> | null } | null;
      if (!row?.setting_value) return;

      this.hasRecord.set(true);
      this.state.set(mergeWithSeed(SITE_SETTINGS, row.setting_value));
    } catch {
      this.loadRequest = null;
    }
  }
}
