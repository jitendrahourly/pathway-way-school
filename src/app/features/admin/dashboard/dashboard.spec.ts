import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { Dashboard } from './dashboard';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';

describe('Dashboard', () => {
  beforeEach(async () => {
    const mockAuth = {
      profile: () => ({ id: '1', full_name: 'Admin', role: 'admin' }),
      loading: () => false,
      logout: vi.fn(),
      ensureSession: vi.fn().mockResolvedValue(undefined),
    };
    const mockContent = {
      loading: () => false,
      error: () => null,
      select: vi.fn().mockResolvedValue([]),
    };
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        { provide: AdminAuthService, useValue: mockAuth },
        { provide: ContentService, useValue: mockContent },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    expect(TestBed.createComponent(Dashboard).componentInstance).toBeTruthy();
  });
});
