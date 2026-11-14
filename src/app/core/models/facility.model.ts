export interface Facility {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly displayOrder: number;
  readonly isActive: boolean;
}
