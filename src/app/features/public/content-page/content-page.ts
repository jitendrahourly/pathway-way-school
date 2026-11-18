import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CONTENT_PAGES, type ContentPageData } from '../../../core/data/content-pages.seed';
import { PageContentsService } from '../../../core/services/page-contents.service';
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
export class ContentPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pageContents = inject(PageContentsService);

  protected readonly slug = this.route.snapshot.data['slug'] ?? '';
  protected readonly page = signal<ContentPageData | undefined>(CONTENT_PAGES[this.slug]);

  protected readonly openFaq = signal<number | null>(0);

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const data = await this.pageContents.load<Partial<ContentPageData>>(this.slug);
      if (!data) return;

      const seed = CONTENT_PAGES[this.slug];
      this.page.set({
        title: data.title ?? seed?.title ?? '',
        subtitle: data.subtitle ?? seed?.subtitle ?? '',
        imageUrl: data.imageUrl ?? seed?.imageUrl ?? '',
        imageAlt: data.imageAlt ?? seed?.imageAlt ?? '',
        paragraphs: data.paragraphs ?? seed?.paragraphs ?? [],
        bullets: data.bullets ?? seed?.bullets,
        note: data.note ?? seed?.note,
        faqs: data.faqs ?? seed?.faqs,
      });
    } catch {
      // Keep the seeded page when Supabase content is unavailable.
    }
  }

  protected toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }
}
