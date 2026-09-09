import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { TimestampConverterWidget } from "@/components/TimestampConverterWidget";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter - Epoch to Human Date Time | ihatetools",
  description: "Convert Unix epoch timestamps to ISO, UTC, and local human dates with relative time calculations. Convert calendar dates to Unix seconds and milliseconds. 100% client-side.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Inspect Live Clock",
    description: "View the real-time ticking Unix epoch timestamp in seconds with one-click copy.",
  },
  {
    title: "Timestamp to Date",
    description: "Enter any Unix timestamp (seconds or milliseconds) to view ISO 8601, RFC 2822 UTC, and local timezone formats.",
  },
  {
    title: "Date to Timestamp",
    description: "Pick any date and time to calculate the exact epoch seconds and milliseconds for local or UTC timezones.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is a Unix timestamp (Epoch time)?",
    answer: "A Unix timestamp represents the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC (the Unix Epoch), not counting leap seconds.",
  },
  {
    question: "How can I tell if a timestamp is in seconds or milliseconds?",
    answer: "Standard 10-digit timestamps (e.g. 1725792000) represent seconds, while 13-digit timestamps (e.g. 1725792000000) represent milliseconds. This tool supports both with automatic or manual unit selection.",
  },
  {
    question: "What is the Year 2038 problem (Y2038)?",
    answer: "On January 19, 2038, 32-bit signed integers will overflow the maximum 32-bit Unix timestamp. Modern 64-bit systems and JavaScript numbers (64-bit float IEEE 754) can safely handle timestamps for hundreds of thousands of years into the future.",
  },
];

const RELATED_TOOLS = [
  { name: "UUID Generator", href: "/tools/uuid-generator" },
  { name: "Hash Generator", href: "/tools/hash-generator" },
  { name: "URL Encoder / Decoder", href: "/tools/url-encoder-decoder" },
];

export default function TimestampConverterPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Timestamp Converter
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
          Convert Unix epoch timestamps to human-readable dates and parse calendar dates into seconds or milliseconds.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / developer / timestamp-converter">
        <TimestampConverterWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
