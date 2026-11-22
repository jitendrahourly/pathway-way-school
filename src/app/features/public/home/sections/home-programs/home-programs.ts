import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeProgram } from '../../../../../core/models/home-content.model';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

const FALLBACK_IMAGES: readonly string[] = [
  '/images/gallery/gallery-02.jpg',
  '/images/home/about-students.jpg',
  '/images/gallery/gallery-04.jpg',
  '/images/gallery/gallery-01.jpg',
];

interface ProgramCard extends HomeProgram {
  readonly imageUrl: string;
}

@Component({
  selector: 'app-home-programs',
  imports: [RouterLink, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-programs.scss',
  templateUrl: './home-programs.html',
})
export class HomePrograms {
  private readonly content = inject(HomeContentService).content;

  protected readonly head = computed(() => this.content().headings.programs);
  protected readonly programs = computed<readonly ProgramCard[]>(() =>
    this.content().programs.map((program, index) => ({
      ...program,
      imageUrl: program.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    })),
  );
}
