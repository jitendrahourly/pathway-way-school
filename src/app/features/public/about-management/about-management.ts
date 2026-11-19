import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ManagementContentService } from '../../../core/services/management-content.service';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-about-management',
  imports: [RouterLink, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-management.html',
  styleUrl: './about-management.scss',
})
export class AboutManagement implements OnInit {
  private readonly service = inject(ManagementContentService);
  protected readonly content = this.service.content;
  protected readonly managedBy = computed(() => {
    const fact = this.content().facts.find((item) => /managed\s*by/i.test(item.label));
    return fact?.value?.trim() ?? '';
  });

  ngOnInit(): void {
    void this.service.load();
  }

  protected initials(name: string): string {
    return name
      .replace(/^(Mrs|Mr|Ms|Dr)\.?\s+/i, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}
