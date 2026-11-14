import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Facilities } from './facilities';

describe('Facilities', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Facilities],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    expect(TestBed.createComponent(Facilities).componentInstance).toBeTruthy();
  });
});
