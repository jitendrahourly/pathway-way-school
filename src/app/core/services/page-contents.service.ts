import { Service, inject } from '@angular/core';
import { isPagePreviewMode } from '../data/page-content-previews';
import type { PageContentRecord } from '../models/supabase.model';
import { ContentService } from './content.service';

/**
 * Reads the saved content record for a public page. Anonymous reads are
 * restricted by RLS to published rows, so unpublished page content is not
 * returned to the public site.
 */
@Service()
export class PageContentsService {
  private readonly content = inject(ContentService);

  async load<T extends object>(slug: string): Promise<T | null> {
    const row = await this.content.selectById<PageContentRecord>(
      'page_contents',
      'page_slug',
      slug,
    );
    if (!row?.content) return null;
    // Admin previews may read unpublished rows. RLS still decides whether the
    // current visitor can see the row at all.
    if (!row.is_published && !isPagePreviewMode()) return null;
    return row.content as T;
  }
}
