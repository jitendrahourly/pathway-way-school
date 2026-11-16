import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { EducationalHero3D } from '../../../../../shared/components/educational-hero-3d/educational-hero-3d';

@Component({
  selector: 'app-home-hero',
  imports: [RouterLink, UiIcon, EducationalHero3D],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-hero.scss',
  templateUrl: './home-hero.html',
})
export class HomeHero {
  protected readonly content = inject(HomeContentService).content;
  protected readonly imageFailed = signal(false);
}
