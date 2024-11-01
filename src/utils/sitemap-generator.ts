import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const generateSitemap = async (hostname: string) => {
  // An array of all pages in your site
  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/generator', changefreq: 'daily', priority: 0.9 },
    { url: '/profile', changefreq: 'weekly', priority: 0.8 },
    { url: '/settings', changefreq: 'monthly', priority: 0.7 },
  ];

  // Create a stream to write to
  const stream = new SitemapStream({ hostname });

  // Return a promise that resolves with your XML string
  return streamToPromise(Readable.from(links).pipe(stream)).then((data: Buffer) =>
    data.toString()
  );
};

export default generateSitemap; 