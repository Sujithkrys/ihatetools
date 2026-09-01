import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools-data';

export default function sitemap(): MetadataRoute.Sitemap {
  // Use the canonical custom domain if available, fallback to Vercel preview URL, or localhost for dev.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/tools',
    '/tools/pdf',
    '/tools/image',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic tool routes mapped directly from our shared data source
  const toolRoutes = TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...toolRoutes];
}
