"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  Sliders,
} from "lucide-react";

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS_CHARS = /[il1Lo0O]/g;

export function PasswordGeneratorWidget() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [bulkCount, setBulkCount] = useState<number>(1);
  const [bulkList, setBulkList] = useState<string[]>([]);

  const generateSinglePassword = useCallback((): string => {
    let pool = "";
    const guaranteedChars: string[] = [];

    let upper = UPPERCASE_CHARS;
    let lower = LOWERCASE_CHARS;
    let nums = NUMBER_CHARS;
    const syms = SYMBOL_CHARS;

    if (excludeAmbiguous) {
      upper = upper.replace(AMBIGUOUS_CHARS, "");
      lower = lower.replace(AMBIGUOUS_CHARS, "");
      nums = nums.replace(AMBIGUOUS_CHARS, "");
    }

    if (useUpper) {
      pool += upper;
      guaranteedChars.push(getRandomChar(upper));
    }
    if (useLower) {
      pool += lower;
      guaranteedChars.push(getRandomChar(lower));
    }
    if (useNumbers) {
      pool += nums;
      guaranteedChars.push(getRandomChar(nums));
    }
    if (useSymbols) {
      pool += syms;
      guaranteedChars.push(getRandomChar(syms));
    }

    if (!pool) return "";

    const remainingLength = Math.max(0, length - guaranteedChars.length);
    const randomArray = new Uint32Array(remainingLength);
    crypto.getRandomValues(randomArray);

    const resultChars = [...guaranteedChars];
    for (let i = 0; i < remainingLength; i++) {
      resultChars.push(pool[randomArray[i] % pool.length]);
    }

    // Cryptographically shuffle array
    const shuffleArray = new Uint32Array(resultChars.length);
    crypto.getRandomValues(shuffleArray);
    for (let i = resultChars.length - 1; i > 0; i--) {
      const j = shuffleArray[i] % (i + 1);
      const temp = resultChars[i];
      resultChars[i] = resultChars[j];
      resultChars[j] = temp;
    }

    return resultChars.join("");
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  const generate = useCallback(() => {
    const single = generateSinglePassword();
    setPassword(single);

    if (bulkCount > 1) {
      const list: string[] = [];
      for (let i = 0; i < bulkCount; i++) {
        list.push(generateSinglePassword());
      }
      setBulkList(list);
    } else {
      setBulkList([]);
    }
  }, [generateSinglePassword, bulkCount]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = async (textToCopy: string) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Entropy & Strength Calculation
  let poolSize = 0;
  if (useUpper) poolSize += 26;
  if (useLower) poolSize += 26;
  if (useNumbers) poolSize += 10;
  if (useSymbols) poolSize += SYMBOL_CHARS.length;
  if (poolSize === 0) poolSize = 1;

  const entropyBits = Math.round(length * Math.log2(poolSize));

  let strengthLabel = "Weak";
  let strengthColor = "bg-red-500 text-red-500";
  let strengthPercent = 25;

  if (entropyBits >= 85) {
    strengthLabel = "Very Strong (Military Grade)";
    strengthColor = "bg-emerald-500 text-emerald-500";
    strengthPercent = 100;
  } else if (entropyBits >= 65) {
    strengthLabel = "Strong";
    strengthColor = "bg-teal-500 text-teal-500";
    strengthPercent = 75;
  } else if (entropyBits >= 45) {
    strengthLabel = "Moderate";
    strengthColor = "bg-amber-500 text-amber-500";
    strengthPercent = 50;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Generator Card */}
      <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-bold text-sm text-[var(--ink)]">Secure Password Generator</h3>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Web Crypto API CSPRNG
          </div>
        </div>

        {/* Display Box */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex items-center justify-between gap-3 relative">
          <div className="font-mono text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-widest break-all select-all pr-2">
            {password || "Select at least one character set"}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={generate}
              className="p-2.5 rounded-lg border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors"
              title="Generate new password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleCopy(password)}
              disabled={!password}
              className="px-4 py-2.5 bg-[var(--ink)] text-[var(--paper)] rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-30 inline-flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Strength Indicator */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--ink-muted)] font-medium">
              Strength: <strong className={strengthColor.split(" ")[1]}>{strengthLabel}</strong>
            </span>
            <span className="text-[var(--ink-muted)] font-mono">{entropyBits} bits of entropy</span>
          </div>
          <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strengthColor.split(" ")[0]}`}
              style={{ width: `${strengthPercent}%` }}
            />
          </div>
        </div>

        {/* Options Grid */}
        <div className="p-5 rounded-xl bg-[var(--paper)] border border-[var(--border)] space-y-5">
          <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> Generator Parameters
          </h4>

          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[var(--ink)]">
              <span>Password Length</span>
              <span className="font-mono text-sm px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                {length}
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>

          {/* Character Sets Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer hover:border-[var(--ink)]/40 transition-colors">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={(e) => setUseUpper(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span className="text-xs text-[var(--ink)] font-medium">Uppercase Letters (A-Z)</span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer hover:border-[var(--ink)]/40 transition-colors">
              <input
                type="checkbox"
                checked={useLower}
                onChange={(e) => setUseLower(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span className="text-xs text-[var(--ink)] font-medium">Lowercase Letters (a-z)</span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer hover:border-[var(--ink)]/40 transition-colors">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span className="text-xs text-[var(--ink)] font-medium">Digits (0-9)</span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer hover:border-[var(--ink)]/40 transition-colors">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span className="text-xs text-[var(--ink)] font-medium">Special Symbols (!@#$...)</span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer hover:border-[var(--ink)]/40 transition-colors sm:col-span-2">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span className="text-xs text-[var(--ink)] font-medium">
                Exclude Look-Alike Characters (e.g. i, l, 1, L, o, 0, O)
              </span>
            </label>
          </div>

          {/* Bulk Generation Option */}
          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--ink)]">Generate Multiple Passwords:</span>
            <div className="flex gap-1.5">
              {[1, 5, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setBulkCount(num)}
                  className={`px-3 py-1 rounded-lg border transition-colors ${
                    bulkCount === num
                      ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)] font-semibold"
                      : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {num === 1 ? "Single" : `${num} at once`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Passwords List */}
        {bulkList.length > 1 && (
          <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] border-b border-[var(--border)] pb-2">
              <span>{bulkList.length} Generated Passwords</span>
              <button
                onClick={() => handleCopy(bulkList.join("\n"))}
                className="text-xs font-semibold text-[var(--primary)] hover:underline"
              >
                Copy All to Clipboard
              </button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-xs">
              {bulkList.map((pw, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-[var(--surface)] border border-[var(--border)]"
                >
                  <span className="text-[var(--ink)]">{pw}</span>
                  <button
                    onClick={() => handleCopy(pw)}
                    className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
                    title="Copy this password"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getRandomChar(str: string): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return str[arr[0] % str.length];
}
