import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeEvent } from '../../../../../core/models/home-content.model';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

const FALLBACK_IMAGES: readonly string[] = [
  '/images/gallery/gallery-01.jpg',
  '/images/gallery/gallery-04.jpg',
  '/images/gallery/gallery-03.jpg',
];

interface EventCard extends HomeEvent {
  readonly imageUrl: string;
}

@Component({
  selector: 'app-home-events',
  imports: [RouterLink, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-events.scss',
  templateUrl: './home-events.html',
})
export class HomeEvents {
  private readonly content = inject(HomeContentService).content;

  protected readonly head = computed(() => this.content().headings.events);
  protected readonly events = computed<readonly EventCard[]>(() =>
    this.content().events.map((event, index) => ({
      ...event,
      imageUrl: event.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    })),
  );
}
