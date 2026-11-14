import type { AuthError, User, Session } from '@supabase/supabase-js';

/**
 * Generic result shape returned by Supabase data helpers.
 */
export interface SupabaseResult<T> {
  readonly data: T | null;
  readonly error: Error | null;
}

/**
 * Authentication result returned by AuthService methods.
 */
export interface AuthResult {
  readonly user: User | null;
  readonly session: Session | null;
  readonly error: AuthError | null;
}

/**
 * Storage upload result returned by StorageService.
 */
export interface StorageUploadResult {
  readonly path: string | null;
  readonly publicUrl: string | null;
  readonly error: Error | null;
}

/**
 * Content record shape used by ContentService. Tables are managed in Supabase;
 * this interface only describes the generic row envelope.
 */
export interface ContentRow {
  readonly id?: string | number;
  [key: string]: unknown;
}

/**
 * Row shape for the admin_profiles table.
 */
export interface AdminProfile {
  readonly id: string;
  readonly full_name: string;
  readonly role: 'admin' | 'editor' | string;
  readonly created_at?: string;
  readonly updated_at?: string;
}
