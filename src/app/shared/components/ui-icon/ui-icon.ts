import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'phone'
  | 'mail'
  | 'map-pin'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'menu'
  | 'close'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'graduation-cap'
  | 'users'
  | 'trophy'
  | 'heart'
  | 'eye'
  | 'target'
  | 'book-open'
  | 'flask'
  | 'monitor'
  | 'calendar'
  | 'megaphone'
  | 'image'
  | 'chevron-right'
  | 'clock'
  | 'external-link'
  | 'check';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './ui-icon.scss',
  templateUrl: './ui-icon.html',
})
export class UiIcon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
}
