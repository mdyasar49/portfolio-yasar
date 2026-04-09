import { useEffect } from 'react';

/**
 * SEO Component: Manages Document Metadata
 * Updates title and meta description dynamically
 */
const SEO = ({ title, description }) => {
  useEffect(() => {
    // Update Title
    const baseTitle = 'A. Mohamed Yasar';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    // Update Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'Full Stack Engineer Portfolio');
    }
  }, [title, description]);

  return null;
};

export default SEO;
