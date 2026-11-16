import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { PhotoScrollDirective } from '../../directives/photo-scroll.directive';

export type MediaRatio = '16/9' | '16/10' | '4/3' | '3/2' | '1/1' | '3/4';

@Component({
  selector: 'app-media-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhotoScrollDirective],
  styleUrl: './media-frame.scss',
  templateUrl: './media-frame.html',
})
export class MediaFrame {
  readonly src = input.required<string>();
  readonly alt = input('');
  readonly ratio = input<MediaRatio>('4/3');
  readonly position = input('center');
  readonly eager = input(false);
  protected readonly failed = signal(false);
}
