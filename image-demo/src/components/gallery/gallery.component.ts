import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { LocalImagePipe } from 'src/pipes/local-image/local-image.pipe';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports: [CommonModule, NgOptimizedImage, LocalImagePipe],
})
export class GalleryComponent {
  images = [
    {
      url: 'assets/images/optimized/default/pic-1.webp',
      alt: 'Placeholder 1',
      priority: true,
    },
    {
      url: 'assets/images/optimized/default/pic-2.webp',
      alt: 'Placeholder 2',
      priority: true,
    },
    {
      url: 'assets/images/optimized/default/pic-3.webp',
      alt: 'Placeholder 3',
    },
    {
      url: 'assets/images/optimized/default/pic-4.webp',
      alt: 'Placeholder 4',
    },
    {
      url: 'assets/images/optimized/default/pic-5.webp',
      alt: 'Placeholder 5',
    },
    {
      url: 'assets/images/optimized/default/pic-6.webp',
      alt: 'Placeholder 6',
    },
    {
      url: 'assets/images/optimized/default/pic-7.webp',
      alt: 'Placeholder 7',
    },
    {
      url: 'assets/images/optimized/default/pic-8.webp',
      alt: 'Placeholder 8',
    },
    {
      url: 'assets/images/optimized/default/pic-9.webp',
      alt: 'Placeholder 9',
    },
    {
      url: 'assets/images/optimized/default/pic-10.webp',
      alt: 'Placeholder 10',
    },
  ];
}
