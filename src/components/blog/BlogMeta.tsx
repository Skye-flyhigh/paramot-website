import { Calendar, Clock, Tag, User } from 'lucide-react';

import {
  type BlogCategory,
  BLOG_CATEGORIES,
  calculateReadingTime,
} from '@/data/blog-posts';

interface BlogMetaProps {
  author: string;
  publishedAt: string;
  updatedAt?: string;
  category: BlogCategory;
  content: string;
}

export default function BlogMeta({
  author,
  publishedAt,
  updatedAt,
  category,
  content,
}: BlogMetaProps) {
  const readingTime = calculateReadingTime(content);
  const categoryInfo = BLOG_CATEGORIES[category];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sky-600">
      <span className="flex items-center gap-1.5">
        <User className="h-4 w-4" />
        {author}
      </span>
      <span className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4" />
        <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        {updatedAt && (
          <span className="text-sky-400">
            (updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>)
          </span>
        )}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        {readingTime} min read
      </span>
      <span className="pm-badge">
        <Tag className="h-3 w-3" />
        {categoryInfo.name}
      </span>
    </div>
  );
}
