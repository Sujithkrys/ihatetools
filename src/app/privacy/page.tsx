import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ihatetools",
  description: "Privacy policy for ihatetools.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="w-full max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-8 font-display">
          Privacy Policy
        </h1>
        
        <div className="space-y-8 text-textSecondary leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-textPrimary mb-3">1. Client-Side Processing</h2>
            <p>
              Your privacy and data security are our top priorities. For all the tools currently available on ihatetools, your files are processed entirely within your web browser (client-side). Your files and documents are <strong>never uploaded to, transmitted to, or stored on any of our servers</strong>. 
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-textPrimary mb-3">2. Personal Data & Accounts</h2>
            <p>
              ihatetools does not require account creation to use any of our services. We do not collect, store, or sell any personal identifying information (such as names, email addresses, or phone numbers) through the usage of our core tools.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-textPrimary mb-3">3. Analytics and Third-Party Services</h2>
            <p>
              While your files remain strictly on your device, our website may use third-party services (such as Google Analytics or advertising networks like Google AdSense) to help us understand how our site is used and to support the continuous development of free tools. 
            </p>
            <p className="mt-2">
              These third-party services may use cookies, web beacons, or similar technologies to collect non-personal usage data (such as your IP address, browser type, and pages visited). If and when such services are active, their collection and use of data are governed by their respective privacy policies. We will update this policy accordingly as new services are integrated.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-textPrimary mb-3">4. Changes to This Policy</h2>
            <p>
              We reserve the right to update this Privacy Policy as we add new tools or integrate new services. We encourage you to review this page periodically for any changes.
            </p>
          </div>

          <div className="pt-8 border-t border-overlay/10 text-sm text-textMuted">
            <p>
              <em>This policy is provided as a general disclosure and may not cover every legal requirement in your jurisdiction. Last updated: September 2026.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
