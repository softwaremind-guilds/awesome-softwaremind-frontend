import { ImageLoaderConfig } from '@angular/common';
import { environment } from '@env';
import metadata from '@assets/images/optimized/images-metadata.json';

const typedMetadata: Record<string, MetadataEntry> = metadata;

type MetadataEntry = {
  default: string;
  width: number;
  height: number;
  sizes: number[];
  placeholder: string;
};

// Define constants for paths, extensions, and default values
const ASSETS_PATH = 'assets/images/optimized';
const DEFAULT_FOLDER = 'default';
const WEBP_EXTENSION = '.webp';
const IMAGE_EXTENSIONS_REGEX = /\.(png|jpg|jpeg|webp)$/i;
const MAX_WIDTH = 3840;

export function localImagePathFormatter(config: ImageLoaderConfig): string {
  // Check if the path starts with 'assets/images/optimized' or '/assets/images/optimized'
  const isValidPath =
    config.src.startsWith(`${ASSETS_PATH}`) ||
    config.src.startsWith(`/${ASSETS_PATH}`);

  if (!isValidPath) {
    if (!environment.production) {
      console.error(
        `Invalid path: ${config.src}. [ngSrc] directive has been configured only for local assets.`
      );
    }
    return config.src;
  }

  const src = config.src
    .replace(new RegExp(`^/?${ASSETS_PATH}/default/`), '') // Remove prefix '/assets/images/optimized/default/'
    .replace(IMAGE_EXTENSIONS_REGEX, ''); // Remove the file extension

  const imageData = typedMetadata[src];

  if (!imageData) {
    console.warn(`No metadata found for ${src}`);
    return config.src;
  }

  const width = config.width ?? MAX_WIDTH;
  const closestSize =
    imageData.sizes.find((size) => size >= width) || DEFAULT_FOLDER;

  return closestSize === DEFAULT_FOLDER
    ? `${ASSETS_PATH}/${DEFAULT_FOLDER}/${src}${WEBP_EXTENSION}`
    : `${ASSETS_PATH}/${closestSize}/${src}${WEBP_EXTENSION}`;
}

export function metadataGrabber(ngSrc: string): {
  width: number;
  height: number;
  placeholder: string;
} {
  const relativeSrc = ngSrc
    .replace(new RegExp(`^/?${ASSETS_PATH}/default/`), '') // Remove the default folder prefix
    .replace(IMAGE_EXTENSIONS_REGEX, ''); // Remove the file extension

  const imageData = typedMetadata[relativeSrc];
  if (!imageData) {
    console.warn(`No metadata found for ${ngSrc}`);
  }
  return {
    width: imageData?.width,
    height: imageData?.height,
    placeholder: imageData?.placeholder,
  };
}
