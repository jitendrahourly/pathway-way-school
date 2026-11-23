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
              import('./features/admin/page-content/page-content-list').then(
                (m) => m.PageContentList,
              ),
          },
          {
            path: 'page-content/new',
            title: 'Add Page Content | Bright Way School',
            loadComponent: () =>
              import('./features/admin/page-content/page-content-form').then(
                (m) => m.PageContentForm,
              ),
          },
          {
            path: 'page-content/:slug/main',
            title: 'Edit Main Page Content | Bright Way School',
            loadComponent: () =>
              import('./features/admin/page-content/main-page-content-form').then(
                (m) => m.MainPageContentForm,
              ),
          },
          {
            path: 'page-content/about-management/edit',
            title: 'Edit Management Page Content | Bright Way School',
            loadComponent: () =>
              import('./features/admin/page-content/management-content-form').then(
                (m) => m.ManagementContentForm,
              ),
          },
          {
            path: 'page-content/:slug/edit',
            title: 'Edit Page Content | Bright Way School',
            loadComponent: () =>
              import('./features/admin/page-content/page-content-form').then(
                (m) => m.PageContentForm,
              ),
          },
          {
            path: 'announcements',
            title: 'Announcements | Bright Way School',
            loadComponent: () =>
              import('./features/admin/announcements/announcements-list').then(
                (m) => m.AnnouncementsList,
              ),
          },
          {
            path: 'announcements/new',
            title: 'Add Announcement | Bright Way School',
            loadComponent: () =>
              import('./features/admin/announcements/announcement-form').then(
                (m) => m.AnnouncementForm,
              ),
          },
          {
            path: 'announcements/:id/edit',
            title: 'Edit Announcement | Bright Way School',
            loadComponent: () =>
              import('./features/admin/announcements/announcement-form').then(
                (m) => m.AnnouncementForm,
              ),
          },
          {
            path: 'gallery',
            title: 'Gallery | Bright Way School',
            loadComponent: () =>
              import('./features/admin/gallery/gallery-list').then(
                (m) => m.GalleryList,
              ),
          },
          {
            path: 'gallery/new',
            title: 'Add Gallery Image | Bright Way School',
            loadComponent: () =>
              import('./features/admin/gallery/gallery-form').then(
                (m) => m.GalleryForm,
              ),
          },
          {
            path: 'gallery/:id/edit',
            title: 'Edit Gallery Image | Bright Way School',
            loadComponent: () =>
              import('./features/admin/gallery/gallery-form').then(
                (m) => m.GalleryForm,
              ),
          },
          {
            path: 'facilities',
            title: 'Facilities | Bright Way School',
            loadComponent: () =>
              import('./features/admin/facilities/facilities-list').then(
                (m) => m.FacilitiesList,
              ),
          },
          {
            path: 'facilities/new',
            title: 'Add Facility | Bright Way School',
            loadComponent: () =>
              import('./features/admin/facilities/facility-form').then(
                (m) => m.FacilityForm,
              ),
          },
          {
            path: 'facilities/:id/edit',
            title: 'Edit Facility | Bright Way School',
            loadComponent: () =>
              import('./features/admin/facilities/facility-form').then(
                (m) => m.FacilityForm,
              ),
          },
          {
            path: 'settings',
            title: 'Site Settings | Bright Way School',
            loadComponent: () =>
              import('./features/admin/settings/site-settings-form').then(
                (m) => m.SiteSettingsForm,
              ),
          },
          {
            path: 'contact-messages',
            title: 'Contact Requests | Bright Way School',
            loadComponent: () =>
              import('./features/admin/contact-messages/contact-messages-list').then(
                (m) => m.ContactMessagesList,
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

      // About Us
      {
        path: 'about',
        title: 'About Us | Bright Way School',
        loadComponent: () => import('./features/public/about/about').then((m) => m.About),
      },
      {
        path: 'about/our-school',
        title: 'Our School | Bright Way School',
        data: { slug: 'about-our-school', eyebrow: 'About Us · Our School' },
        loadComponent: () =>
          import('./features/public/about-story/about-story').then((m) => m.AboutStory),
      },
      {
        path: 'about/vision-mission',
        title: 'Vision & Mission | Bright Way School',
        data: { slug: 'about-vision-mission', eyebrow: 'About Us · Vision & Mission' },
        loadComponent: () =>
          import('./features/public/about-story/about-story').then((m) => m.AboutStory),
      },
      {
        path: 'about/management',
        title: 'Management | Bright Way School',
        loadComponent: () =>
          import('./features/public/about-management/about-management').then(
            (m) => m.AboutManagement,
          ),
      },
      {
        path: 'about/history',
        title: 'History & Legacy | Bright Way School',
        data: { slug: 'about-history', eyebrow: 'About Us · History & Legacy' },
        loadComponent: () =>
          import('./features/public/about-story/about-story').then((m) => m.AboutStory),
      },

      // Academics
      {
        path: 'academics',
        title: 'Academics | Bright Way School',
        loadComponent: () =>
          import('./features/public/academics/academics').then((m) => m.Academics),
      },
      {
        path: 'academics/kindergarten',
        title: 'Kindergarten | Bright Way School',
        data: { slug: 'academics-kindergarten' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'academics/primary-school',
        title: 'Primary School | Bright Way School',
        data: { slug: 'academics-primary' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'academics/middle-school',
        title: 'Middle School | Bright Way School',
        data: { slug: 'academics-middle' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'academics/high-school',
        title: 'High School | Bright Way School',
        data: { slug: 'academics-high' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },

      // Events aliases & redirects
      {
        path: 'events',
        redirectTo: 'school-life/events',
        pathMatch: 'full',
      },
      {
        path: 'events/celebrations',
        redirectTo: 'school-life/events',
        pathMatch: 'full',
      },
      {
        path: 'events/student-activities',
        redirectTo: 'school-life/student-activities',
        pathMatch: 'full',
      },
      {
        path: 'events/sports',
        redirectTo: 'school-life/sports',
        pathMatch: 'full',
      },
      {
        path: 'events/arts-culture',
        redirectTo: 'school-life/arts-culture',
        pathMatch: 'full',
      },
      {
        path: 'events/clubs',
        redirectTo: 'school-life/clubs',
        pathMatch: 'full',
      },
      {
        path: 'events/achievements',
        redirectTo: 'school-life/achievements',
        pathMatch: 'full',
      },

      // School Life
      {
        path: 'school-life',
        title: 'School Life | Bright Way School',
        loadComponent: () =>
          import('./features/public/school-life/school-life').then((m) => m.SchoolLife),
      },
      {
        path: 'school-life/events',
        title: 'Events & Celebrations | Bright Way School',
        data: { slug: 'school-life-events' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'school-life/student-activities',
        title: 'Student Activities | Bright Way School',
        data: { slug: 'school-life-student-activities' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'school-life/sports',
        title: 'Sports & Games | Bright Way School',
        data: { slug: 'school-life-sports' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'school-life/arts-culture',
        title: 'Arts & Culture | Bright Way School',
        data: { slug: 'school-life-arts-culture' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'school-life/clubs',
        title: 'Clubs & Activities | Bright Way School',
        data: { slug: 'school-life-clubs' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'school-life/achievements',
        title: 'Student Achievements | Bright Way School',
        data: { slug: 'school-life-achievements' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },

      // Facilities
      {
        path: 'facilities',
        title: 'Facilities | Bright Way School',
        loadComponent: () =>
          import('./features/public/facilities/facilities').then((m) => m.Facilities),
      },
      {
        path: 'facilities/classrooms',
        title: 'Classrooms | Bright Way School',
        data: { slug: 'facilities-classrooms' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'facilities/library',
        title: 'Library | Bright Way School',
        data: { slug: 'facilities-library' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'facilities/computer-lab',
        title: 'Computer Lab | Bright Way School',
        data: { slug: 'facilities-computer-lab' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'facilities/sports',
        title: 'Sports Facilities | Bright Way School',
        data: { slug: 'facilities-sports' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },
      {
        path: 'facilities/other',
        title: 'Other Facilities | Bright Way School',
        data: { slug: 'facilities-other' },
        loadComponent: () =>
          import('./features/public/content-page/content-page').then((m) => m.ContentPage),
      },

      // Gallery
      {
        path: 'gallery',
        title: 'Gallery | Bright Way School',
        loadComponent: () => import('./features/public/gallery/gallery').then((m) => m.Gallery),
      },

      // Announcements
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
        path: 'contact',
        title: 'Contact Us | Bright Way School',
        loadComponent: () => import('./features/public/contact/contact').then((m) => m.Contact),
      },
      {
        path: '**',
        title: 'Page Not Found | Bright Way School',
        loadComponent: () =>
          import('./features/public/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
