import { useEffect } from 'react';

/**
 * SEO Component: Manages Document Metadata
 * Updates title and meta description dynamically
 */
const SEO = ({ title, description, image }) => {
  useEffect(() => {
    // 1. Core Metadata
    const baseTitle = 'A. Mohamed Yasar';
    const finalTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    const finalDesc = description || 'Elite Full Stack Engineer & MERN Stack UI Architect';
    const finalImage = image || 'https://mern-portfolio-yasar-1.onrender.com/og-preview.png';

    document.title = finalTitle;

    const updateMeta = (name, content, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard Meta
    updateMeta('description', finalDesc);

    // Open Graph (LinkedIn / Facebook)
    updateMeta('og:title', finalTitle, true);
    updateMeta('og:description', finalDesc, true);
    updateMeta('og:image', finalImage, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', window.location.href, true);

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', finalTitle);
    updateMeta('twitter:description', finalDesc);
    updateMeta('twitter:image', finalImage);

  }, [title, description, image]);

  return null;
};

export default SEO;
