import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

export type ContentPagePreviewSection =
  | 'banner'
  | 'intro'
  | 'stage'
  | 'headings'
  | 'sections'
  | 'faqs'
  | 'cta';

export interface ContentPagePreviewFact {
  readonly icon: IconName;
  readonly label: string;
  readonly value: string;
}

export interface ContentPagePreviewSectionItem {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly bullets: readonly string[];
}

export interface ContentPagePreviewFaq {
  readonly question: string;
  readonly answer: string;
}

export interface ContentPagePreviewData {
  readonly family: 'academics-' | 'school-life-' | 'facilities-' | null;
  readonly hasPageBlocks: boolean;
  readonly isAcademic: boolean;
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly paragraphs: readonly string[];
  readonly bullets: readonly string[];
  readonly note: string;
  readonly mediaBadge: string;
  readonly overviewEyebrow: string;
  readonly highlightsTitle: string;
  readonly sectionsEyebrow: string;
  readonly sectionsTitle: string;
  readonly faqsEyebrow: string;
  readonly faqsTitle: string;
  readonly faqsSubtitle: string;
  readonly stage: {
    readonly tag: string;
    readonly title: string;
    readonly gradesBadge: string;
    readonly ctaLabel: string;
    readonly facts: readonly ContentPagePreviewFact[];
  } | null;
  readonly sections: readonly ContentPagePreviewSectionItem[];
  readonly faqs: readonly ContentPagePreviewFaq[];
  readonly cta: {
    readonly tag: string;
    readonly title: string;
    readonly text: string;
    readonly primaryLabel: string;
    readonly secondaryLabel: string;
  } | null;
}

/**
 * Read-only miniature of the public content subpage. Each instance renders one
 * section so the editor can place a live preview above that section's fields.
 */
@Component({
  selector: 'app-content-page-preview',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './content-page-preview.html',
  styleUrl: './content-page-preview.scss',
})
export class ContentPagePreview {
  readonly section = input.required<ContentPagePreviewSection>();
  readonly data = input.required<ContentPagePreviewData>();
}
