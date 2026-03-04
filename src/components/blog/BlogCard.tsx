import { Calendar, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import ScrollReveal from '@/components/ui/ScrollReveal';
import { BLOG_CATEGORIES, calculateReadingTime, type BlogPost } from '@/data/blog-posts';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const readingTime = calculateReadingTime(post.content);
  const categoryInfo = BLOG_CATEGORIES[post.category];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <ScrollReveal delay={index * 0.1}>
      <Link href={`/blog/${post.slug}`} className="group block p-6 pm-card-interactive">
        {post.coverImage && (
          <Image
            src={post.coverImage.src}
            alt={post.coverImage.alt}
            width={600}
            height={340}
            className="mb-4 aspect-video rounded-lg object-cover"
          />
        )}

        <span className="mb-3 pm-badge">
          <Tag className="h-3 w-3" />
          {categoryInfo.name}
        </span>

        <h2 className="mb-2 text-lg font-bold text-sky-900 group-hover:text-sky-700">
          {post.title}
        </h2>

        <p className="mb-4 text-sm leading-relaxed text-sky-700">{post.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-sky-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} min
            </span>
          </div>
          <span className="pm-link">Read more &rarr;</span>
        </div>
      </Link>
    </ScrollReveal>
  );
}
