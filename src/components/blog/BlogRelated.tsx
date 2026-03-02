import ScrollReveal from '@/components/ui/ScrollReveal';
import type { BlogPost } from '@/data/blog-posts';

import BlogCard from './BlogCard';

interface BlogRelatedProps {
  posts: BlogPost[];
}

export default function BlogRelated({ posts }: BlogRelatedProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12">
      <ScrollReveal>
        <h2 className="mb-6 text-2xl font-bold text-sky-900">Related posts</h2>
      </ScrollReveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <BlogCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}
