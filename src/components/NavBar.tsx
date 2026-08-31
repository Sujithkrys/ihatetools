import Link from "next/link";
import { Search } from "lucide-react";

export function NavBar() {
  return (
    <header className="border-b border-white/5 bg-background sticky top-0 z-50">
      <div className="max-w-content mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold text-textPrimary">
          ihatetools
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-textMuted" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md leading-5 bg-surface text-textPrimary placeholder-textMuted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm"
            placeholder="Search tools..."
          />
        </div>

        {/* Links */}
        <nav className="flex space-x-6">
          <Link href="/" className="text-textSecondary hover:text-textPrimary transition-colors text-sm">
            Home
          </Link>
          <Link href="/tools" className="text-textSecondary hover:text-textPrimary transition-colors text-sm">
            All Tools
          </Link>
          <Link href="/about" className="text-textSecondary hover:text-textPrimary transition-colors text-sm">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
