import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools-data';
import { getSortedPostsData } from '@/lib/blog';
import { getBaseUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  // Static core routes
  const staticRoutes = [
    '',
    '/about',
    '/blog',
    '/privacy',
    '/terms',
    '/tools/pdf',
    '/tools/image',
    '/tools/audio',
    '/tools/utility',
    '/tools/text',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Tool routes
  const toolRoutes = TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Blog posts
  const blogPosts = getSortedPostsData();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
