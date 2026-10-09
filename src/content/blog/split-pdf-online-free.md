---
title: "How to Split a PDF Into Multiple Files or Extract Pages"
date: "2026-09-01"
description: "Split a PDF into separate files or pull out specific pages instantly in your browser. No uploads, no watermarks, no file size limits."
---

You have a 60 page scanned contract and you only need pages 12 through 15 for an email. Or maybe you've got one giant PDF that actually contains three separate chapters and you want each one as its own file. Searching "split PDF online" usually lands you on a tool that wants your email address, slaps a watermark on the result, or caps you at 10MB unless you pay. None of that is necessary.

Splitting a PDF is really just picking which pages go where, and that's a task your browser can already do without sending the file anywhere.

## Why splitting a PDF locally actually matters

PDFs that need splitting are often the ones you'd least want floating around on a stranger's server: signed agreements, medical records, financial statements, or a scanned ID bundled into a longer document. When you use a server-based splitter, the whole original file (every page, not just the ones you keep) gets uploaded first. If you're separating out a sensitive section specifically because you don't want to share the rest, uploading the entire thing first defeats the point. Doing it client-side means the unwanted pages never leave your machine either, let alone the ones you're extracting.

## How to split a PDF with ihatetools

1. Open the [Split PDF tool](/tools/split-pdf) on [ihatetools](/home).
2. Drop in your PDF. The tool renders a page-by-page preview right in your browser, so you can see exactly what you're working with before committing to anything.
3. Choose your split mode: pull specific page ranges into a new file, or split every page (or a defined interval) into separate standalone PDFs.
4. Select the pages or ranges you want.
5. Click split and download the result. If you generated multiple files, you'll get them bundled so you're not clicking one by one.

The whole process runs in your browser's memory using a PDF library loaded locally, so even a large multi-hundred-page file is just limited by your device's memory, not an arbitrary server quota.

## Tips for cleaner splits

- Check the page thumbnails before splitting if your PDF came from a scanner. Scanned documents sometimes have blank pages inserted between sections, and you'll want to exclude those rather than carry them into your new file.
- If you're splitting a document to send different sections to different people, rename each resulting file immediately after download so you don't mix them up later. A quick pass through the [Bulk File Renamer](/tools/bulk-file-renamer) works well if you've split into many files at once.
- If your source PDF is large because of embedded images, splitting it won't necessarily shrink file size proportionally. Run the smaller output through [Compress PDF](/tools/compress-pdf) afterward if you still need it lighter for email.
- Splitting preserves page rotation and orientation as-is. If a page came out of your scanner sideways, fix it with [Rotate PDF](/tools/rotate-pdf) either before or after splitting.

## Troubleshooting Common Split Problems

- **A split file is missing a page you expected to see.** Double-check whether your page range was inclusive on both ends. A range entered as "12-15" should include all four pages, but it's worth confirming in the preview before export, since off-by-one mistakes are the most common error when splitting manually.
- **The split files came out in a confusing order when you split by interval.** If you split a 60-page document into chunks of 10, the resulting files are usually named or ordered sequentially, but double-check the naming convention your tool uses so you don't mix up which chunk is which once they're all downloaded separately.
- **You need overlapping page ranges in two different output files, like sharing page 15 as the last page of one section and the first page of the next.** Most split tools treat ranges as exclusive, meaning a page can only end up in one output file at a time. If you need the same page in two outputs, you'll need to run the split twice with overlapping ranges, or extract the shared page separately and merge it into both files afterward.
- **The split PDF opens but looks different from the original, like missing headers.** This is rare, but if your original PDF had page headers or footers generated dynamically based on total page count (common in some generated reports), splitting won't recalculate those, since splitting only separates existing pages rather than regenerating content.

## Split vs. Delete Pages vs. Organize

These three tools overlap in what they touch but solve different problems. Split PDF is for when you want to turn pages into one or more new standalone files. [Delete PDF Pages](/tools/delete-pdf-pages) is for when you want to remove a few pages and keep everything else as a single file. [Organize PDF](/tools/organize-pdf) is for when you need to reorder, rotate, or delete pages within one file without necessarily splitting anything out. If your actual goal is "get rid of page 4" rather than "make page 4 its own file," Delete PDF Pages is the more direct tool.

### Will splitting reduce my PDF's file size?

Only proportionally. If you extract 5 pages out of 50, you'll end up with roughly a tenth of the original size, assuming content is distributed evenly across pages. It won't compress images or fonts on its own; use a dedicated compressor for that.

### Can I split a password-protected PDF?

You'll need to remove the password first. Use [Unlock PDF](/tools/remove-password) to decrypt the file, then split it. Since everything happens locally, your password and the unlocked content never touch a server either.

### Does the order of extracted pages matter?

When you select a page range, the pages come out in their original order. If you need pages rearranged rather than just extracted, use [Organize PDF](/tools/organize-pdf) instead, which lets you drag pages into a new order before exporting.

## Get your pages out without the upload

There's no good reason to hand a document to a third-party server just to pull a few pages out of it. The [Split PDF tool](/tools/split-pdf) does the job entirely on your device, instantly, for free, with no limit on how many times you use it. Give it a try the next time you need to separate a PDF into pieces.
