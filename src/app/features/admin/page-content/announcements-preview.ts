import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AnnouncementsPreviewSection =
  | 'banner'
  | 'intro'
  | 'list'
  | 'empty'
  | 'detail';

export interface AnnouncementsPreviewData {
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
  readonly list: {
    readonly listHeading: string;
    readonly filterLabel: string;
  };
  readonly empty: {
    readonly title: string;
    readonly message: string;
    readonly contactNote: string;
  };
  readonly detail: {
    readonly backLabel: string;
    readonly unavailableTitle: string;
    readonly unavailableMessage: string;
    readonly unavailableLinkLabel: string;
    readonly fallbackBannerSubtitle: string;
  };
}

/**
 * Read-only miniature of the public Announcements page. Each instance renders
 * one section so the editor can place a live preview above that section's fields.
 */
@Component({
  selector: 'app-announcements-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './announcements-preview.html',
  styleUrl: './announcements-preview.scss',
})
export class AnnouncementsPreview {
  readonly section = input.required<AnnouncementsPreviewSection>();
  readonly data = input.required<AnnouncementsPreviewData>();
}
