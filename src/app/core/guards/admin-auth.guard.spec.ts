import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { adminAuthGuard } from './admin-auth.guard';
import { AdminAuthService } from '../services/admin-auth.service';

describe('adminAuthGuard', () => {
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

  it('allows authorized admin', async () => {
    mockAuth.ensureSession.mockResolvedValue(undefined);
    mockAuth.isAuthorized.mockReturnValue(true);
    const result = await TestBed.runInInjectionContext(() =>
      adminAuthGuard({} as any, { url: '/admin/dashboard' } as any),
    );
    expect(result).toBe(true);
  });

  it('redirects unauthenticated to login', async () => {
    mockAuth.ensureSession.mockResolvedValue(undefined);
    mockAuth.isAuthorized.mockReturnValue(false);
    const result = await TestBed.runInInjectionContext(() =>
      adminAuthGuard({} as any, { url: '/admin/dashboard' } as any),
    );
    expect(result).toEqual(router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: '/admin/dashboard' } }));
  });

  it('redirects to login on session error', async () => {
    mockAuth.ensureSession.mockRejectedValue(new Error('boom'));
    const result = await TestBed.runInInjectionContext(() =>
      adminAuthGuard({} as any, { url: '/admin/dashboard' } as any),
    );
    expect(result).toEqual(router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: '/admin/dashboard' } }));
  });
});
