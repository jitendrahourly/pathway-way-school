import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

export type AdmissionsPreviewSection = 'banner' | 'intro' | 'sections' | 'contact';

export interface AdmissionsPreviewInfoSection {
  readonly id: string;
  readonly title: string;
  readonly message: string;
}

export interface AdmissionsPreviewData {
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
    readonly note: string;
  };
  readonly sections: readonly AdmissionsPreviewInfoSection[];
  readonly contact: {
    readonly title: string;
    readonly intro: string;
    readonly note: string;
  };
}

/**
 * Read-only miniature of the public Admissions page. Each instance renders
 * one section so the editor can place a live preview above its fields.
 */
@Component({
  selector: 'app-admissions-preview',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admissions-preview.html',
  styleUrl: './admissions-preview.scss',
})
export class AdmissionsPreview {
  readonly section = input.required<AdmissionsPreviewSection>();
  readonly data = input.required<AdmissionsPreviewData>();
}
