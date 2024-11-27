const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

// Define constants for folder paths
const ROOT_DIR = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT_DIR, "public", "assets", "images");
const OPTIMIZED_DIR = path.join(SRC_DIR, "optimized");

// Breakpoints for resizing
const BREAKPOINTS = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
];

// Metadata constants
const METADATA_FILENAME = "images-metadata.json";
const DEFAULT_FOLDER = "default";
const WEBP_EXTENSION = ".webp";
const IMAGES_TO_PROCESS_EXTENSIONS = /\.(jpg|jpeg|png)$/i;

// Default WebP quality setting
const WEBP_QUALITY = 80;

// Metadata object to collect image information
const metadata = {};

// Function to get image dimensions
async function getImageDimensions(imagePath) {
  try {
    const { width, height } = await sharp(imagePath).metadata();
    return { width, height };
  } catch (err) {
    console.error(`Error getting dimensions of ${imagePath}: ${err.message}`);
    return null;
  }
}

// Function to create a base64 WebP placeholder
async function generateBase64Placeholder(inputPath) {
  try {
    const buffer = await sharp(inputPath)
      .resize({ width: 32, height: 32 }) // Resize to 32x32
      .webp({ quality: 50 }) // Lower quality for smaller base64 size
      .toBuffer();
    return `data:image/webp;base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error(
      `[ERROR] Failed to generate placeholder for ${inputPath}: ${err.message}`
    );
    return null;
  }
}

// Function to convert image to WebP
async function convertImageToWebP(inputPath, outputPath, width = null) {
  try {
    const sharpInstance = sharp(inputPath);
    if (width) {
      sharpInstance.resize({ width }); // Resize if width is specified
    }
    await sharpInstance.webp({ quality: WEBP_QUALITY }).toFile(outputPath);
    console.log(
      `[INFO] Converted ${inputPath} -> ${outputPath} (width: ${
        width || "default"
      })`
    );
  } catch (err) {
    console.error(
      `[ERROR] Failed to convert ${inputPath} to WebP: ${err.message}`
    );
  }
}

async function processImage(fullPath, relativePath, fileNameWithExt) {
  const fileExt = path.extname(fileNameWithExt).toLowerCase();
  const fileName = path.basename(fileNameWithExt, fileExt);

  const dimensions = await getImageDimensions(fullPath);
  if (!dimensions) return;

  const { width: defaultWidth, height: defaultHeight } = dimensions;

  const imagePaths = []; // Array to collect paths of all created images
  const sizes = []; // Array to collect available sizes

  const placeholder = await generateBase64Placeholder(fullPath);

  // Process image for each breakpoint
  for (const breakpoint of BREAKPOINTS) {
    if (breakpoint > defaultWidth) break;

    // Folder structure for optimized images is directly under the breakpoint folder
    const breakpointFolder = path.join(OPTIMIZED_DIR, `${breakpoint}`);
    await fs.ensureDir(breakpointFolder); // Ensure the breakpoint folder exists

    // Maintain source subfolder structure under the appropriate breakpoint
    const outputFilePath = path.join(
      breakpointFolder,
      relativePath,
      `${fileName}${WEBP_EXTENSION}`
    );
    await fs.ensureDir(path.dirname(outputFilePath)); // Ensure the path for subfolders exists
    await convertImageToWebP(fullPath, outputFilePath, breakpoint);

    imagePaths.push(outputFilePath); // Collect the path for metadata
    sizes.push(breakpoint); // Collect available sizes for metadata

    // Normalize relativePath to use `/` instead of `\\`
    const normalizedRelativePath = path
      .join(relativePath, fileNameWithExt)
      .replace(/\\/g, "/");
    const normalizedKey = normalizedRelativePath.replace(
      path.extname(normalizedRelativePath),
      ""
    ); // Remove extension from key

    if (!metadata[normalizedKey]) {
      // Update with the correct "default" path from the source folder
      metadata[normalizedKey] = {
        default: `/assets/images/${normalizedRelativePath}`, // Correct path to default image
        width: defaultWidth,
        height: defaultHeight,
        sizes: sizes,
        placeholder: placeholder,
      };
    }
  }

  // Generate "default" WebP version for the image (in the `default` folder)
  const defaultFolder = path.join(OPTIMIZED_DIR, DEFAULT_FOLDER, relativePath);
  await fs.ensureDir(defaultFolder); // Ensure the "default" folder exists

  // Build the output path for the default WebP image
  const defaultWebPPath = path.join(
    defaultFolder,
    `${fileName}${WEBP_EXTENSION}`
  );
  await convertImageToWebP(fullPath, defaultWebPPath); // Convert and save the default image as WebP

  console.log(
    `[INFO] Default WebP created for ${fileNameWithExt} at ${defaultWebPPath}`
  );

  // Add the "default" WebP image path to the metadata
  const normalizedRelativePathForDefault = path
    .join(relativePath, fileNameWithExt)
    .replace(/\\/g, "/");
  const normalizedKeyForDefault = normalizedRelativePathForDefault.replace(
    path.extname(normalizedRelativePathForDefault),
    ""
  ); // Remove extension from key

  if (!metadata[normalizedKeyForDefault]) {
    metadata[normalizedKeyForDefault] = {
      default: `/assets/images/${normalizedRelativePathForDefault}`, // Path to the default image
      width: defaultWidth,
      height: defaultHeight,
      sizes: sizes, // Sizes will be the same for the default
    };
  }

  // If no images were created for the breakpoints, don't create empty folders
  if (imagePaths.length === 0) {
    return;
  }

  console.log(
    `[SUCCESS] Processed image and metadata updated for ${relativePath}/${fileNameWithExt}`
  );
}

// Function to scan folders recursively and process images
async function scanAndConvertFolder(folderPath) {
  try {
    if (folderPath.includes(OPTIMIZED_DIR)) return; // Skip the "optimized" folder

    const files = await fs.readdir(folderPath);

    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        await scanAndConvertFolder(fullPath); // Recursively process subfolders
      } else if (IMAGES_TO_PROCESS_EXTENSIONS.test(file)) {
        const fileName = path.basename(file, path.extname(file));
        const relativePath = path.relative(SRC_DIR, folderPath);

        await processImage(fullPath, relativePath, file);
      }
    }
  } catch (err) {
    console.error(
      `[ERROR] Failed to process folder ${folderPath}: ${err.message}`
    );
  }
}

// Start the process
(async () => {
  await scanAndConvertFolder(SRC_DIR);
  const metadataPath = path.join(OPTIMIZED_DIR, METADATA_FILENAME);
  await fs.writeJson(metadataPath, metadata, { spaces: 2 });
  console.log(
    "[COMPLETE] Image processing completed and images-metadata.json generated."
  );
})();
