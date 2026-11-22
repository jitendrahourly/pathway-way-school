import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { HomeContentService } from '../../../core/services/home-content.service';
import { HomeAbout } from './sections/home-about/home-about';
import { HomeAchievements } from './sections/home-achievements/home-achievements';
import { HomeAdmissionsCta } from './sections/home-admissions-cta/home-admissions-cta';
import { HomeAffiliations } from './sections/home-affiliations/home-affiliations';
import { HomeEvents } from './sections/home-events/home-events';
import { HomeFacilities } from './sections/home-facilities/home-facilities';
import { HomeFaqs } from './sections/home-faqs/home-faqs';
import { HomeGalleryPreview } from './sections/home-gallery-preview/home-gallery-preview';
import { HomeHero } from './sections/home-hero/home-hero';
import { HomeHighlights } from './sections/home-highlights/home-highlights';
import { HomeInstagram } from './sections/home-instagram/home-instagram';
import { HomeLocation } from './sections/home-location/home-location';
import { HomeNewsletter } from './sections/home-newsletter/home-newsletter';
import { HomePrograms } from './sections/home-programs/home-programs';
import { HomeStats } from './sections/home-stats/home-stats';
import { HomeTestimonials } from './sections/home-testimonials/home-testimonials';
import { HomeUpdates } from './sections/home-updates/home-updates';
import { HomeVideoTour } from './sections/home-video-tour/home-video-tour';
import { HomeWhy } from './sections/home-why/home-why';

@Component({
  selector: 'app-home',
  imports: [
    HomeHero,
    HomeStats,
    HomeHighlights,
    HomeAbout,
    HomePrograms,
    HomeWhy,
    HomeTestimonials,
    HomeAchievements,
    HomeEvents,
    HomeFaqs,
    HomeAdmissionsCta,
    HomeGalleryPreview,
    HomeAffiliations,
    HomeFacilities,
    HomeUpdates,
    HomeVideoTour,
    HomeNewsletter,
    HomeLocation,
    HomeInstagram,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly service = inject(HomeContentService);

  /** Section visibility switches saved in the admin home page editor. */
  protected readonly show = computed(() => this.service.content().visibility);

  ngOnInit(): void {
    void this.service.load();
  }
}
