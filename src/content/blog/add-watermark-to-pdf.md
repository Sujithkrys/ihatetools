---
title: "How to Add a Watermark to a PDF for Free"
date: "2026-10-10"
description: "Stamp text watermarks like DRAFT or CONFIDENTIAL onto PDF pages instantly in your browser, with no sign-up and no server upload."
---

Sending out a draft contract, a confidential proposal, or a sample report before the final version is ready usually calls for a watermark, something visible stamped across the pages that signals "don't treat this as final" or "do not distribute." Searching for a way to do that often turns up tools that themselves slap their own watermark onto your file in exchange for using theirs for free, which is a little absurd when all you wanted was to add your own text.

## Why watermarking locally is the better default

A document that needs a "CONFIDENTIAL" or "DRAFT" stamp is, by definition, usually a document you're being careful about. Uploading it to a third-party server to add that label is a strange trade-off: you're trying to limit how a file circulates while simultaneously sending a full copy of it somewhere you don't control. Doing the watermarking client-side means the only copy of the document that ever exists outside your device is the one you choose to export, already stamped, after you've decided it's ready to go out.

## How to add a watermark with ihatetools

1. Open the [Add Watermark tool](/tools/add-watermark) on [ihatetools](/home).
2. Upload your PDF.
3. Type the watermark text you want, such as "DRAFT," "CONFIDENTIAL," or a company name.
4. Adjust the font size, color, opacity, and rotation angle so it's visible but doesn't obscure the content underneath.
5. Choose whether to apply it to all pages or a specific range.
6. Apply the watermark and download the stamped PDF.

Since the rendering happens in your browser, you can preview the watermark's placement and tweak the opacity or angle a few times before committing, without needing to re-upload the document each time.

## Getting the watermark right

- Diagonal watermarks at a lower opacity (around 20-30%) tend to be the most legible without obstructing the underlying text, which is why most official-looking "DRAFT" stamps use that angle.
- If the document will be printed in black and white, test your watermark color choice against a grayscale preview; a light color that stands out on screen can disappear entirely once printed.
- For documents with dense text, keep watermark font size moderate. An oversized watermark can make scanned or printed copies hard to read even at low opacity.
- If you need to protect the document further so the watermark (and content) can't easily be edited out by whoever receives it, follow up with [Protect PDF](/tools/add-password) to add a password restricting edits.
- Watermarking doesn't rotate or reorder pages; if you also need to fix page order or orientation, handle that first with [Organize PDF](/tools/organize-pdf) so the watermark lands correctly on a clean, finished layout.

## Common Watermarking Mistakes

- **Using full opacity.** A watermark set at 80-100% opacity can make the underlying text genuinely hard to read, especially on smaller screens or when the document is photocopied. Stick to the 15-30% range for anything meant to still be read normally.
- **Forgetting the watermark applies to every page, including ones that don't need it.** If your document has a cover page or appendix that shouldn't carry the "DRAFT" label (because it's a standard legal boilerplate page, for instance), check whether your watermark tool supports a page range and use it, rather than applying to the whole file and manually explaining the exception later.
- **Picking a color that disappears against certain page backgrounds.** A PDF with colored section dividers or shaded tables can swallow a watermark that works fine on plain white pages. Check the watermark against every distinct background color used in the document, not just the first page.
- **Watermarking a file that still has tracked changes or comments visible.** A watermark doesn't hide markup, revision marks, or sticky-note comments left over from editing. Clean those up in your source document before exporting to PDF and watermarking, since the watermark can make an already-busy page even harder to parse.

### Can I add an image or logo as a watermark instead of text?

This tool is built for text-based watermarks like "DRAFT" or "CONFIDENTIAL" stamped across the page. If you need a specific image-based watermark layout, consider overlaying it on individual images first using [Add Text to Image](/tools/add-text-to-image) before converting to PDF.

### Will the watermark show up if someone prints the PDF?

Yes, the watermark is rendered as part of the page content, so it appears both on screen and in print, which is the point of using one to mark a draft or confidential document.

### Can I remove a watermark after adding it?

Not through this tool once it's applied and exported, since the watermark becomes part of the page. Keep your original, unwatermarked file saved separately if you'll need a clean version later.

### Should I watermark before or after I compress a PDF?

Watermark first, then compress. Watermarking adds a thin layer of vector or text content, which compressing afterward won't meaningfully shrink, but compressing first and watermarking second risks the watermark's rendering looking slightly different against recompressed images. If file size matters for your watermarked document, run it through [Compress PDF](/tools/compress-pdf) as the final step after the watermark is already in place.

### Can I use a different watermark on different pages of the same document?

Not in a single pass with most text watermark tools, which apply one consistent text, size, and placement across the pages you select. If you need, say, "DRAFT" on the first ten pages and "CONFIDENTIAL" on the rest, split the document into two parts with [Split PDF](/tools/split-pdf), watermark each separately, then rejoin them with [Merge PDF](/tools/merge-pdf).

## Stamp it before you send it

Marking a document as a draft or confidential shouldn't mean uploading it to a service that adds its own branding on top. The [Add Watermark tool](/tools/add-watermark) on [ihatetools](/home) lets you stamp exactly the text you want, entirely in your browser. Try it before your next round of document review.
