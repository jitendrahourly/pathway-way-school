import { Service, inject, signal } from '@angular/core';
import { CONTACT_CONTENT, resolveContactContent } from '../data/contact.seed';
import type { ContactContent } from '../models/contact-content.model';
import { PageContentsService } from './page-contents.service';

@Service()
export class ContactContentService {
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<ContactContent>(CONTACT_CONTENT);

  readonly content = this.state.asReadonly();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    const saved = await this.pageContents.load<Partial<ContactContent>>('contact');
    if (saved) {
      this.state.set(resolveContactContent(saved));
    }
  }
}
