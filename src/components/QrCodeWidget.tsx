"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import QRCode from "qrcode";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function QrCodeWidget() {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [size, setSize] = useState<number>(500); // default 500px

  useEffect(() => {
    const generateQR = async () => {
      if (!text.trim()) {
        setQrDataUrl("");
        return;
      }
      try {
        const url = await QRCode.toDataURL(text, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error("Failed to generate QR code", err);
      }
    };

    const timer = setTimeout(() => {
      generateQR();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [text, size]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolWidgetShell>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <label className="block">
            <span className="block text-sm font-medium text-textPrimary mb-2">Text or URL</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com"
              rows={4}
              className="block w-full px-3 py-2 border border-overlay/10 rounded-md leading-5 bg-surface text-textPrimary placeholder-textMuted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-all resize-none"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-textPrimary mb-2">Size (pixels)</span>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-overlay/10 rounded-md leading-5 bg-surface text-textPrimary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-all"
            >
              <option value={250}>Small (250x250)</option>
              <option value={500}>Medium (500x500)</option>
              <option value={1000}>Large (1000x1000)</option>
              <option value={2000}>Ultra (2000x2000)</option>
            </select>
          </label>
        </div>

        <div className="bg-surface rounded-lg border border-overlay/5 p-8 flex flex-col items-center justify-center min-h-[300px]">
          {qrDataUrl ? (
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-2 rounded-md shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={qrDataUrl} 
                  alt="QR Code"
                  className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
                />
              </div>
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            </div>
          ) : (
            <div className="text-center text-textSecondary">
              <QrCodeIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Type something to generate<br/>a QR code.</p>
            </div>
          )}
        </div>
      </div>
    </ToolWidgetShell>
  );
}

function QrCodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  );
}
