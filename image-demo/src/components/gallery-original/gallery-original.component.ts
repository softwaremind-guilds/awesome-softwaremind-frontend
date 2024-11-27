import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery-original',
  templateUrl: './gallery-original.component.html',
  styleUrls: ['./gallery-original.component.scss'],
  imports: [CommonModule],
})
export class GalleryOriginalComponent {
  images = [
    {
      url: 'assets/images/pic-1.jpg',
      alt: 'Placeholder 1',
    },
    {
      url: 'assets/images/pic-2.jpg',
      alt: 'Placeholder 2',
    },
    {
      url: 'assets/images/pic-3.jpg',
      alt: 'Placeholder 3',
    },
    {
      url: 'assets/images/pic-4.jpg',
      alt: 'Placeholder 4',
    },
    {
      url: 'assets/images/pic-5.jpg',
      alt: 'Placeholder 5',
    },
    {
      url: 'assets/images/pic-6.jpg',
      alt: 'Placeholder 6',
    },
    {
      url: 'assets/images/pic-7.jpg',
      alt: 'Placeholder 7',
    },
    {
      url: 'assets/images/pic-8.jpg',
      alt: 'Placeholder 8',
    },
    {
      url: 'assets/images/pic-9.jpg',
      alt: 'Placeholder 9',
    },
    {
      url: 'assets/images/pic-10.jpg',
      alt: 'Placeholder 10',
    },
  ];
}
