import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CONTENT_PAGES, type ContentPageData } from '../../../core/data/content-pages.seed';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-content-page',
  imports: [PageBanner, MediaFrame, UiIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './content-page.html',
  styleUrl: './content-page.scss',
})
export class ContentPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly slug = this.route.snapshot.data['slug'] ?? '';
  protected readonly page: ContentPageData | undefined = CONTENT_PAGES[this.slug];

  protected readonly openFaq = signal<number | null>(0);

  protected toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }
}
