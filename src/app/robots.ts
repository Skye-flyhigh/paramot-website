import { SITE_URL } from '@/lib/metadata.constant';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/workshop/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
