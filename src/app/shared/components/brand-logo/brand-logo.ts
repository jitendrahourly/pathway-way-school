import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-logo',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './brand-logo.scss',
  templateUrl: './brand-logo.html',
})
export class BrandLogo {
  readonly variant = input<'dark' | 'light'>('dark');
  protected readonly logoFailed = signal(false);
}
