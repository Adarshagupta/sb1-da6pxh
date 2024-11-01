import { SitemapStream, streamToPromise, EnumChangefreq } from 'sitemap';
import type { SitemapItem } from 'sitemap';
import { Readable } from 'stream';

const generateSitemap = async (hostname: string) => {
  const links: SitemapItem[] = [
    { url: '/', changefreq: EnumChangefreq.DAILY, priority: 1.0 },
    { url: '/generator', changefreq: EnumChangefreq.DAILY, priority: 0.9 },
    { url: '/profile', changefreq: EnumChangefreq.WEEKLY, priority: 0.8 },
    { url: '/settings', changefreq: EnumChangefreq.MONTHLY, priority: 0.7 },
  ];

  const stream = new SitemapStream({ hostname });

  return streamToPromise(Readable.from(links).pipe(stream)).then((data: Buffer) =>
    data.toString()
  );
};

export default generateSitemap; 