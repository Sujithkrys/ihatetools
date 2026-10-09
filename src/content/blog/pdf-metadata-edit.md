---
title: "How to View and Edit PDF Metadata (Title, Author, Properties)"
date: "2026-10-10"
description: "Edit a PDF's title, author, subject, and keywords directly in your browser. See exactly what hidden metadata your document is carrying."
---

Ever shared a PDF and noticed the browser tab or file properties show an old filename, a previous employer's name as the author, or a generic "Untitled" title? That's PDF metadata, the hidden set of properties embedded in every PDF file that most people never think to check, let alone edit. If you're sending a resume, report, or client deliverable, that leftover metadata can look sloppy, or worse, leak information you didn't mean to share.

## Why Metadata Editing Shouldn't Touch a Server

PDF metadata lives in a small, structured block near the end of the file, it's not the document content itself, just properties like Title, Author, Subject, Keywords, and creation date. Editing it is a lightweight operation: read the block, rewrite a few fields, save. There's no good reason this should require uploading your entire document to a third party, especially since metadata can itself contain sensitive information, like the real name tied to a company license, that you might specifically be trying to scrub before you ever hand the file off.

Doing it client-side also means you can check and fix metadata on a whim, right before hitting send on an email, without waiting on an upload for a file that might be dozens of megabytes.

## How to Edit PDF Metadata with ihatetools

1. Open the [Edit PDF Metadata tool](/tools/pdf-metadata).
2. Upload your PDF. The tool reads and displays the current metadata fields immediately: Title, Author, Subject, Keywords, Creator, and Producer.
3. Edit any field directly. Clear out an old author name, add a proper document title, or set relevant keywords if you want the file to be more discoverable when indexed.
4. Save and download the updated PDF. The content of the document is untouched; only the metadata layer changes.

## Practical Tips for Managing PDF Metadata

- **Set a real title, not the filename.** Many PDF viewers and search engines display the Title metadata field, not the filename, in results and tabs. A document saved as `Draft4_FINAL_v2.pdf` can still show up as "Q3 Financial Report" if you set that in the Title field.
- **Clear the Author field before sharing externally.** If a document was drafted under a company account or a previous version of your name, scrub it here before sending it outside your organization.
- **Use Keywords deliberately if your PDFs get indexed.** For documents hosted publicly, like a downloadable guide or whitepaper, filling in relevant keywords can slightly help discoverability in some search and document management systems.
- **Check metadata on PDFs before publishing anything.** Before you post a report or resume online, run it through this tool first and glance at the [PDF Info Viewer](/tools/pdf-info) as well to confirm nothing unexpected is embedded.

## Metadata Mistakes Worth Avoiding

- **Assuming clearing metadata fields makes a document fully anonymous.** Metadata editing clears the Title, Author, Subject, and similar fields, but it doesn't scrub content visible on the actual pages, like a letterhead, a signature, or identifying details typed into the document itself. If true anonymity matters, check the visible page content separately, and consider [Redact PDF](/tools/redact-pdf) for anything sensitive printed directly on the page.
- **Leaving default software-generated values in place without checking them.** Fields like Producer and Creator are filled in automatically and often harmless, but occasionally they carry more than expected, like an internal project codename used as a working filename, or a company name baked into a licensed copy of the software that created the PDF. Worth a glance before sharing externally, even if you don't plan to change them.
- **Forgetting metadata persists through some PDF operations but not others.** Merging two PDFs typically keeps the metadata of whichever file acted as the "base," while compressing or re-exporting a PDF through certain tools can sometimes reset fields to their defaults. If a specific Title or Author value matters to you, it's worth re-checking metadata as the very last step before you send a file out, rather than trusting it survived every edit along the way.
- **Setting keywords that don't match the actual content.** Stuffing the Keywords field with unrelated terms in hopes of improving discoverability in a document management system can backfire if that system surfaces mismatched search results, making the document harder, not easier, to find accurately.

## FAQ

### Does editing metadata change how the PDF looks or prints?
No. Metadata is separate from the visual content of the pages. Editing it only changes the properties stored about the file, not the file's appearance.

### Can metadata reveal personal information even if I don't see it in the document?
Yes. Fields like Author and Creator sometimes carry a real name, username, or software license information pulled automatically from the program that created the PDF. It's worth checking before sharing sensitive files externally.

### Why does my PDF show a strange "Producer" or "Creator" value?
These fields are usually set automatically by whatever software generated the PDF, such as a word processor, scanner app, or PDF library, and often aren't something you need to change.

### Will editing metadata affect the PDF's file size?
Negligibly. Metadata fields are tiny compared to the actual page content, so changes here won't meaningfully change the file size.

## Conclusion

A quick metadata check takes seconds and can save you from an awkward "who is this document actually by?" moment. Since the whole process runs locally, there's no reason not to make it a habit before sharing anything important.

Clean up your document's hidden properties with the [Edit PDF Metadata tool](/tools/pdf-metadata) on [ihatetools](/home), and pair it with the [PDF Info Viewer](/tools/pdf-info) if you want a full look under the hood first.
