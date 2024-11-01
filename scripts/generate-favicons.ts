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
    { size: 32, name: 'favicon.png' }
  ];

  try {
    // Download the logo
    console.log('Downloading logo...');
    const imageBuffer = await downloadImage('https://raw.githubusercontent.com/adarshagupta/trybookai/main/logo.png');
    
    // Create public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    await fs.mkdir(publicDir, { recursive: true });

    // Generate different sizes
    console.log('Generating favicons...');
    for (const { size, name } of sizes) {
      await sharp(imageBuffer)
        .resize(size, size)
        .toFile(path.join(publicDir, name));
      console.log(`Generated ${name}`);
    }

    // Create og-image
    console.log('Generating og-image...');
    await sharp(imageBuffer)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(path.join(publicDir, 'og-image.jpg'));
    
    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons(); 