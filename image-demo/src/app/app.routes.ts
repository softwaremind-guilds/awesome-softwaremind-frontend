import { Routes } from '@angular/router';
import { GalleryOriginalComponent } from 'src/components/gallery-original/gallery-original.component';
import { GalleryComponent } from 'src/components/gallery/gallery.component';

export const routes: Routes = [
  { path: 'gallery', component: GalleryComponent },
  { path: 'gallery-original', component: GalleryOriginalComponent },
];
