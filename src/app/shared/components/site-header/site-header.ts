import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { PUBLIC_NAV } from '../../navigation';
import { BrandLogo } from '../brand-logo/brand-logo';
import { UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, BrandLogo, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './site-header.scss',
  templateUrl: './site-header.html',
  host: { '[class.is-scrolled]': 'scrolled()' },
})
export class SiteHeader {
  private readonly router = inject(Router);
  protected readonly settings = inject(SiteSettingsService).settings;
  protected readonly nav = PUBLIC_NAV;
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));

    effect(() => {
      document.body.classList.toggle('menu-open', this.menuOpen());
    });

    // Initialise scroll state for loads that start mid-page.
    this.onScroll();
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 30);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.menuOpen.set(false);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
