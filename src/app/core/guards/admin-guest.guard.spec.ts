import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { adminGuestGuard } from './admin-guest.guard';
import { AdminAuthService } from '../services/admin-auth.service';

describe('adminGuestGuard', () => {
  let mockAuth: { ensureSession: ReturnType<typeof vi.fn>; isAuthorized: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(() => {
    mockAuth = { ensureSession: vi.fn(), isAuthorized: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AdminAuthService, useValue: mockAuth },
      ],
    });
    router = TestBed.inject(Router);
  });

  it('allows unauthenticated visitor', async () => {
    mockAuth.ensureSession.mockResolvedValue(undefined);
    mockAuth.isAuthorized.mockReturnValue(false);
    const result = await TestBed.runInInjectionContext(() => adminGuestGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects authenticated admin to dashboard', async () => {
    mockAuth.ensureSession.mockResolvedValue(undefined);
    mockAuth.isAuthorized.mockReturnValue(true);
    const result = await TestBed.runInInjectionContext(() => adminGuestGuard({} as any, {} as any));
    expect(result).toEqual(router.createUrlTree(['/admin/dashboard']));
  });

  it('allows on session error', async () => {
    mockAuth.ensureSession.mockRejectedValue(new Error('boom'));
    const result = await TestBed.runInInjectionContext(() => adminGuestGuard({} as any, {} as any));
    expect(result).toBe(true);
  });
});
