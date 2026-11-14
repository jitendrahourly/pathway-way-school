import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Announcements } from './announcements';

describe('Announcements', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Announcements],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    expect(TestBed.createComponent(Announcements).componentInstance).toBeTruthy();
  });
});
