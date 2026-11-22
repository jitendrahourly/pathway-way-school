import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Compact, collapsible panel header shared by the page-content editors.
 *
 * Only the header is rendered here; a section's preview and form fields are
 * projected so the parent keeps ownership of its own controls. Collapsing uses
 * a CSS sibling rule (not `@if`) so projected form controls — including pending
 * image uploads — stay mounted while hidden.
 */
@Component({
  selector: 'app-editor-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './editor-section.scss',
  templateUrl: './editor-section.html',
})
export class EditorSectionComponent {
  readonly sectionId = input<string>('');
  readonly step = input<string>('');
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly badge = input<string>('');
  readonly count = input<string>('');
  readonly status = input<string>('');
  readonly statusLive = input<boolean>(true);
  readonly expanded = input<boolean>(false);
  readonly toggle = output<void>();
}
