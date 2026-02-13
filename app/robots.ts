import type { MetadataRoute } from 'next'

export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://calculatesalary.us/sitemap.xml',
  }
}
