import { Metadata } from "next";
import { Frame } from "@/components/Frame";

export const metadata: Metadata = {
  title: "About | ihatetools",
  description: "Learn about ihatetools and our mission to provide free, private, client-side utilities.",
};

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">
      <section className="text-center max-w-2xl mx-auto mb-[60px]">
        <h1 className="disp disp-lg text-[clamp(36px,5vw,52px)] text-ink mb-[12px]">About ihatetools</h1>
      </section>

      <Frame label="About" labelColor="cyan">
        <div className="max-w-3xl mx-auto space-y-8 text-[16px] text-grey leading-[1.7] tracking-[-0.005em]">
          <p>
            Welcome to ihatetools! We are building a growing collection of free, no-nonsense utilities designed for developers, creators, and everyday users who just want to get things done without the hassle.
          </p>
          
          <p>
            Our core philosophy is simple: tools should be fast, they should be free, and they should respect your privacy. That&apos;s why every single tool currently available on our site—from PDF manipulation to image compression—is designed to run <strong className="text-ink font-medium">entirely in your web browser</strong>.
          </p>

          <p>
            When you upload a file to merge a PDF or convert an image, that file never leaves your device. We do not upload, store, or analyze your personal documents on our servers, ensuring your data remains completely private.
          </p>

          <p>
            We&apos;re just getting started. We currently offer essential PDF and Image utilities, and we plan to expand into many more categories soon. No sign-ups, no hidden paywalls, and no watermarks—just the tools you need, exactly when you need them.
          </p>
        </div>
      </Frame>
    </div>
  );
}
