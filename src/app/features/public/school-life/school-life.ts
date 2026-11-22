import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SchoolLifeContentService } from '../../../core/services/school-life-content.service';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';

/** Card ids pick the sub-page they link to, keeping the routes structural. */
const CARD_PATHS: Record<string, string> = {
  events: '/school-life/events',
  activities: '/school-life/student-activities',
  sports: '/school-life/sports',
  arts: '/school-life/arts-culture',
  clubs: '/school-life/clubs',
  achievements: '/school-life/achievements',
};

@Component({
  selector: 'app-school-life',
  imports: [RouterLink, PageBanner, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './school-life.html',
  styleUrl: './school-life.scss',
})
export class SchoolLife implements OnInit {
  private readonly pageContent = inject(SchoolLifeContentService);

  protected readonly content = this.pageContent.content;
  protected readonly cards = computed(() =>
    this.content().cards.map((card) => ({
      ...card,
      icon: card.icon as IconName,
      path: CARD_PATHS[card.id] ?? '/school-life',
    })),
  );

  ngOnInit(): void {
    void this.pageContent.load();
  }
}
