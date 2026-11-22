import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { UiIcon } from '../../../../shared/components/ui-icon/ui-icon';
import type { IconName } from '../../../../shared/components/ui-icon/ui-icon';

/**
 * Compact, expandable row for a repeatable content item shared by the
 * page-content editors. The collapsed header shows a chevron, an optional
 * thumbnail (image or icon), the item title and a meta line, plus a remove
 * action. The item's fields are projected and stay mounted while collapsed.
 */
@Component({
  selector: 'app-editor-item',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './editor-item.scss',
  templateUrl: './editor-item.html',
})
export class EditorItemComponent {
  readonly title = input<string>('');
  readonly meta = input<string>('');
  readonly thumbIcon = input<string>('');
  readonly thumbSrc = input<string>('');
  readonly removeLabel = input<string>('Remove');
  readonly expanded = input<boolean>(false);
  readonly toggle = output<void>();
  readonly remove = output<void>();

  protected readonly icon = computed(() => this.thumbIcon() as IconName);
  protected readonly hasThumb = computed(() => !!this.thumbSrc() || !!this.thumbIcon());
}
