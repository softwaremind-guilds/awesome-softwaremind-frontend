import { Pipe, PipeTransform } from '@angular/core';
import { metadataGrabber } from '@shared/providers/local-image-path-formatter';

@Pipe({ name: 'localImg' })
export class LocalImagePipe implements PipeTransform {
  transform(source: string): {
    width: number;
    height: number;
    placeholder: string;
  } {
    return metadataGrabber(source);
  }
}
