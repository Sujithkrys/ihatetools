import { Metadata } from "next";
import { TOOLS } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "ihatetools - Free Online Tools",
  description: "Free, fast, client-side tools for developers and creators. No watermark, no sign-up required.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ihatetools - Free Online Tools",
    description: "Free, fast, client-side tools for developers and creators. No watermark, no sign-up required.",
    url: "/",
  },
};

export default function RootToolsPage() {
  const categories = [
    { title: "Page Management", filters: ["PDF Tools"] },
    { title: "Image Editing", filters: ["Image Tools"] },
    { title: "Edit & Annotate", filters: ["Text Tools"] },
    { title: "Audio & Utility", filters: ["Audio Tools", "Utility Tools"] }
  ];

  return (
    <div className="min-h-screen bg-bg dark:bg-black text-ink dark:text-white p-8 pb-16">
      <div className="space-y-12 max-w-[1400px]">
        {categories.map(cat => {
          const catTools = TOOLS.filter(t => 
            cat.filters.includes(t.category)
          );
          if (catTools.length === 0) return null;
          return (
            <section key={cat.title}>
              <h2 className="text-[13px] font-medium text-grey dark:text-gray-500 mb-4 border-b border-ink/[0.06] dark:border-white/[0.06] pb-3 px-2 uppercase tracking-widest">{cat.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-1">
                {catTools.map(tool => (
                  <ToolCard key={tool.id} {...tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
