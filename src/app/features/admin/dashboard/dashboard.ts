import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { BrandLogo } from '../../../shared/components/brand-logo/brand-logo';

@Component({
  selector: 'app-dashboard',
  imports: [BrandLogo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly adminAuth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly profile = this.adminAuth.profile;
  protected readonly loading = this.adminAuth.loading;

  protected async logout(): Promise<void> {
    await this.adminAuth.logout();
    await this.router.navigateByUrl('/admin/login');
  }
}
