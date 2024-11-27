import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { IMAGE_LOADER } from '@angular/common';
import { localImagePathFormatter } from '@shared/providers/local-image-path-formatter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: IMAGE_LOADER,
      useValue: localImagePathFormatter,
    },
  ],
};
