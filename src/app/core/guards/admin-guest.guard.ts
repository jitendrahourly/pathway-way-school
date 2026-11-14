import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminGuestGuard: CanActivateFn = async () => {
  const adminAuth = inject(AdminAuthService);
  const router = inject(Router);

  try {
    await adminAuth.ensureSession();
  } catch {
    return true;
  }

  if (adminAuth.isAuthorized()) {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return true;
};
