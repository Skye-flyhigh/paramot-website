import type { Metadata } from 'next';
import Link from 'next/link';

import BlogCard from '@/components/blog/BlogCard';
import JsonLd from '@/components/seo/JsonLd';
import ContactModal from '@/components/ui/contact-modal';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getAllBlogPosts } from '@/data/blog-posts';
import { BUSINESS, SITE_URL } from '@/lib/metadata.const';

export const metadata: Metadata = {
  title: `Blog — Paraglider Servicing Insights | ${BUSINESS.name}`,
  description:
    'Articles on paraglider maintenance, fabric testing, trim measurement, and equipment care from an APPI-certified technician workshop in South Wales.',
  keywords: [
    'paraglider maintenance blog',
    'paragliding servicing articles',
    'wing care tips',
    'paraglider fabric testing',
    'APPI technician blog',
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: `Blog | ${BUSINESS.name}`,
    description:
      'Paraglider servicing insights from an APPI-certified workshop. Maintenance tips, technical deep dives, and industry updates.',
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${BUSINESS.name} Blog`,
    description: 'Paraglider servicing insights from an APPI-certified workshop.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'LocalBusiness',
      name: BUSINESS.name,
    },
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={blogSchema} />
      <JsonLd data={itemListSchema} />
      <main className="pm-page">
        <div className="pm-container-lg">
          <div className="mb-12 text-center">
            <h1 className="hero-reveal mb-3 pm-page-title">Blog</h1>
            <p className="hero-reveal-1 mx-auto max-w-2xl text-lg text-sky-700">
              Practical insights on paraglider maintenance, fabric science, and equipment
              care — from the workshop floor.
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-sky-600">
              Posts coming soon. Check back shortly.
            </p>
          )}

          <ScrollReveal delay={0.3}>
            <div className="mt-12 pm-card-cta">
              <h2 className="mb-2 text-xl font-bold text-sky-900">
                Have a topic you&apos;d like us to cover?
              </h2>
              <p className="mb-4 text-sky-700">
                We write about what matters to pilots. If there&apos;s something
                you&apos;ve always wondered about your equipment, let us know.
              </p>
              <ContactModal className="pm-btn">Suggest a topic</ContactModal>
            </div>
          </ScrollReveal>

          <div className="mt-8 text-center">
            <Link href="/" className="pm-link">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
