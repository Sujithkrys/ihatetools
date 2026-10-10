"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="disp text-2xl text-ink mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-paper border border-ink/8 dark:border-white/10 rounded-[10px] overflow-hidden transition-shadow duration-150"
              style={isOpen ? { boxShadow: "0 1px 2px rgba(17,18,18,0.04), 0 6px 16px rgba(17,18,18,0.06)" } : undefined}
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="font-medium text-ink pr-8">
                  {item.question}
                </span>
                <ChevronDown
                  className={clsx(
                    "w-5 h-5 text-grey transition-transform duration-200 flex-shrink-0",
                    isOpen && "rotate-180 text-ink"
                  )}
                />
              </button>
              <div
                className={clsx(
                  "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-grey text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
