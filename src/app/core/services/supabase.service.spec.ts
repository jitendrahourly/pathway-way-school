import { TestBed } from '@angular/core/testing';
import { SupabaseService } from './supabase.service';

describe('SupabaseService', () => {
  it('initializes a Supabase client from environment config', () => {
    const service = TestBed.configureTestingModule({}).inject(SupabaseService);
    expect(service.client).toBeTruthy();
    expect(typeof service.client.from).toBe('function');
    expect(typeof service.client.auth).toBe('object');
    expect(typeof service.client.storage).toBe('object');
  });
});
