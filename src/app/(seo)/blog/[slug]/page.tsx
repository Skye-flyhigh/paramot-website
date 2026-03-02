import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import BlogContent from '@/components/blog/BlogContent';
import BlogMeta from '@/components/blog/BlogMeta';
import BlogRelated from '@/components/blog/BlogRelated';
import BlogRelatedFAQs from '@/components/blog/BlogRelatedFAQs';
import JsonLd from '@/components/seo/JsonLd';
import { getFAQsByIds } from '@/data/faqs';
import { getAllBlogSlugs, getBlogPostBySlug, getRelatedPosts } from '@/data/blog-posts';
import { BUSINESS, SITE_URL } from '@/lib/metadata.const';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
      authors: [post.author],
      ...(post.coverImage ? { images: [post.coverImage.src] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const faqs = getFAQsByIds(post.relatedFAQIds ?? []);
  const relatedPosts = getRelatedPosts(slug);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    ...(post.coverImage ? { image: post.coverImage.src } : {}),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'LocalBusiness',
      name: BUSINESS.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.city,
        postalCode: BUSINESS.address.postcode,
        addressCountry: BUSINESS.address.country,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <main className="min-h-screen bg-linear-to-br from-sky-50 to-blue-100 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <article>
            <BlogMeta
              author={post.author}
              publishedAt={post.publishedAt}
              updatedAt={post.updatedAt}
              category={post.category}
              content={post.content}
            />

            <h1 className="mt-4 mb-8 text-3xl font-bold leading-tight text-sky-900 sm:text-4xl">
              {post.title}
            </h1>

            {post.coverImage && (
              <figure className="mb-8">
                <Image
                  src={post.coverImage.src}
                  alt={post.coverImage.alt}
                  width={800}
                  height={450}
                  className="rounded-xl"
                  priority
                />
                {post.coverImage.caption && (
                  <figcaption className="mt-2 text-center text-sm text-sky-500">
                    {post.coverImage.caption}
                  </figcaption>
                )}
              </figure>
            )}

            <BlogContent content={post.content} />
          </article>

          <BlogRelatedFAQs faqs={faqs} />
          <BlogRelated posts={relatedPosts} />

          <div className="mt-8 text-center">
            <Link href="/blog" className="font-medium text-sky-600 hover:text-sky-800">
              &larr; Back to Blog
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
