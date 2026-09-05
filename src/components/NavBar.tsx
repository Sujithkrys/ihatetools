import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";

export function NavBar() {
  return (
    <header className="border-b border-overlay/5 bg-background sticky top-0 z-50">
      <div className="max-w-content mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold text-textPrimary">
          ihatetools
        </Link>

        {/* Search */}
        <SearchBar />

        {/* Links */}
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-textSecondary hover:text-textPrimary transition-colors text-sm">
            Home
          </Link>
          <Link href="/tools" className="text-textSecondary hover:text-textPrimary transition-colors text-sm">
            All Tools
          </Link>
          <Link href="/tools/text" className="text-textSecondary hover:text-textPrimary transition-colors text-sm">
            Text Tools
          </Link>
          <Link href="/about" className="text-textSecondary hover:text-textPrimary transition-colors text-sm">
            About
          </Link>
          <div className="w-px h-4 bg-overlay/10" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
