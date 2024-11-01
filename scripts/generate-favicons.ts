import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import https from 'https';

async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function generateFavicons() {
  const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 512, name: 'android-chrome-512x512.png' },
    { size: 192, name: 'maskable-192x192.png', maskable: true },
    { size: 512, name: 'maskable-512x512.png', maskable: true },
    { size: 96, name: 'shortcut-96x96.png' },
    { size: 32, name: 'favicon.png' }
  ];

  try {
    console.log('Downloading logo...');
    const imageBuffer = await downloadImage('https://raw.githubusercontent.com/adarshagupta/trybookai/main/logo.png');
    
    const publicDir = path.join(process.cwd(), 'public');
    await fs.mkdir(publicDir, { recursive: true });

    console.log('Generating favicons...');
    for (const { size, name, maskable } of sizes) {
      if (maskable) {
        // Add padding for maskable icons (safe area)
        const padding = Math.floor(size * 0.1);
        await sharp(imageBuffer)
          .resize(size - (padding * 2), size - (padding * 2))
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 79, g: 70, b: 229, alpha: 1 } // Indigo-600
          })
          .toFile(path.join(publicDir, name));
      } else {
        await sharp(imageBuffer)
          .resize(size, size)
          .toFile(path.join(publicDir, name));
      }
      console.log(`Generated ${name}`);
    }

    // Generate screenshots
    console.log('Generating screenshots...');
    await sharp(imageBuffer)
      .resize(1280, 720, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(path.join(publicDir, 'screenshot-wide.jpg'));

    await sharp(imageBuffer)
      .resize(640, 1136, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(path.join(publicDir, 'screenshot-narrow.jpg'));

    // Generate og-image
    console.log('Generating og-image...');
    await sharp(imageBuffer)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(path.join(publicDir, 'og-image.jpg'));
    
    console.log('All assets generated successfully!');
  } catch (error) {
    console.error('Error generating assets:', error);
  }
}

generateFavicons(); 