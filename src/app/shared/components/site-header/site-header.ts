import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { PUBLIC_NAV, type NavItem } from '../../navigation';
import { BrandLogo } from '../brand-logo/brand-logo';
import { UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, BrandLogo, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './site-header.scss',
  templateUrl: './site-header.html',
})
export class SiteHeader {
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  protected readonly settings = inject(SiteSettingsService).settings;
  protected readonly nav: readonly NavItem[] = PUBLIC_NAV;
  protected readonly menuOpen = signal(false);
  protected readonly desktopOpen = signal<string | null>(null);
  protected readonly mobileExpanded = signal<Set<string>>(new Set());

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.menuOpen.set(false);
        this.desktopOpen.set(null);
        this.mobileExpanded.set(new Set());
      });

    effect((onCleanup) => {
      document.body.classList.toggle('menu-open', this.menuOpen());
      document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
      onCleanup(() => {
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
      });
    });
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.desktopOpen.set(null);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.menuOpen.set(false);
    this.desktopOpen.set(null);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected toggleDesktop(label: string): void {
    this.desktopOpen.update((current) => (current === label ? null : label));
  }

  protected openDesktop(label: string): void {
    this.desktopOpen.set(label);
  }

  protected closeDesktop(): void {
    this.desktopOpen.set(null);
  }

  protected toggleMobile(label: string): void {
    const next = new Set(this.mobileExpanded());
    if (next.has(label)) {
      next.delete(label);
    } else {
      next.add(label);
    }
    this.mobileExpanded.set(next);
  }

  protected isMobileExpanded(label: string): boolean {
    return this.mobileExpanded().has(label);
  }
}