import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

export type ContactPreviewSection =
  | 'banner'
  | 'intro'
  | 'form'
  | 'cards'
  | 'map'
  | 'directions'
  | 'officeHours'
  | 'instagram'
  | 'schoolDetails';

export interface ContactPreviewData {
  readonly banner: {
    readonly title: string;
    readonly subtitle: string;
    readonly imageUrl: string;
    readonly imageAlt: string;
  };
  readonly intro: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
  readonly form: {
    readonly eyebrow: string;
    readonly title: string;
    readonly intro: string;
    readonly nameLabel: string;
    readonly emailLabel: string;
    readonly phoneLabel: string;
    readonly subjectLabel: string;
    readonly messageLabel: string;
    readonly submitLabel: string;
    readonly successMessage: string;
    readonly errorMessage: string;
  };
  readonly cards: {
    readonly phoneTitle: string;
    readonly emailTitle: string;
    readonly addressTitle: string;
    readonly callLabel: string;
    readonly emailActionLabel: string;
    readonly mapActionLabel: string;
  };
  readonly map: {
    readonly title: string;
    readonly intro: string;
    readonly emptyMessage: string;
  };
  readonly directions: {
    readonly title: string;
    readonly intro: string;
    readonly steps: readonly string[];
  };
  readonly officeHours: {
    readonly title: string;
    readonly lines: readonly string[];
  };
  readonly instagram: {
    readonly eyebrow: string;
    readonly title: string;
    readonly text: string;
    readonly buttonLabel: string;
  };
  readonly schoolDetails: {
    readonly title: string;
    readonly lines: readonly string[];
  };
}

/**
 * Read-only miniature of the public Contact page. Each instance renders one
 * section so the editor can place a live preview above that section's fields.
 */
@Component({
  selector: 'app-contact-preview',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-preview.html',
  styleUrl: './contact-preview.scss',
})
export class ContactPreview {
  readonly section = input.required<ContactPreviewSection>();
  readonly data = input.required<ContactPreviewData>();
}
