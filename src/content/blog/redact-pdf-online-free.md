---
title: "How to Redact a PDF Without Leaking the Text You're Trying to Hide"
date: "2026-09-15"
description: "Permanently blackout sensitive text and data in a PDF with zero leakage, done entirely in your browser with no file upload."
---

You need to black out a social security number, an account balance, or a client's name before sharing a document, and you've just discovered the horror story that half the internet has run into: drawing a black box over text in a PDF doesn't actually delete it. The text is often still selectable underneath, or worse, it's cached in a server somewhere after you "redacted" it using an online tool. Real redaction means the underlying data is gone, not just visually covered.

## Why Redaction Has to Happen on Your Device

This is maybe the single worst category of document to upload to a random server. You're redacting a file specifically because it contains something sensitive: a legal case detail, medical information, a financial figure, a client's identity. If you upload that file to redact it, you've handed the exact data you're trying to protect to a third party, which defeats the entire purpose. A proper redaction tool needs to both remove the underlying text data and never transmit the original file anywhere, which is only possible if the whole process runs locally in your browser.

There's also a correctness issue specific to redaction. A tool that just draws a visual box but leaves the text layer intact isn't a redaction tool, it's a highlighter. True redaction needs to strip the actual characters and any associated metadata from that region, not just paint over the pixels.

## How to Redact a PDF with ihatetools

1. Open the [Redact PDF](/tools/redact-pdf) tool.
2. Load your PDF; since this runs client-side, the file never leaves your device during the process.
3. Draw a box over each section you need to hide: a name, an account number, a signature, a paragraph of sensitive detail.
4. Apply the redaction. The tool removes the underlying text and content in those regions, not just a cosmetic overlay.
5. Export the redacted PDF and double-check it by trying to select text under the black boxes. If redaction worked correctly, nothing selectable remains.
6. If the document also has metadata (author name, company, GPS tags on embedded images) you want scrubbed, follow up with [Edit PDF Metadata](/tools/pdf-metadata) to clean that too.

## Best Practices for Redacting Sensitive Documents

- **Always verify after redacting.** Open the final PDF, try to select and copy text from the redacted areas, and try zooming into any boxed region. If text or image detail is still visible, the redaction failed.
- **Check for duplicate information elsewhere in the document.** Account numbers and names often appear more than once, in a header, footer, or a table further down. Scan the whole file, not just the obvious instance.
- **Redact before you add page numbers or watermarks.** Doing redaction last avoids any chance that a later step reveals content again, and keeps your edit order simple to retrace.
- **Flatten the document if you plan to share it widely.** Some PDF viewers display layers slightly differently; exporting a flattened version reduces the risk of viewer-specific rendering quirks exposing anything.
- **Keep an unredacted copy somewhere secure and separate.** Once you've exported the redacted version for sharing, don't keep both versions in the same shared folder.
- **Check embedded images too.** If a scanned page includes a photo of a signed document, a redaction box over the printed text might not cover an image-based copy of the same data elsewhere in the file. Consider [Extract PDF Images](/tools/extract-pdf-images) first to inspect what's actually inside the PDF.

### Is drawing a black rectangle over text in a PDF the same as redacting it?

No. Many PDF viewers and editors let you draw a shape on top of text, but the underlying text remains in the file's data and can be selected, copied, or extracted with simple tools. Proper redaction removes the actual content, not just the visual appearance.

### Will my file be uploaded anywhere during redaction?

No. The entire redaction process happens in your browser's memory. The file is never sent to a server, which matters enormously for a document you're redacting precisely because it's sensitive.

### Can I redact multiple pages at once?

Yes, you can mark redaction areas across as many pages as your PDF contains before exporting the final file.

### What if I redact the wrong area by mistake?

Since nothing is uploaded or permanently altered until you export, you can undo and adjust your redaction boxes freely before finalizing the download.

## Redact with Confidence

Redacting a document should remove the risk, not just hide it visually while quietly creating a new one through a third-party upload. Use the [Redact PDF](/tools/redact-pdf) tool on [ihatetools](/home) to permanently and privately strip sensitive content before you share anything.
