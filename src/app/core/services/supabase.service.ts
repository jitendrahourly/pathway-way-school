import { Service } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

/**
 * Centralized Supabase client. All other services inject this rather than
 * creating their own client. Only the publishable (anon) key is used here.
 */
@Service()
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    const { url, anonKey } = environment.supabase;
    this.client = createClient(url, anonKey);
  }

  /**
   * Lightweight check that the client is configured and reachable enough to
   * query auth state. Does not require any application tables.
   */
  async ping(): Promise<boolean> {
    try {
      const { error } = await this.client.auth.getSession();
      return error === null;
    } catch {
      return false;
    }
  }
}
