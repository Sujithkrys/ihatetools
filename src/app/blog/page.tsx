import { Metadata } from 'next';
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - ihatetools',
  description: 'Learn about our free, fast, client-side tools and how they can improve your workflow. Guides, tutorials, and deep dives into PDF, image, and developer tools.',
};

export default function BlogIndex() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">
      <h1 className="disp disp-lg text-[clamp(28px,4vw,42px)] text-ink mb-8 leading-[1.15]">
        Blog &amp; <span className="bg-yellow text-[#111212] px-[0.09em]">Guides</span>
      </h1>
      
      {posts.length > 0 ? (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="block border border-ink/8 dark:border-white/10 rounded-[14px] p-[26px_28px] relative bg-paper shadow-soft dark:shadow-soft-dark hover:-translate-y-[2px] hover:shadow-soft-hover transition-all cursor-pointer no-underline group"
            >
              <h2 className="disp text-[23px] mb-2 text-ink group-hover:text-pink transition-colors">
                {post.title}
              </h2>
              <div className="text-sm text-grey mb-4 font-mono">
                {post.date}
              </div>
              <p className="text-[14.5px] leading-[1.55] text-ink/80">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-grey text-lg">No posts yet. Check back soon!</p>
      )}
    </div>
  );
}
