import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Academics } from './academics';

describe('Academics', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Academics],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    expect(TestBed.createComponent(Academics).componentInstance).toBeTruthy();
  });
});
