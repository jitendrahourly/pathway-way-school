import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { BrandLogo } from '../../../shared/components/brand-logo/brand-logo';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, BrandLogo, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly adminAuth = inject(AdminAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = this.adminAuth.loading;
  protected readonly error = this.adminAuth.error;
  protected readonly showPassword = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    const ok = await this.adminAuth.login(email, password);
    if (ok) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/admin/dashboard';
      await this.router.navigateByUrl(returnUrl);
    }
  }
}
