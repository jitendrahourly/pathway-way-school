import { Service, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ContentService } from './content.service';
import { SupabaseService } from './supabase.service';
import type { AdminProfile } from '../models/supabase.model';

const ALLOWED_ROLES = ['admin'] as const;

/**
 * Admin authentication and authorization over the existing AuthService.
 * Verifies the authenticated user against the admin_profiles table; never
 * trusts a client-supplied role.
 */
@Service()
export class AdminAuthService {
  private readonly auth = inject(AuthService);
  private readonly content = inject(ContentService);
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);

  readonly profile = signal<AdminProfile | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly isAuthorized = computed(() => {
    const p = this.profile();
    return p !== null && ALLOWED_ROLES.includes(p.role as (typeof ALLOWED_ROLES)[number]);
  });

  private initPromise: Promise<void> | null = null;
  readonly initialized = signal(false);

  constructor() {
    this.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        this.profile.set(null);
        this.initPromise = null;
        this.initialized.set(false);
      }
    });
  }

  /**
   * Ensure the current session (if any) has been restored and the admin profile
   * loaded. Safe to call repeatedly.
   */
  async ensureSession(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.restore().catch(() => {
        this.profile.set(null);
      }).finally(() => {
        this.initialized.set(true);
      });
    }
    await this.initPromise;
  }

  private async restore(): Promise<void> {
    const session = await this.auth.getSession();
    if (session?.user) {
      await this.loadProfile(session.user.id);
    } else {
      this.profile.set(null);
    }
  }

  private async loadProfile(userId: string): Promise<void> {
    this.loading.set(true);
    try {
      const row = await this.content.selectById<AdminProfile>(
        'admin_profiles',
        'id',
        userId,
      );
      if (row && ALLOWED_ROLES.includes(row.role as (typeof ALLOWED_ROLES)[number])) {
        this.profile.set(row);
      } else {
        this.profile.set(null);
      }
    } catch {
      this.profile.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Sign in with email/password, then verify the admin profile. Returns true only
   * when the user is an authorized admin.
   */
  async login(email: string, password: string): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await this.auth.signIn(email, password);
      if (result.error || !result.user) {
        this.error.set(result.error?.message ?? 'Sign-in failed.');
        await this.auth.signOut();
        this.profile.set(null);
        return false;
      }
      await this.loadProfile(result.user.id);
      if (!this.isAuthorized()) {
        this.error.set('This account is not authorized to access the admin area.');
        await this.auth.signOut();
        this.profile.set(null);
        return false;
      }
      return true;
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Sign-in failed.');
      await this.auth.signOut();
      this.profile.set(null);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async logout(): Promise<void> {
    this.loading.set(true);
    try {
      await this.auth.signOut();
    } finally {
      this.profile.set(null);
      this.initPromise = null;
      this.loading.set(false);
      this.error.set(null);
    }
  }
}
