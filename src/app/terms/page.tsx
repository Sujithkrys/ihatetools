import { Metadata } from "next";
import { Frame } from "@/components/Frame";

export const metadata: Metadata = {
  title: "Terms of Service | ihatetools",
  description: "Terms of Service for using ihatetools.",
};

export default function TermsPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">
      <section className="text-center max-w-2xl mx-auto mb-[60px]">
        <h1 className="disp disp-lg text-[clamp(36px,5vw,52px)] text-ink mb-[12px]">Terms of Service</h1>
      </section>

      <Frame label="Terms" labelColor="yellow">
        <div className="max-w-3xl mx-auto space-y-8 text-grey leading-relaxed">
          <div>
            <h2 className="disp text-xl text-ink mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ihatetools, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div>
            <h2 className="disp text-xl text-ink mb-3">2. &quot;As Is&quot; Service</h2>
            <p>
              All tools and services provided on this website are provided strictly on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We make no warranties, expressed or implied, regarding the reliability, accuracy, or suitability of these tools for any particular purpose.
            </p>
          </div>

          <div>
            <h2 className="disp text-xl text-ink mb-3">3. User Responsibilities</h2>
            <p>
              You are solely responsible for the files and content you process using ihatetools. You represent and warrant that you have all necessary rights, licenses, and permissions to process the files you submit. 
            </p>
          </div>

          <div>
            <h2 className="disp text-xl text-ink mb-3">4. Prohibited Uses</h2>
            <p>
              You agree not to use ihatetools for any unlawful purpose or in any way that could damage, disable, overburden, or impair the site. Attempting to reverse engineer, scrape, or maliciously overload our infrastructure is strictly prohibited.
            </p>
          </div>

          <div>
            <h2 className="disp text-xl text-ink mb-3">5. Limitation of Liability</h2>
            <p>
              In no event shall ihatetools or its creators be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with the use of our services or the inability to use our services, including but not limited to loss of data or corruption of files.
            </p>
          </div>

          <div>
            <h2 className="disp text-xl text-ink mb-3">6. Modifications</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any tool or service at any time without prior notice. We also reserve the right to update these terms at our discretion.
            </p>
          </div>

          <div className="pt-8 border-t-[1.5px] border-ink/20 text-sm text-grey/80">
            <p>
              <em>Last updated: September 2026.</em>
            </p>
          </div>
        </div>
      </Frame>
    </div>
  );
}
