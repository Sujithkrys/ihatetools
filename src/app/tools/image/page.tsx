import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-3xl font-bold text-textPrimary mb-4">Coming Soon</h1>
      <p className="text-textSecondary mb-8 max-w-md">
        We are working hard to bring you more free, client-side tools. Check back later!
      </p>
      <Link 
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-surface border border-white/10 rounded-button hover:bg-surfaceHover transition-colors text-textPrimary"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
