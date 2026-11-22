import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MANAGEMENT_CONTENT } from '../../../core/data/management.seed';
import { mergeWithSeed } from '../../../core/data/seed-merge';
import type {
  ManagementBanner,
  ManagementContent,
  ManagementFact,
  ManagementFaculty,
  ManagementPrincipal,
} from '../../../core/models/management-content.model';
import type { PageContentRecord } from '../../../core/models/supabase.model';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import { ImageUploadFieldComponent } from '../../../shared/components/image-upload-field/image-upload-field';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';
import type { IconName } from '../../../shared/components/ui-icon/ui-icon';
import { EditorItemComponent } from './editor-item/editor-item';
import { EditorSectionComponent } from './editor-section/editor-section';
import { ManagementPreview, type ManagementPreviewData } from './management-preview';

type FormValue = Record<string, any>;

@Component({
  selector: 'app-management-content-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ImageUploadFieldComponent,
    UiIcon,
    ManagementPreview,
    EditorSectionComponent,
    EditorItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './management-content-form.scss',
  templateUrl: './management-content-form.html',
})
export class ManagementContentForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly content = inject(ContentService);
  private readonly adminAuth = inject(AdminAuthService);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);
  protected readonly existingRecord = signal(false);
  protected readonly isPublished = signal(true);

  protected readonly facts = this.fb.array<FormGroup>([]);
  protected readonly faculty = this.fb.array<FormGroup>([]);

  @ViewChildren(ImageUploadFieldComponent)
  protected imageFields!: QueryList<ImageUploadFieldComponent>;

  protected readonly openSections = signal<ReadonlySet<string>>(new Set<string>(['mg-banner']));
  protected readonly openItems = signal<ReadonlySet<string>>(new Set<string>());

  protected isSectionOpen(id: string): boolean {
    return this.openSections().has(id);
  }

  protected toggleSection(id: string): void {
    this.openSections.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected isItemOpen(array: string, index: number | string): boolean {
    return this.openItems().has(`${array}:${index}`);
  }

  protected toggleItem(array: string, index: number | string): void {
    const key = `${array}:${index}`;
    this.openItems.update((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  private openNewItem(array: string, index: number): void {
    const key = `${array}:${index}`;
    this.openItems.update((current) => new Set(current).add(key));
  }

  protected readonly form = this.fb.group({
    banner: this.fb.group({
      title: [''],
      subtitle: [''],
      imageUrl: [''],
      imageAlt: [''],
    }),
    paragraphs: [''],
    principal: this.fb.group({
      name: [''],
      role: [''],
      message: [''],
      messageSecondary: [''],
      imageUrl: [''],
    }),
    facts: this.facts,
    facultyIntro: [''],
    faculty: this.faculty,
    facultyNote: [''],
  });

  protected readonly formValue = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue() as FormValue)),
    { initialValue: this.form.getRawValue() as FormValue },
  );

  protected readonly managementPreview = computed<ManagementPreviewData>(() => {
    const value = this.formValue();
    const banner = (value['banner'] ?? {}) as FormValue;
    const principal = (value['principal'] ?? {}) as FormValue;
    return {
      banner: {
        title: this.text(banner['title']),
        subtitle: this.text(banner['subtitle']),
        imageUrl: this.text(banner['imageUrl']),
        imageAlt: this.text(banner['imageAlt']),
      },
      paragraphs: this.lines(value['paragraphs']),
      principal: {
        name: this.text(principal['name']),
        role: this.text(principal['role']),
        message: this.text(principal['message']),
        messageSecondary: this.text(principal['messageSecondary']),
        imageUrl: this.text(principal['imageUrl']),
      },
      facts: ((value['facts'] ?? []) as FormValue[]).map((fact) => ({
        icon: this.iconName(fact['icon'], 'check'),
        label: this.text(fact['label']),
        value: this.text(fact['value']),
      })),
      facultyIntro: this.text(value['facultyIntro']),
      faculty: ((value['faculty'] ?? []) as FormValue[]).map((member) => ({
        name: this.text(member['name']),
        role: this.text(member['role']),
        subject: this.text(member['subject']),
        qualification: this.text(member['qualification']),
        experience: this.text(member['experience']),
        imageUrl: this.text(member['imageUrl']),
      })),
      facultyNote: this.text(value['facultyNote']),
    };
  });

  private text(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private lines(value: unknown): string[] {
    return String(value ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  private iconName(value: unknown, fallback: IconName): IconName {
    const val = typeof value === 'string' ? value.trim() : '';
    const valid: readonly string[] = [
      'phone', 'mail', 'map-pin', 'instagram', 'facebook', 'youtube', 'menu', 'close',
      'arrow-right', 'arrow-up-right', 'graduation-cap', 'users', 'trophy', 'heart',
      'eye', 'target', 'book-open', 'flask', 'monitor', 'calendar', 'megaphone',
      'image', 'chevron-right', 'clock', 'external-link', 'check',
    ];
    return valid.includes(val) ? (val as IconName) : fallback;
  }

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const row = await this.content.selectById<PageContentRecord>(
        'page_contents',
        'page_slug',
        'about-management',
      );
      this.existingRecord.set(row !== null);
      this.isPublished.set(row?.is_published ?? true);

      const data = mergeWithSeed(MANAGEMENT_CONTENT, row?.content ?? {});
      this.form.patchValue({
        banner: { ...data.banner },
        paragraphs: data.paragraphs.join('\n'),
        principal: { ...data.principal },
        facultyIntro: data.facultyIntro,
        facultyNote: data.facultyNote,
      });

      this.facts.clear();
      for (const fact of data.facts) {
        this.facts.push(
          this.fb.group({
            icon: [fact.icon],
            label: [fact.label],
            value: [fact.value],
          }),
        );
      }

      this.faculty.clear();
      for (const member of data.faculty) {
        this.faculty.push(
          this.fb.group({
            name: [member.name],
            role: [member.role],
            subject: [member.subject],
            qualification: [member.qualification],
            experience: [member.experience],
            imageUrl: [member.imageUrl ?? ''],
          }),
        );
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load Management content.');
    } finally {
      this.loading.set(false);
    }
  }

  protected addFact(): void {
    this.facts.push(this.fb.group({ icon: ['check'], label: [''], value: [''] }));
    this.openNewItem('facts', this.facts.length - 1);
  }

  protected removeFact(index: number): void {
    this.facts.removeAt(index);
  }

  protected addFaculty(): void {
    this.faculty.push(
      this.fb.group({
        name: [''],
        role: [''],
        subject: [''],
        qualification: [''],
        experience: [''],
        imageUrl: [''],
      }),
    );
    this.openNewItem('faculty', this.faculty.length - 1);
  }

  protected removeFaculty(index: number): void {
    this.faculty.removeAt(index);
  }

  protected async submit(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    const fields = this.imageFields?.toArray() ?? [];
    try {
      for (const field of fields) {
        await field.commit();
      }

      const v = this.form.getRawValue() as FormValue;
      const data: ManagementContent = {
        banner: { ...(v['banner'] as ManagementBanner) },
        paragraphs: this.lines(v['paragraphs']),
        principal: { ...(v['principal'] as ManagementPrincipal) },
        facts: this.facts.getRawValue().map((fact) => ({
          icon: ((fact['icon'] || 'check') as IconName),
          label: fact['label'] ?? '',
          value: fact['value'] ?? '',
        })) as ManagementFact[],
        facultyIntro: (v['facultyIntro'] ?? '').trim(),
        faculty: this.faculty.getRawValue().map((member) => ({
          name: member['name'] ?? '',
          role: member['role'] ?? '',
          subject: member['subject'] ?? '',
          qualification: member['qualification'] ?? '',
          experience: member['experience'] ?? '',
          ...(member['imageUrl'] ? { imageUrl: member['imageUrl'] } : {}),
        })) as ManagementFaculty[],
        facultyNote: (v['facultyNote'] ?? '').trim(),
      };

      const payload: Record<string, unknown> = {
        page_slug: 'about-management',
        content: data,
        is_published: this.isPublished(),
        updated_at: new Date().toISOString(),
        updated_by: this.adminAuth.profile()?.id ?? null,
      };

      if (this.existingRecord()) {
        await this.content.update<PageContentRecord>(
          'page_contents',
          'page_slug',
          'about-management',
          payload as Partial<PageContentRecord>,
        );
        if (this.content.error()) {
          throw new Error(this.content.error()?.message ?? 'Failed to update Management content.');
        }
      } else {
        await this.content.insert<PageContentRecord>(
          'page_contents',
          payload as Partial<PageContentRecord>,
        );
        if (this.content.error()) {
          throw new Error(this.content.error()?.message ?? 'Failed to create Management content.');
        }
      }

      for (const field of fields) {
        try {
          await field.finalize();
        } catch {
          // best-effort cleanup of replaced images
        }
      }

      this.success.set('Management content saved successfully.');
      await this.router.navigateByUrl('/admin/page-content');
    } catch (err) {
      for (const field of fields) {
        try {
          await field.rollback();
        } catch {
          // best-effort cleanup
        }
      }
      this.error.set(err instanceof Error ? err.message : 'Failed to save Management content.');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.router.navigateByUrl('/admin/page-content');
  }
}
