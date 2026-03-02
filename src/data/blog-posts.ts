// ─── Types ────────────────────────────────────────────────────────

import { BLOG_POSTS } from './blog-content';

export interface BlogImage {
  src: string;
  alt: string;
  caption?: string;
}

export type BlogCategory = 'workshop' | 'equipment-care' | 'technique' | 'industry';

export const BLOG_CATEGORIES: Record<
  BlogCategory,
  { name: string; description: string }
> = {
  workshop: {
    name: 'From the Workshop',
    description: 'What we see, test, and learn during servicing.',
  },
  'equipment-care': {
    name: 'Equipment Care',
    description: 'Practical advice for looking after your gear.',
  },
  technique: {
    name: 'Technical Deep Dives',
    description: 'How things work — trim, porosity, materials.',
  },
  industry: {
    name: 'Industry & Standards',
    description: 'APPI updates, standards, and industry discussion.',
  },
};

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  coverImage?: BlogImage;
  relatedFAQIds?: string[];
  relatedPostSlugs?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────

export function calculateReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;

  return Math.max(1, Math.round(words / 200));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllBlogPosts().filter((p) => p.category === category);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getBlogPostBySlug(slug);

  if (!post) return [];

  // Explicit related posts first, then same category
  const explicit = (post.relatedPostSlugs ?? [])
    .map((s) => getBlogPostBySlug(s))
    .filter((p): p is BlogPost => p !== undefined);

  const sameCategory = getAllBlogPosts().filter(
    (p) =>
      p.slug !== slug &&
      p.category === post.category &&
      !explicit.some((e) => e.slug === p.slug),
  );

  return [...explicit, ...sameCategory].slice(0, limit);
}
