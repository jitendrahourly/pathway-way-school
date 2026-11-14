import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Gallery } from './gallery';

describe('Gallery', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gallery],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    expect(TestBed.createComponent(Gallery).componentInstance).toBeTruthy();
  });
});
