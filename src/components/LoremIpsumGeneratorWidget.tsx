"use client";

import { useState, useEffect } from "react";
import { AlignLeft, Copy, CheckCircle } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", 
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", 
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", 
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", 
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", 
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export function LoremIpsumGeneratorWidget() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "words">("paragraphs");
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLorem = (amount: number, unit: "paragraphs" | "words") => {
    let result = "";

    const generateSentence = (wordCount: number) => {
      let sentence = "";
      for (let i = 0; i < wordCount; i++) {
        const randomWord = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
        if (i === 0) {
          sentence += randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
        } else {
          sentence += " " + randomWord;
        }
      }
      return sentence + ".";
    };

    if (unit === "words") {
      // Just generate one long sentence/paragraph of exact words
      const words = [];
      for (let i = 0; i < amount; i++) {
        if (i === 0) {
          words.push("Lorem");
        } else if (i === 1) {
          words.push("ipsum");
        } else {
          words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        }
      }
      result = words.join(" ") + ".";
    } else {
      // Generate paragraphs
      for (let p = 0; p < amount; p++) {
        let paragraph = "";
        // 4 to 8 sentences per paragraph
        const sentences = Math.floor(Math.random() * 5) + 4;
        
        if (p === 0) {
          paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
          for (let s = 1; s < sentences; s++) {
            // 8 to 15 words per sentence
            paragraph += generateSentence(Math.floor(Math.random() * 8) + 8) + " ";
          }
        } else {
          for (let s = 0; s < sentences; s++) {
            paragraph += generateSentence(Math.floor(Math.random() * 8) + 8) + " ";
          }
        }
        
        result += paragraph.trim();
        if (p < amount - 1) result += "\n\n";
      }
    }

    setGeneratedText(result);
  };

  useEffect(() => {
    generateLorem(count, type);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = () => {
    generateLorem(count, type);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <ToolWidgetShell>
      <div className="bg-paper rounded-lg border border-ink/10 overflow-hidden flex flex-col">
        {/* Top toolbar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center px-4 py-4 border-b border-ink/10 bg-white/[0.02] gap-4">
          <div className="flex items-center gap-2 text-grey font-medium">
            <AlignLeft className="w-4 h-4 text-yellow" />
            <span className="text-sm">Lorem Ipsum</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={type === "words" ? 5000 : 100}
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 bg-bg border border-ink/15 rounded px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-sel"
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "paragraphs" | "words")}
                className="bg-bg border border-ink/15 rounded px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-sel"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="words">Words</option>
              </select>
            </div>
            
            <button
              onClick={handleGenerate}
              className="px-4 py-1.5 bg-yellow hover:bg-yellow/90 text-background rounded font-medium text-sm transition-colors"
            >
              Generate
            </button>
            
            <div className="w-px h-6 bg-overlay/10 hidden sm:block"></div>
            
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 rounded text-xs font-medium text-ink transition-colors"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Text
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          readOnly
          value={generatedText}
          className="w-full min-h-[400px] p-6 bg-transparent text-ink focus:outline-none resize-y text-base leading-relaxed whitespace-pre-wrap"
        />
      </div>
    </ToolWidgetShell>
  );
}
