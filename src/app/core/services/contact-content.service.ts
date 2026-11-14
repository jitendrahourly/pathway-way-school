import { Service, signal } from '@angular/core';
import { CONTACT_CONTENT } from '../data/contact.seed';
import type { ContactContent } from '../models/contact-content.model';

/**
 * Page copy for the Contact Us page. Confirmed school facts (phone, email,
 * address, Instagram, map URL) come from site settings.
 * Phase 4 replaces the seed with a Supabase read of the page record.
 */
@Service()
export class ContactContentService {
  private readonly state = signal<ContactContent>(CONTACT_CONTENT);

  readonly content = this.state.asReadonly();
}
