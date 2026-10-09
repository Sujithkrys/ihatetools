---
title: "How to Reorder, Rotate, and Delete PDF Pages Easily"
date: "2026-09-04"
description: "Rearrange, rotate, or remove pages from a PDF with a simple drag-and-drop editor that runs entirely in your browser."
---

A scanner feeds pages in the wrong order, a contract gets two sections swapped during printing, or a report has a blank page stuck in the middle that shouldn't be there. Fixing any of this used to mean reprinting and rescanning, or opening heavyweight desktop software just to drag a few pages around. It's a much smaller job than that, and it doesn't need a server to do it either.

## Why page organizing belongs in your browser, not a server

Reordering pages means your tool needs to see and hold the entire document's structure at once, every page, in whatever order you leave them in. Uploading a full document just to shuffle a few pages around is a lot of exposure for a fairly mechanical edit, especially for anything like leases, applications, or internal reports where page order often reflects something structural about the document (cover page, signatures, appendices). Doing this client-side means the rearranged document is assembled right there in your browser's memory, and the only version that ever gets saved anywhere is the final file you choose to download.

## How to organize a PDF with ihatetools

1. Open the [Organize PDF tool](/tools/organize-pdf) on [ihatetools](/home).
2. Drop in your file. Each page renders as a thumbnail you can see at a glance, which makes spotting out-of-order or blank pages much faster than scrolling through the full document.
3. Drag thumbnails to reorder them into the sequence you want.
4. Rotate individual pages that came out sideways or upside down, without affecting the rest of the document.
5. Delete pages you don't need, like a blank scan or a duplicate cover sheet.
6. Export the reorganized PDF and download it.

Since the thumbnails are generated locally, you can work through a long document quickly, even on a flight with no connection, because nothing about the process depends on network speed.

## Practical tips

- Do a full thumbnail scroll before you start rearranging. It's much faster to plan the final order mentally first than to drag pages one at a time while figuring out the layout as you go.
- If a scanned document has pages rotated inconsistently (some portrait, some landscape), fix rotation before reordering, since it's easier to judge correct sequence when every page is displayed right-side up.
- Removing pages here is permanent only once you export; you can always start over with the original file since nothing is modified until you download. Keep your original PDF untouched in a separate folder just in case.
- If you only need to rotate every page in the document by the same amount (say the whole scan came in sideways), it's faster to use [Rotate PDF](/tools/rotate-pdf) instead of rotating pages one by one.
- If your real goal is extracting a few pages into their own file rather than reordering the whole document, [Split PDF](/tools/split-pdf) is the more direct tool for that.

## Common Problems When Reorganizing a PDF

- **A rotated page looks correct in the thumbnail but prints sideways.** This is rare but can happen if a printer or secondary viewer ignores the page's new rotation flag. If you hit this, try re-exporting and checking the file in a different PDF viewer before printing, since the issue is usually with how that specific viewer renders rotation metadata rather than the file itself.
- **Pages that looked identical got deleted by mistake because they seemed like duplicates.** Some documents intentionally repeat a near-identical page, like a signature page that appears for each party, or a disclaimer repeated per section. Zoom into thumbnails before deleting anything that looks like a duplicate, since a genuine duplicate and an intentional repeat can look the same at thumbnail size.
- **The final page count doesn't match what you expected.** If you deleted pages and reordered at the same time, it's easy to lose track of exactly how many pages should remain. Count the thumbnails before export, not after, so you catch an accidental double-delete while you can still undo it by starting over with the original file.
- **A table or chart that spans two pages got separated during reordering.** When reordering a document with content that flows across adjacent pages, like a wide table split in two, keep those pages' relative order intact even as you move other sections around them.

### Can I undo a deletion after exporting?

Not from the exported file itself, since the deleted pages are gone from that output. But your original file is never altered, so you can reopen it in the tool and start fresh at any time.

### Does reordering pages affect bookmarks or links inside the PDF?

Internal links and bookmarks that reference specific pages may point to the wrong location after a reorder, since they're tied to the original page structure. If your document relies heavily on internal navigation, double check those after reorganizing.

### Can I combine organizing with merging multiple PDFs?

Organize PDF works on a single file's pages. If you need to combine several documents and then reorder the result, use [Merge PDF](/tools/merge-pdf) first to combine them, then open the merged file in Organize PDF to fine-tune the page order.

## Put your pages back in order

Fixing page order, rotation, or stray blank pages shouldn't be a multi-step hassle involving a scanner and a server upload. The [Organize PDF tool](/tools/organize-pdf) lets you fix all three in one pass, right in your browser. Try it next time a document comes out of order.
