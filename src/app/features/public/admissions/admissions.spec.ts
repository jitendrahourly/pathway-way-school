import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Admissions } from './admissions';

describe('Admissions', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admissions],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    expect(TestBed.createComponent(Admissions).componentInstance).toBeTruthy();
  });
});
