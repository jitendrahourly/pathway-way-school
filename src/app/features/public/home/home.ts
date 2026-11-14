import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeAbout } from './sections/home-about/home-about';
import { HomeFacilities } from './sections/home-facilities/home-facilities';
import { HomeHero } from './sections/home-hero/home-hero';
import { HomeHighlights } from './sections/home-highlights/home-highlights';
import { HomeInstagram } from './sections/home-instagram/home-instagram';
import { HomeUpdates } from './sections/home-updates/home-updates';

@Component({
  selector: 'app-home',
  imports: [
    HomeHero,
    HomeHighlights,
    HomeAbout,
    HomeFacilities,
    HomeUpdates,
    HomeInstagram,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
