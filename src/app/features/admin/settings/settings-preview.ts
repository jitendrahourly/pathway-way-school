import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

export type SettingsPreviewSection = 'identity' | 'contact' | 'social' | 'location';

export interface SettingsPreviewData {
  readonly schoolName: string;
  readonly phone: string;
  readonly email: string;
  readonly address: string;
  readonly instagramHandle: string;
  readonly instagramUrl: string;
  readonly facebookUrl: string;
  readonly youtubeUrl: string;
  readonly mapsUrl: string;
}

/**
 * Read-only miniature of how site settings appear across the public site.
 */
@Component({
  selector: 'app-settings-preview',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-preview.html',
  styleUrl: './settings-preview.scss',
})
export class SettingsPreview {
  readonly section = input.required<SettingsPreviewSection>();
  readonly data = input.required<SettingsPreviewData>();
}
