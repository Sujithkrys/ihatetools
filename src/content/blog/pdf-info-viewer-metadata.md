---
title: "How to Check a PDF's Page Count, Version, and Hidden Info"
date: "2026-09-11"
description: "Quickly inspect any PDF's page count, PDF version, fonts, and hidden metadata right in your browser, with no upload needed."
---

Someone sends you a PDF and you need to know, before you open it in a heavy desktop app, how many pages it has, whether it's the ancient PDF 1.3 format or a modern one, or whether it's got weird embedded fonts that might not print correctly. Right-clicking "Properties" in your OS often gives you nothing useful, and opening the file in full just to check a page count feels like overkill.

## Why Inspecting a PDF Shouldn't Require Uploading It

Reading a PDF's internal info, page count, version, fonts, embedded metadata, encryption status, is a read-only operation. The tool doesn't need to modify anything, it just needs to parse the file header and structure and report back. That kind of inspection can happen entirely inside your browser's memory using the same parsing libraries that power in-browser PDF viewers, with the file never touching a network request.

This matters especially for files you haven't fully vetted yet. If you've received a PDF from an unknown source and want to peek at its structure before trusting it, the last thing you want is to hand it over to a random third-party server as the first step.

## How to Use the PDF Info Viewer on ihatetools

1. Open the [PDF Info Viewer tool](/tools/pdf-info).
2. Drop in your PDF file.
3. Instantly see a breakdown: total page count, PDF version, file size, whether the document is encrypted or password-protected, embedded fonts, and any metadata fields like Title and Author.
4. Use this information to decide your next step, whether that's compressing, splitting, or editing the file.

## What to Actually Look For

- **PDF version matters for compatibility.** Older PDF versions (1.3, 1.4) are widely compatible but may lack features like transparency or advanced forms. If you're seeing rendering issues in certain viewers, checking the version here is a quick first diagnostic step.
- **Page count mismatches are a red flag.** If a document is supposed to be a 12-page agreement but the viewer shows 15 pages, something got merged or duplicated along the way, worth catching before you sign anything.
- **Encryption status tells you your next move.** If the info viewer flags the file as encrypted, you'll need the [Unlock PDF tool](/tools/remove-password) before you can edit or extract anything from it.
- **Font info can explain print problems.** If a PDF relies on non-embedded fonts, it may render differently (or with substituted fonts) on a machine that doesn't have those fonts installed. This is a common cause of "it looked fine on my computer" printing issues.

## Reading the Less Obvious Fields

- **Page dimensions and orientation.** Beyond a simple page count, checking the actual page size (Letter, A4, or a custom dimension) matters if you're planning to print the document or merge it with other files that might use a different page size, since mismatched page dimensions can look awkward side by side.
- **Producer and Creator fields as a provenance clue.** These fields usually name the software that generated the PDF, like a specific version of a word processor, a scanning app, or a PDF library. If you're trying to figure out whether a document was generated fresh or converted from another format, this is often the quickest hint.
- **Tagged vs. untagged structure.** Some PDFs include accessibility tagging that helps screen readers navigate the document correctly. A PDF that's missing this structure may still display fine visually but be much harder for an assistive technology user to navigate; this is worth checking if you're preparing a document for public or official distribution.
- **Permissions beyond the open password.** A PDF can restrict printing, copying, or editing independently of whether it requires a password to open at all. If the info viewer flags restricted permissions, that explains why copy-paste or printing might be grayed out even on a file that opened without asking for anything.

## When to Check PDF Info Before Other Edits

Running a document through PDF Info Viewer first is a good habit before most other PDF operations. It tells you, before you commit to compressing, whether the file size is already reasonable for its page count. It tells you, before you try to extract text, whether the content is likely real text or a scanned image (a very small file size for a high page count is often a tell that it's been OCR'd already, while image-heavy PDFs run larger). And it tells you, before you hand a file off to someone else, exactly what's attached to it that they'll see in their own viewer.

## FAQ

### Can I see if a PDF has been modified since it was created?
The PDF Info Viewer can surface creation and modification dates stored in the file's metadata, though these fields are self-reported by whatever software last saved the file and can be inaccurate or missing.

### Does checking PDF info work on password-protected files?
Basic structural info like page count and version is often readable even on encrypted files, but you may need to unlock the file first to see full metadata details.

### Why does my PDF show an unusually large file size for so few pages?
This usually points to large embedded images or unoptimized fonts. Run the file through the [Compress PDF tool](/tools/compress-pdf) to shrink it down.

### Is this the same as viewing the PDF's actual content?
No, the Info Viewer reports on the file's structure and metadata, not the visible page content. To read or extract the actual text, use the [Extract PDF Text tool](/tools/extract-pdf-text) instead.

## Final Thoughts

A quick, private look under the hood of a PDF can save you from printing problems, compatibility surprises, or signing something that isn't what it claims to be. Since it's all read-only and local, there's no downside to checking.

Inspect your next PDF with the [PDF Info Viewer tool](/tools/pdf-info) on [ihatetools](/home), and if you want to dig into the actual text or images inside, check out [Extract PDF Text](/tools/extract-pdf-text) and [Extract PDF Images](/tools/extract-pdf-images) next.
