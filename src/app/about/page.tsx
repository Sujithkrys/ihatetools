import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | ihatetools",
  description: "Learn about ihatetools and our mission to provide free, private, client-side utilities.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-8 font-display">
          About ihatetools
        </h1>
        
        <div className="space-y-6 text-textSecondary leading-relaxed">
          <p>
            Welcome to ihatetools! We are building a growing collection of free, no-nonsense utilities designed for developers, creators, and everyday users who just want to get things done without the hassle.
          </p>
          
          <p>
            Our core philosophy is simple: tools should be fast, they should be free, and they should respect your privacy. That&apos;s why every single tool currently available on our site—from PDF manipulation to image compression—is designed to run <strong>entirely in your web browser</strong>.
          </p>

          <p>
            When you upload a file to merge a PDF or convert an image, that file never leaves your device. We do not upload, store, or analyze your personal documents on our servers, ensuring your data remains completely private.
          </p>

          <p>
            We&apos;re just getting started. We currently offer essential PDF and Image utilities, and we plan to expand into many more categories soon. No sign-ups, no hidden paywalls, and no watermarks—just the tools you need, exactly when you need them.
          </p>
        </div>
      </section>
    </div>
  );
}
