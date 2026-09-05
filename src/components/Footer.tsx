import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-[1.5px] border-ink py-[40px] bg-paper">
      <div className="max-w-content mx-auto px-4 md:px-[34px]">
        <div className="flex gap-[52px] flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <span className="logo font-sans font-semibold text-[18px] tracking-[-0.035em] text-ink">ihatetools</span>
            <p className="text-[13.5px] text-grey max-w-[34ch] leading-[1.6] mt-[9px] tracking-[-0.01em]">
              Fast, private, client-side tools. No tracking, no watermarks, no sign-up.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.07em] mb-[10px] text-ink">Tools</h4>
            <Link href="/tools/pdf" className="block text-[13.5px] text-grey no-underline mb-[6px] tracking-[-0.01em] hover:text-ink transition-colors">PDF Tools</Link>
            <Link href="/tools/image" className="block text-[13.5px] text-grey no-underline mb-[6px] tracking-[-0.01em] hover:text-ink transition-colors">Image Tools</Link>
            <Link href="/tools/text" className="block text-[13.5px] text-grey no-underline mb-[6px] tracking-[-0.01em] hover:text-ink transition-colors">Text Tools</Link>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.07em] mb-[10px] text-ink">Legal</h4>
            <Link href="/privacy" className="block text-[13.5px] text-grey no-underline mb-[6px] tracking-[-0.01em] hover:text-ink transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="block text-[13.5px] text-grey no-underline mb-[6px] tracking-[-0.01em] hover:text-ink transition-colors">Terms</Link>
            <Link href="/about" className="block text-[13.5px] text-grey no-underline mb-[6px] tracking-[-0.01em] hover:text-ink transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
