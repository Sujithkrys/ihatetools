import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostData, getSortedPostsData } from '@/lib/blog';
import { marked } from 'marked';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostData(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | ihatetools`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPostData(params.slug);

  if (!post) {
    notFound();
  }

  // Parse markdown content
  const htmlContent = await marked.parse(post.content);

  return (
    <article className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[80px]">
      <Link 
        href="/blog" 
        className="inline-flex items-center gap-2 text-sm font-medium text-grey hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      <header className="mb-12 border-b border-ink/10 pb-8">
        <h1 className="disp text-[32px] text-ink mb-3 leading-[1.2]">
          {post.title}
        </h1>
        <div className="text-grey font-mono flex items-center gap-4">
          <time dateTime={post.date}>{post.date}</time>
          <span>•</span>
          <span>ihatetools Editorial</span>
        </div>
      </header>

      <div 
        className="prose dark:prose-invert prose-headings:font-sans prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-a:text-pink hover:prose-a:text-ink transition-colors prose-pre:bg-paper prose-pre:border-[1.5px] prose-pre:border-ink max-w-none text-ink/90 prose-p:leading-[1.6] prose-li:leading-[1.6]"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
}
