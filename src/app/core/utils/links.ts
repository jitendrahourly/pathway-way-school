/**
 * Admission routes were retired, so saved or hard-coded links to them now open
 * the not-found page. Send those visitors to the Contact Us page instead.
 */
export function resolveRetiredAdmissionsLink(link: string): string {
  return !link || link.startsWith('/admissions') ? '/contact' : link;
}
