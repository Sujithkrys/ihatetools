import Link from "next/link";
import { Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 dark:border-white/10 py-12 bg-paper dark:bg-black text-grey dark:text-gray-400 mt-auto">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex gap-16 flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <span className="flex items-center gap-2 text-ink dark:text-white font-semibold text-[15px] mb-4">
              <Layers size={18} />
              ihatetools
            </span>
            <p className="text-[13px] text-grey dark:text-gray-500 max-w-[34ch] leading-[1.6]">
              Fast, private, client-side tools. No tracking, no watermarks, no sign-up.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-grey/80 dark:text-gray-600 mb-4">Tools</h4>
            <Link href="/tools/pdf" className="block text-[13px] text-grey dark:text-gray-500 no-underline mb-2.5 hover:text-ink dark:hover:text-white transition-colors">PDF Tools</Link>
            <Link href="/tools/audio" className="block text-[13px] text-grey dark:text-gray-500 no-underline mb-2.5 hover:text-ink dark:hover:text-white transition-colors">Audio Tools</Link>
            <Link href="/tools/image" className="block text-[13px] text-grey dark:text-gray-500 no-underline mb-2.5 hover:text-ink dark:hover:text-white transition-colors">Image Tools</Link>
            <Link href="/tools/utility" className="block text-[13px] text-grey dark:text-gray-500 no-underline mb-2.5 hover:text-ink dark:hover:text-white transition-colors">Utility Tools</Link>
            <Link href="/tools/text" className="block text-[13px] text-grey dark:text-gray-500 no-underline mb-2.5 hover:text-ink dark:hover:text-white transition-colors">Text Tools</Link>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-grey/80 dark:text-gray-600 mb-4">Legal</h4>
            <Link href="/privacy" className="block text-[13px] text-grey dark:text-gray-500 no-underline mb-2.5 hover:text-ink dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="block text-[13px] text-grey dark:text-gray-500 no-underline mb-2.5 hover:text-ink dark:hover:text-white transition-colors">Terms</Link>
            <Link href="/about" className="block text-[13px] text-grey dark:text-gray-500 no-underline mb-2.5 hover:text-ink dark:hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
