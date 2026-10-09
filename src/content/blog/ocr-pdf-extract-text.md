---
title: "How to Extract Text From a Scanned PDF Using OCR"
date: "2026-09-08"
description: "Turn scanned PDFs or image-based documents into searchable, selectable text using browser-based OCR with no file uploads."
---

A scanned document looks like text but behaves like a photograph: you can't select it, search it, or copy a sentence out of it. That's the gap optical character recognition (OCR) fills, reading the shapes on the page and turning them back into actual text. The frustrating part is that most OCR tools online ask you to upload the scan first, which for a lot of scanned documents (IDs, old contracts, handwritten forms, medical paperwork) is exactly the kind of file people would rather not hand over to a server just to make it searchable.

## Why OCR works better as a local process here

Scanned documents are disproportionately likely to contain sensitive information precisely because scanning tends to be how older paper records (the ones most in need of OCR) get digitized in the first place: old tax forms, signed agreements, government paperwork. Running OCR in the browser means the recognition model processes the image data directly on your device, and the text it extracts never passes through a third party's server either. There's also a practical speed benefit: OCR on a long scanned document can take a noticeable amount of time, and doing that locally avoids the added latency of an upload and download on top of the processing itself.

## How to run OCR with ihatetools

1. Open the [OCR PDF tool](/tools/ocr-pdf) on [ihatetools](/home).
2. Upload your scanned PDF or image-based document.
3. Start the OCR process. The tool analyzes each page's visual content and extracts recognizable text.
4. Review the extracted text against the original pages, OCR accuracy depends heavily on scan quality, so a quick check catches any misreads.
5. Download the text output, or the resulting searchable PDF if that's the mode you used.

Because recognition runs locally, you can process a multi-page scanned document without worrying about upload size limits that many free OCR services impose.

## Tips for accurate OCR results

- Scan quality matters more than anything else. A clear, high-contrast, well-lit scan at a reasonable resolution will produce far more accurate text than a blurry photo taken at an angle under poor lighting.
- If your source is a photo rather than a proper scan, straighten it first. Even a slight rotation can throw off character recognition line by line. [Rotate Image](/tools/rotate-image) or [Crop Image](/tools/crop-image) can help clean up a photo before running OCR on it.
- Handwritten text is much harder for OCR to recognize accurately than printed text. Expect noticeably lower accuracy on handwritten forms compared to typed or printed documents.
- If you just need to search within a document rather than fully extract and reuse the text, running OCR to create a searchable PDF is often more useful than extracting plain text, since it preserves the original layout while adding a text layer underneath.
- Already have a PDF with real selectable text and just want to pull it out? Skip OCR entirely and use [Extract PDF Text](/tools/extract-pdf-text), which is faster and more accurate than recognition since the text already exists digitally.

## Troubleshooting Poor OCR Results

- **The output is mostly correct but with random wrong characters scattered through it, like "0" instead of "O" or "1" instead of "l".** This is a classic OCR confusion between visually similar characters, and it's more common with low-resolution scans or unusual fonts. A manual proofread pass, especially on numbers and proper nouns, is worth doing before using the text for anything important like a legal reference or data entry.
- **Entire lines or paragraphs are missing from the output.** Check whether those sections used a colored or low-contrast background, faint gray text, or a decorative font. OCR engines generally expect dark text on a light background, and anything that deviates significantly from that can get skipped entirely rather than misread.
- **The recognized text is in the wrong reading order.** Multi-column scanned pages, like a two-column newsletter layout, can confuse OCR's reading order the same way they confuse regular text extraction. If the output order is scrambled, check whether the tool offers a column-detection mode, and otherwise expect to manually reorder affected paragraphs.
- **OCR works fine on some pages but fails completely on others in the same document.** This usually points to inconsistent scan quality within the same batch, like a document scanned in multiple sessions on different equipment, or a few pages that were photographed instead of scanned. Check those specific pages for lower contrast or sharper skew.

### Does OCR work on photos of documents, not just scans?

Yes, OCR can process any image-based input, including photos, as long as the text is reasonably legible. Scan quality and lighting still make a big difference in accuracy.

### How accurate is browser-based OCR compared to desktop software?

Accuracy depends more on the underlying recognition model and image quality than on where the processing happens. For clean, printed text, browser-based OCR performs comparably well; for messy scans or handwriting, expect some manual correction either way.

### Can OCR recognize text in different languages?

Many OCR engines support multiple languages, though accuracy can vary. If your document isn't in English, check whether the tool's recognition handles your specific language well before relying on it for a large batch of documents.

## Make your scans searchable

Scanned documents don't have to stay locked as unsearchable images. The [OCR PDF tool](/tools/ocr-pdf) on [ihatetools](/home) extracts the text locally, so your original document never has to leave your browser. Try it on your next batch of scanned paperwork.
