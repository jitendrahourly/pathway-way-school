import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconName, UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'app-section-heading',
  imports: [RouterLink, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './section-heading.scss',
  templateUrl: './section-heading.html',
})
export class SectionHeading {
  readonly title = input.required<string>();
  readonly eyebrow = input<string>();
  readonly icon = input<IconName>();
  readonly link = input<string>();
  readonly linkLabel = input('View All');
  readonly align = input<'left' | 'center'>('left');
}
