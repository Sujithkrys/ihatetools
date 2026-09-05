import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-overlay/5 bg-background mt-auto">
      <div className="max-w-content mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <span className="text-xl font-semibold text-textPrimary">ihatetools</span>
            <p className="mt-4 text-textSecondary text-sm max-w-xs">
              Minimal, fast, client-side tools for developers and creators. No tracking, no watermarks.
            </p>
          </div>
          <div>
            <h3 className="text-textPrimary font-medium mb-4">Tools</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tools/pdf" className="text-textSecondary hover:text-accent text-sm transition-colors">
                  PDF Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/image" className="text-textSecondary hover:text-accent text-sm transition-colors">
                  Image Tools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-textPrimary font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-textSecondary hover:text-accent text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-textSecondary hover:text-accent text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-overlay/5 flex flex-col md:flex-row items-center justify-between">
          <p className="text-textMuted text-sm">
            © {new Date().getFullYear()} ihatetools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
