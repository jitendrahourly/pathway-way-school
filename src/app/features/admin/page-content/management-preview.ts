import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

export type ManagementPreviewSection = 'banner' | 'principal' | 'facts' | 'faculty';

export interface ManagementPreviewFact {
  readonly icon: IconName;
  readonly label: string;
  readonly value: string;
}

export interface ManagementPreviewFaculty {
  readonly name: string;
  readonly role: string;
  readonly subject: string;
  readonly qualification: string;
  readonly experience: string;
  readonly imageUrl: string;
}

export interface ManagementPreviewData {
  readonly banner: {
    readonly title: string;
    readonly subtitle: string;
    readonly imageUrl: string;
    readonly imageAlt: string;
  };
  readonly paragraphs: readonly string[];
  readonly principal: {
    readonly name: string;
    readonly role: string;
    readonly message: string;
    readonly messageSecondary: string;
    readonly imageUrl: string;
  };
  readonly facts: readonly ManagementPreviewFact[];
  readonly facultyIntro: string;
  readonly faculty: readonly ManagementPreviewFaculty[];
  readonly facultyNote: string;
}

/**
 * Read-only miniature of the public About Management page. Each instance renders
 * one section so the editor can place a live preview above that section's fields.
 */
@Component({
  selector: 'app-management-preview',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './management-preview.html',
  styleUrl: './management-preview.scss',
})
export class ManagementPreview {
  readonly section = input.required<ManagementPreviewSection>();
  readonly data = input.required<ManagementPreviewData>();
}
