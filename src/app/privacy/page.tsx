import { Metadata } from "next";
import { Frame } from "@/components/Frame";

export const metadata: Metadata = {
  title: "Privacy Policy | ihatetools",
  description: "Privacy policy for ihatetools.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">
      <section className="text-center max-w-2xl mx-auto mb-[60px]">
        <h1 className="disp disp-lg text-[clamp(36px,5vw,52px)] text-ink mb-[12px]">Privacy Policy</h1>
      </section>

      <Frame label="Privacy" labelColor="green">
        <div className="max-w-3xl mx-auto space-y-8 text-grey leading-relaxed">
          <div>
            <h2 className="disp text-xl text-ink mb-3">1. Client-Side Processing</h2>
            <p>
              Your privacy and data security are our top priorities. For all the tools currently available on ihatetools, your files are processed entirely within your web browser (client-side). Your files and documents are <strong className="text-ink font-medium">never uploaded to, transmitted to, or stored on any of our servers</strong>. 
            </p>
          </div>

          <div>
            <h2 className="disp text-xl text-ink mb-3">2. Personal Data & Accounts</h2>
            <p>
              ihatetools does not require account creation to use any of our services. We do not collect, store, or sell any personal identifying information (such as names, email addresses, or phone numbers) through the usage of our core tools.
            </p>
          </div>

          <div>
            <h2 className="disp text-xl text-ink mb-3">3. Analytics and Third-Party Services</h2>
            <p>
              While your files remain strictly on your device, our website may use third-party services (such as Google Analytics or advertising networks like Google AdSense) to help us understand how our site is used and to support the continuous development of free tools. 
            </p>
            <p className="mt-2">
              These third-party services may use cookies, web beacons, or similar technologies to collect non-personal usage data (such as your IP address, browser type, and pages visited). If and when such services are active, their collection and use of data are governed by their respective privacy policies. We will update this policy accordingly as new services are integrated.
            </p>
          </div>

          <div>
            <h2 className="disp text-xl text-ink mb-3">4. Changes to This Policy</h2>
            <p>
              We reserve the right to update this Privacy Policy as we add new tools or integrate new services. We encourage you to review this page periodically for any changes.
            </p>
          </div>

          <div className="pt-8 border-t-[1.5px] border-ink/20 text-sm text-grey/80">
            <p>
              <em>This policy is provided as a general disclosure and may not cover every legal requirement in your jurisdiction. Last updated: September 2026.</em>
            </p>
          </div>
        </div>
      </Frame>
    </div>
  );
}
