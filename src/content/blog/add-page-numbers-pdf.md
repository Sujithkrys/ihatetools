---
title: "How to Add Page Numbers to a PDF in Your Browser"
date: "2026-09-09"
description: "Add clean, customizable page numbers to any PDF instantly in your browser, with no uploads, no sign-up, and no watermark on the output."
---

Printing out a 60-page report without page numbers is one of those small mistakes that makes the whole document look unfinished. Whether you're preparing a thesis, a legal brief, or a client proposal, reviewers expect to be able to say "see page 14" and have that mean something. If your PDF didn't come with page numbers baked in, you need a fast way to add them, without mangling the layout or shrinking your margins.

## Why This Should Never Require an Upload

Adding page numbers means stamping a small piece of text onto every page of your document, something your browser can do in a fraction of a second using the same PDF rendering libraries that power desktop software. There's no reason a document like a dissertation draft or a client contract needs to travel to a remote server just to get "Page 1 of 60" stamped onto it.

Processing this locally also sidesteps a problem a lot of free online tools have: they add their own watermark or logo to your footer alongside the numbers, because that's how they fund the "free" service. A client-side tool has no server costs to recoup, so there's no incentive to brand your document.

## How to Add Page Numbers with ihatetools

1. Open the [Add Page Numbers tool](/tools/add-page-numbers).
2. Upload your PDF. It loads directly into your browser's memory, nothing is sent anywhere.
3. Choose your numbering style: position (bottom-center, bottom-right, top-right, etc.), starting number, and format (plain numbers, "Page X of Y", or Roman numerals if offered).
4. Preview the result on a sample page before committing.
5. Export and download. The numbered PDF is ready instantly, with no watermark.

## Tips for Professional-Looking Page Numbers

- **Match the numbering style to the document type.** Legal documents and academic papers often expect "Page X of Y" in the footer, while reports and presentations usually look cleaner with just a number, bottom-center or bottom-right.
- **Skip the cover page.** If your document opens with a title page, many tools let you start numbering from page 2 while keeping the visual page count accurate. Check this setting before exporting so your cover doesn't get a stray "1" stamped on it.
- **Watch for pages that already have numbers typed into the content.** If the PDF was exported from Word or Google Docs with numbers already in the footer, adding a second set will double up. Delete the old numbers at the source first if possible, or crop them out.
- **Combine with page cleanup first.** If you're also removing a few stray pages, do that with the [Delete PDF Pages tool](/tools/delete-pdf-pages) before adding numbers, so your numbering reflects the final page order rather than the original one.

## Common Mistakes to Avoid

- **Numbering before finalizing page order.** If you add page numbers and then realize you need to delete or reorder a few pages, the numbers you already stamped stay attached to the old page order, not the new one. Always finalize structure first with [Organize PDF](/tools/organize-pdf) or [Delete PDF Pages](/tools/delete-pdf-pages), then number last.
- **Choosing a font size that's too small to read when printed.** A number that looks fine zoomed in on a laptop screen can shrink to near-illegible when the page is printed at actual size. If the document is headed for print, preview at 100% zoom, not the default fit-to-window view, before exporting.
- **Placing numbers too close to the page edge.** Many printers and photocopiers trim a few millimeters off the edge of the page. A number placed right at the bottom margin can get clipped. Leaving at least half an inch of margin below the number avoids this.
- **Forgetting that landscape pages number differently.** If your PDF mixes portrait and landscape pages (common in reports with wide tables or charts), check that the numbering position still makes sense on the rotated pages rather than ending up sideways or off-center.

## Page Numbers vs. a Table of Contents

Page numbers and a table of contents solve related but different problems. A table of contents tells a reader what's in the document and roughly where; page numbers are what make that promise checkable. If your document is long enough to need a table of contents, add page numbers first so the numbers you write into the contents actually match the final file. For a shorter document, like a 2-page invoice or a one-off proposal, page numbers alone are usually enough; a table of contents would be overkill.

## FAQ

### Why did my page numbers end up overlapping existing footer text?
This happens when the original PDF already has footer content, like a company name or a date stamp, positioned at the bottom of the page. Since the tool adds a new numbering layer on top of whatever is already there, check the preview carefully and choose a position (bottom-left vs. bottom-right, for example) that doesn't collide with existing footer elements.

### Can I apply different number formats to different sections?
Most browser-based page numbering tools apply one consistent format across the whole document in a single pass. If you need Roman numerals for a preface and Arabic numerals for the body, as is common in academic theses, you'd typically split the document into two parts with [Split PDF](/tools/split-pdf), number each part separately, then rejoin with [Merge PDF](/tools/merge-pdf).

### Can I start numbering from something other than 1?
Yes. Most page numbering tools, including ihatetools, let you set a custom starting number, which is useful when a document is one chapter of a larger bound volume.

### Will this work on a scanned PDF?
Yes. Page numbering stamps new text onto the page canvas, so it works identically whether the underlying page is a scanned image or digitally generated text.

### Does adding page numbers change the PDF's other content?
No, the tool only adds the numbering layer. Your existing text, images, and formatting remain untouched.

### Can I remove page numbers later if I make a mistake?
If you export before you're happy with the result, just re-upload your original (unmodified) file and try again with different settings. Page numbering tools typically don't let you "undo" from the stamped file itself, so always keep your source PDF.

## Wrap Up

A document with proper page numbers reads as more polished and professional, and there's no reason that small fix should require uploading your file anywhere. Everything happens locally, instantly, and privately.

Try the [Add Page Numbers tool](/tools/add-page-numbers) on [ihatetools](/home) now, and if your document needs other cleanup first, check out the full set of [PDF tools](/tools/pdf) while you're there.
