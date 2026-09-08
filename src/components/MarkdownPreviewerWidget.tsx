"use client";

import { useState, useMemo } from "react";
import { marked } from "marked";
import {
  Copy,
  Check,
  Download,
  Eye,
  Edit3,
  Columns,
  Sparkles,
  Trash2,
  Bold,
  Italic,
  Heading,
  List,
  Code,
  Quote,
  Table as TableIcon,
} from "lucide-react";

const SAMPLE_MARKDOWN = `# Modern Markdown Previewer

Welcome to the **fast, client-side** Markdown editor! Everything runs instantly in your browser with zero latency.

---

## Key Capabilities

- **Real-time Live Preview**: Changes sync immediately.
- **GFM Support**: GitHub flavored markdown tables, task lists, and code blocks.
- **Export Ready**: Download formatted HTML or save your markdown document.

### Code Snippet Example

\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  isVerified: boolean;
}

const user: UserProfile = {
  id: "usr_9410",
  name: "Alex Miller",
  isVerified: true,
};
\`\`\`

### Data Table

| Feature | Support | Performance |
| :--- | :--- | :--- |
| Live Sync | Yes | < 1ms |
| Client Only | Yes | 100% Secure |
| Markdown Tables | Yes | Native GFM |

> "The best tools are simple, immediate, and stay out of your way."
`;

export function MarkdownPreviewerWidget() {
  const [markdown, setMarkdown] = useState<string>(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Render HTML via marked
  const renderedHtml = useMemo(() => {
    try {
      return marked.parse(markdown, {
        gfm: true,
        breaks: true,
      }) as string;
    } catch {
      return "<p class='text-rose-500'>Error parsing markdown.</p>";
    }
  }, [markdown]);

  // Stats
  const stats = useMemo(() => {
    const chars = markdown.length;
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const lines = markdown.split("\n").length;
    return { chars, words, lines };
  }, [markdown]);

  const insertSnippet = (prefix: string, suffix: string = "", defaultText: string = "text") => {
    const textarea = document.getElementById("md-editor-textarea") as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const updated = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleCopyMd = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(renderedHtml);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--card)] border border-[var(--border)] p-3 rounded-xl">
        {/* Quick Format Shortcuts */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => insertSnippet("**", "**", "bold text")}
            title="Bold"
            className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet("*", "*", "italic text")}
            title="Italic"
            className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet("### ", "", "Heading 3")}
            title="Heading"
            className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <Heading className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet("- ", "", "List item")}
            title="Bullet List"
            className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet("> ", "", "Quote")}
            title="Blockquote"
            className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet("```javascript\n", "\n```", "console.log('code');")}
            title="Code Block"
            className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              insertSnippet(
                "\n| Column 1 | Column 2 |\n| :--- | :--- |\n| Data 1 | Data 2 |\n",
                "",
                ""
              )
            }
            title="Table"
            className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[var(--background)] p-1 rounded-lg border border-[var(--border)]">
          <button
            onClick={() => setViewMode("edit")}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded ${
              viewMode === "edit"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editor</span>
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded ${
              viewMode === "split"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded ${
              viewMode === "preview"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyHtml}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--border)] transition-colors text-[var(--foreground)]"
            title="Copy compiled HTML code"
          >
            {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>HTML</span>
          </button>
          <button
            onClick={handleCopyMd}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--border)] transition-colors text-[var(--foreground)]"
            title="Copy raw Markdown"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Markdown</span>
          </button>
          <button
            onClick={() => downloadFile(renderedHtml, "document.html", "text/html")}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
            title="Download compiled HTML file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export HTML</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Panels */}
      <div
        className={`grid gap-4 ${
          viewMode === "split"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {/* Editor Panel */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className="flex flex-col bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--background)]/60 border-b border-[var(--border)] text-xs font-bold text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>MARKDOWN SOURCE</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMarkdown(SAMPLE_MARKDOWN)}
                  className="hover:text-[var(--foreground)] flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Reset Sample
                </button>
                <button
                  onClick={() => setMarkdown("")}
                  className="hover:text-rose-500 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
            </div>

            <textarea
              id="md-editor-textarea"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type your markdown here..."
              className="w-full h-[550px] p-4 bg-[var(--card)] text-[var(--foreground)] font-mono text-xs leading-relaxed focus:outline-none resize-none"
              spellCheck="false"
            />

            <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--background)]/40 text-[11px] font-mono text-[var(--muted)]">
              <div>
                {stats.words} words &bull; {stats.chars} characters
              </div>
              <div>{stats.lines} lines</div>
            </div>
          </div>
        )}

        {/* Live Preview Panel */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className="flex flex-col bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--background)]/60 border-b border-[var(--border)] text-xs font-bold text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                <span>LIVE PREVIEW</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                HTML Render
              </span>
            </div>

            <div
              className="w-full h-[550px] p-6 overflow-y-auto prose dark:prose-invert max-w-none text-sm leading-relaxed text-[var(--foreground)]
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-[var(--border)]
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-[var(--border)]
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
                [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-[var(--muted)]
                [&_pre]:bg-[var(--background)] [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:my-4 [&_pre]:font-mono [&_pre]:text-xs
                [&_code]:font-mono [&_code]:text-xs [&_code]:bg-[var(--background)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-[var(--border)]
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs
                [&_th]:border [&_th]:border-[var(--border)] [&_th]:p-2 [&_th]:bg-[var(--background)] [&_th]:font-bold [&_th]:text-left
                [&_td]:border [&_td]:border-[var(--border)] [&_td]:p-2
                [&_hr]:my-6 [&_hr]:border-[var(--border)]
                [&_a]:text-[var(--accent)] [&_a]:underline
              "
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />

            <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--background)]/40 text-[11px] font-mono text-[var(--muted)]">
              <div>Preview Mode Active</div>
              <div className="text-emerald-500 font-medium">Synchronized</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
