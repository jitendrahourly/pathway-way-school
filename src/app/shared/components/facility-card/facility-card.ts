import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Facility } from '../../../core/models/facility.model';
import { MediaFrame } from '../media-frame/media-frame';
import { TiltCardDirective } from '../../directives/tilt-card.directive';

@Component({
  selector: 'app-facility-card',
  imports: [MediaFrame, TiltCardDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './facility-card.scss',
  templateUrl: './facility-card.html',
})
export class FacilityCard {
  readonly facility = input.required<Facility>();
  /** Grid variant: keeps the card to image + title, hiding the description. */
  readonly compact = input(false);
}
