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
}

const DEFAULT_KEYWORDS = 'AI book writing, book generator, story creation, artificial intelligence writing, automated book creation, creative writing tool, novel generator, story generator, writing assistant, AI storytelling';

export const SEO = ({
  title = 'BookAI - Create Books with Artificial Intelligence',
  description = 'Transform your ideas into captivating books with BookAI. Our AI-powered platform helps you generate, edit, and publish professional books in minutes. Start creating your next bestseller today!',
  canonicalUrl = 'https://bookai.app',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  keywords = DEFAULT_KEYWORDS,
  author = 'BookAI',
  language = 'en',
  imageAlt = 'BookAI - AI Book Generation Platform'
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
            "name": "BookAI"
          }
        })}
      </script>
    </Helmet>
  );
}; 