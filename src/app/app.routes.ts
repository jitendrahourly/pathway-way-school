import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';
import { adminGuestGuard } from './core/guards/admin-guest.guard';
import { PublicLayout } from './layout/public-layout/public-layout';

export const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        title: 'Admin Login | Bright Way School',
        canActivate: [adminGuestGuard],
        loadComponent: () =>
          import('./features/admin/login/login').then((m) => m.Login),
      },
      {
        path: '',
        canActivate: [adminAuthGuard],
        loadComponent: () =>
          import('./layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'dashboard',
            title: 'Dashboard | Bright Way School',
            loadComponent: () =>
              import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
          },
          {
            path: 'page-content',
            title: 'Page Content | Bright Way School',
            loadComponent: () =>
              import('./features/admin/placeholder/admin-placeholder').then(
                (m) => m.AdminPlaceholder,
              ),
          },
          {
            path: 'announcements',
            title: 'Announcements | Bright Way School',
            loadComponent: () =>
              import('./features/admin/placeholder/admin-placeholder').then(
                (m) => m.AdminPlaceholder,
              ),
          },
          {
            path: 'gallery',
            title: 'Gallery | Bright Way School',
            loadComponent: () =>
              import('./features/admin/placeholder/admin-placeholder').then(
                (m) => m.AdminPlaceholder,
              ),
          },
          {
            path: 'facilities',
            title: 'Facilities | Bright Way School',
            loadComponent: () =>
              import('./features/admin/placeholder/admin-placeholder').then(
                (m) => m.AdminPlaceholder,
              ),
          },
          {
            path: 'settings',
            title: 'Site Settings | Bright Way School',
            loadComponent: () =>
              import('./features/admin/placeholder/admin-placeholder').then(
                (m) => m.AdminPlaceholder,
              ),
          },
        ],
      },
    ],
  },
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        title: 'Bright Way School | Bengaluru',
        loadComponent: () => import('./features/public/home/home').then((m) => m.Home),
      },
      {
        path: 'about',
        title: 'About Us | Bright Way School',
        loadComponent: () => import('./features/public/about/about').then((m) => m.About),
      },
      {
        path: 'academics',
        title: 'Academics | Bright Way School',
        loadComponent: () =>
          import('./features/public/academics/academics').then((m) => m.Academics),
      },
      {
        path: 'facilities',
        title: 'Facilities | Bright Way School',
        loadComponent: () =>
          import('./features/public/facilities/facilities').then((m) => m.Facilities),
      },
      {
        path: 'gallery',
        title: 'Gallery | Bright Way School',
        loadComponent: () => import('./features/public/gallery/gallery').then((m) => m.Gallery),
      },
      {
        path: 'announcements',
        title: 'Announcements | Bright Way School',
        loadComponent: () =>
          import('./features/public/announcements/announcements').then(
            (m) => m.Announcements,
          ),
      },
      {
        path: 'announcements/:id',
        title: 'Announcement | Bright Way School',
        loadComponent: () =>
          import('./features/public/announcements/announcement-detail').then(
            (m) => m.AnnouncementDetail,
          ),
      },
      {
        path: 'admissions',
        title: 'Admissions | Bright Way School',
        loadComponent: () =>
          import('./features/public/admissions/admissions').then((m) => m.Admissions),
      },
      {
        path: 'contact',
        title: 'Contact Us | Bright Way School',
        loadComponent: () => import('./features/public/contact/contact').then((m) => m.Contact),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
