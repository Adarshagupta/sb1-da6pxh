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
}

export const SEO = ({
  title = 'BookAI - AI-Powered Book Writing Platform',
  description = 'Unleash the power of AI to create captivating books in minutes. Generate, download, and distribute unlimited free books with BookAI.',
  canonicalUrl = 'https://bookai.app',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  keywords = 'AI book writing, artificial intelligence books, book generator, free book creation, automated writing, AI writer, book publishing',
  author = 'BookAI',
  language = 'en'
}: SEOProps) => {
  const defaultTitle = 'BookAI - AI-Powered Book Writing Platform';
  const fullTitle = title === defaultTitle ? title : `${title} | BookAI`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="language" content={language} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="BookAI" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
}; 