import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  author?: string;
  language?: string;
  imageAlt?: string;
  h1?: string;
}

const DEFAULT_KEYWORDS = 'AI book writing, book generator, story creation, artificial intelligence writing, automated book creation, creative writing tool, novel generator, story generator, writing assistant, AI storytelling, BookAI';

export const SEO = ({
  title = 'BookAI - Create Books with Artificial Intelligence',
  description = 'Create professional books instantly with AI. Generate, edit, and publish books in minutes. Transform your ideas into captivating stories with BookAI.',
  canonicalUrl = 'https://app.trybookai.com',
  ogImage = '/AppImages/og-image.jpg',
  ogType = 'website',
  keywords = DEFAULT_KEYWORDS,
  author = 'BookAI',
  language = 'en',
  imageAlt = 'BookAI - AI Book Generation Platform',
  h1 = 'Create Professional Books with AI'
}: SEOProps) => {
  const defaultTitle = 'BookAI - Create Books with Artificial Intelligence';
  const fullTitle = title === defaultTitle ? title : `${title} | BookAI`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:site_name" content="BookAI" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={imageAlt} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Schema.org Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "BookAI",
          "headline": h1,
          "description": description,
          "url": canonicalUrl,
          "applicationCategory": "Writing Software",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "creator": {
            "@type": "Organization",
            "name": "BookAI",
            "logo": {
              "@type": "ImageObject",
              "url": `${canonicalUrl}/AppImages/logo.png`,
              "width": "512",
              "height": "512"
            }
          },
          "image": {
            "@type": "ImageObject",
            "url": `${canonicalUrl}${ogImage}`,
            "width": "1200",
            "height": "630"
          }
        })}
      </script>
    </Helmet>
  );
}; 