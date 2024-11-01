import generateSitemap from '../src/utils/sitemap-generator';
import fs from 'fs';
import path from 'path';

async function generateAndSaveSitemap() {
  try {
    const hostname = 'https://trybookai.com'; // Replace with your actual domain
    const sitemap = await generateSitemap(hostname);
    
    fs.writeFileSync(
      path.join(process.cwd(), 'public', 'sitemap.xml'),
      sitemap
    );
    
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateAndSaveSitemap(); 