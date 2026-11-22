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
  readonly role: 'admin' | string;
  readonly created_at?: string;
  readonly updated_at?: string;
}

/**
 * Row shape for the announcements table.
 */
export interface AnnouncementRecord {
  readonly id: string | number;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Row shape for the gallery_images table.
 */
export interface GalleryImageRecord {
  readonly id: string | number;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string;
  display_order: number;
  is_published: boolean;
  created_at?: string;
}

/**
 * Row shape for the page_contents table. The content column stores the
 * structured JSON for one public content page.
 */
export interface PageContentRecord {
  readonly id: string | number;
  page_slug: string;
  content: Record<string, unknown>;
  is_published: boolean;
  updated_at?: string;
  updated_by?: string | null;
}

/**
 * Row shape for messages submitted through the public Contact Us form.
 */
export interface ContactMessageRecord {
  readonly id?: string | number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

/**
 * Row shape for the facilities table.
 */
export interface FacilityRecord {
  readonly id: string | number;
  title: string;
  description: string | null;
  image_url: string | null;
  image_alt?: string | null;
  /** Optional short photo caption shown beneath the image. */
  caption?: string | null;
  /** Optional key features shown as bullet highlights. */
  highlights?: string[] | null;
  /** Optional longer description for the detail view. */
  detailed_description?: string | null;
  /** Optional call-to-action button label. */
  button_label?: string | null;
  /** Optional call-to-action button link. */
  button_link?: string | null;
  /** Optional sub-page target for the "Explore … in detail" link. */
  subpage_url?: string | null;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}
