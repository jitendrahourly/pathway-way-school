import { Service, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { AuthError, User, Session } from '@supabase/supabase-js';
import type { AuthResult } from '../models/supabase.model';

/**
 * Authentication helpers over the centralized Supabase client.
 * No login UI or route guards are wired up yet.
 */
@Service()
export class AuthService {
  private readonly client = inject(SupabaseService).client;

  readonly loading = signal(false);
  readonly error = signal<AuthError | null>(null);
  readonly user = signal<User | null>(null);
  readonly session = signal<Session | null>(null);

  async signUp(email: string, password: string): Promise<AuthResult> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.client.auth.signUp({ email, password });
      if (error) {
        this.error.set(error);
        return { user: null, session: null, error };
      }
      this.user.set(data.user ?? null);
      this.session.set(data.session ?? null);
      return { user: data.user ?? null, session: data.session ?? null, error: null };
    } catch (err) {
      const authError = err as AuthError;
      this.error.set(authError);
      return { user: null, session: null, error: authError };
    } finally {
      this.loading.set(false);
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.client.auth.signInWithPassword({ email, password });
      if (error) {
        this.error.set(error);
        return { user: null, session: null, error };
      }
      this.user.set(data.user ?? null);
      this.session.set(data.session ?? null);
      return { user: data.user ?? null, session: data.session ?? null, error: null };
    } catch (err) {
      const authError = err as AuthError;
      this.error.set(authError);
      return { user: null, session: null, error: authError };
    } finally {
      this.loading.set(false);
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { error } = await this.client.auth.signOut();
      if (error) {
        this.error.set(error);
        return { error };
      }
      this.user.set(null);
      this.session.set(null);
      return { error: null };
    } catch (err) {
      const authError = err as AuthError;
      this.error.set(authError);
      return { error: authError };
    } finally {
      this.loading.set(false);
    }
  }

  async getSession(): Promise<Session | null> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.client.auth.getSession();
      if (error) {
        this.error.set(error);
        return null;
      }
      this.session.set(data.session ?? null);
      this.user.set(data.session?.user ?? null);
      return data.session ?? null;
    } catch (err) {
      this.error.set(err as AuthError);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async getUser(): Promise<User | null> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.client.auth.getUser();
      if (error) {
        this.error.set(error);
        return null;
      }
      this.user.set(data.user ?? null);
      return data.user ?? null;
    } catch (err) {
      this.error.set(err as AuthError);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void): () => void {
    const { data } = this.client.auth.onAuthStateChange((event, session) => {
      this.session.set(session);
      this.user.set(session?.user ?? null);
      callback(event, session);
    });
    return () => data.subscription.unsubscribe();
  }
}
