'use client';

import Link from 'next/link';
import Markdown from 'react-markdown';

interface BlogContentProps {
  content: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <div>
      <Markdown
        components={{
          h2: ({ children }) => {
            const id = slugify(String(children));

            return (
              <h2 id={id} className="mb-4 mt-10 text-2xl font-bold text-sky-900">
                <a href={`#${id}`} className="no-underline hover:underline">
                  {children}
                </a>
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = slugify(String(children));

            return (
              <h3 id={id} className="mb-3 mt-8 text-xl font-semibold text-sky-900">
                <a href={`#${id}`} className="no-underline hover:underline">
                  {children}
                </a>
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-sky-700">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1 pl-6 text-sky-700">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1 pl-6 text-sky-700">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-sky-300 bg-sky-50 py-2 pl-4 italic text-sky-700">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-sky-900">{children}</strong>
          ),
          a: ({ href, children }) => {
            if (href?.startsWith('/')) {
              return (
                <Link
                  href={href}
                  className="font-medium text-sky-600 underline decoration-sky-300 underline-offset-2 hover:text-sky-800"
                >
                  {children}
                </Link>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sky-600 underline decoration-sky-300 underline-offset-2 hover:text-sky-800"
              >
                {children}
              </a>
            );
          },
          code: ({ children }) => (
            <code className="rounded bg-sky-50 px-1.5 py-0.5 text-sm text-sky-800">
              {children}
            </code>
          ),
          hr: () => <hr className="my-8 border-sky-200" />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
