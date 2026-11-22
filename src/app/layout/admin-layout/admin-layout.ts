import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { BrandLogo } from '../../shared/components/brand-logo/brand-logo';

interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, BrandLogo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './admin-layout.scss',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  private readonly adminAuth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly profile = this.adminAuth.profile;
  protected readonly loading = this.adminAuth.loading;
  protected readonly sidebarOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Page Content', path: '/admin/page-content', icon: 'page' },
    { label: 'Announcements', path: '/admin/announcements', icon: 'megaphone' },
    { label: 'Gallery', path: '/admin/gallery', icon: 'image' },
    { label: 'Facilities', path: '/admin/facilities', icon: 'building' },
    { label: 'Contact Requests', path: '/admin/contact-messages', icon: 'mail' },
    { label: 'Site Settings', path: '/admin/settings', icon: 'settings' },
  ];

  protected readonly pageTitle = computed(() => {
    const url = this.router.url.split('?')[0];
    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/page-content')) return 'Page Content';
    if (url.includes('/announcements')) return 'Announcements';
    if (url.includes('/gallery')) return 'Gallery';
    if (url.includes('/facilities')) return 'Facilities';
    if (url.includes('/settings')) return 'Site Settings';
    return 'Admin';
  });

  protected toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected async logout(): Promise<void> {
    await this.adminAuth.logout();
    await this.router.navigateByUrl('/admin/login');
  }

  protected iconPath(name: string): string {
    const paths: Record<string, string> = {
      dashboard: 'M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-10h8V3h-8v8z',
      page: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6',
      megaphone: 'M3 11l18-5v12L3 13v-2zm0 2v4a2 2 0 0 0 2 2h2',
      image: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm4 6l3 3 4-5 5 7H5l2-5z',
      mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm16 2l-8 5-8-5',
      building: 'M3 21V7l9-4 9 4v14M9 21V12h6v9',
      settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8.5-3a6.5 6.5 0 0 0-.1-1.1l2-1.5-2-3.4-2.4 1a6.4 6.4 0 0 0-1.9-1.1L15.5 2h-4l-.6 2.4a6.4 6.4 0 0 0-1.9 1.1l-2.4-1-2 3.4 2 1.5a6.5 6.5 0 0 0 0 2.2l-2 1.5 2 3.4 2.4-1a6.4 6.4 0 0 0 1.9 1.1L11.5 22h4l.6-2.4a6.4 6.4 0 0 0 1.9-1.1l2.4 1 2-3.4-2-1.5c.1-.4.1-.7.1-1.1z',
      logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
    };
    return paths[name] ?? '';
  }
}
