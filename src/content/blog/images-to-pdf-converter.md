---
title: "How to Combine Multiple Images Into a Single PDF"
date: "2026-09-05"
description: "Turn a batch of photos or scans into one clean PDF document directly in your browser, with no uploads or sign-up required."
---

You've got a stack of photos from your phone, maybe pages of a scanned document shot one at a time, or a handful of screenshots, and what you actually need is a single PDF to submit, email, or print as one cohesive file. Doing this by pasting images into a word processor and exporting to PDF works, but it's slower and messier than it needs to be for something this routine.

## Why combining images into a PDF should stay local

Photos, especially ones taken with a phone camera for a scan, often carry more personal information than people realize: location metadata, timestamps, and obviously whatever is visible in the shot itself, which for a document scan might be an ID, a signature, or financial details. Uploading a batch of these to a server just to stitch them together is an unnecessary step when your browser can already decode images and lay them out into a PDF page by page without any of that data leaving your device. It's also just faster: no upload queue for potentially large photo files, no waiting on a server to process a batch.

## How to turn images into a PDF with ihatetools

1. Open the [Images to PDF tool](/tools/images-to-pdf) on [ihatetools](/home).
2. Add your images by dragging them in or selecting multiple files at once.
3. Arrange them in the order you want them to appear as pages, drag to reorder if needed.
4. Choose page size and orientation if the tool offers it, matching the images' natural orientation keeps things looking clean.
5. Generate the PDF and download the finished file.

Everything, from decoding the images to laying out pages and assembling the final PDF, happens using your browser's own processing, so a batch of twenty photos converts about as fast as your device can render them.

## Tips for a cleaner result

- If your photos are a mix of portrait and landscape, decide up front whether you want a uniform page orientation (which may add white borders to some images) or a page-by-page orientation that matches each image. Consistency usually looks more professional for formal documents.
- Straighten and crop photos before converting if they were taken at an angle or include extra background. The [Image Crop](/tools/crop-image) tool is useful here, and [Rotate Image](/tools/rotate-image) can fix sideways shots.
- If some of your source photos are very high resolution (common with modern phone cameras), the resulting PDF can get large. Run it through [Compress PDF](/tools/compress-pdf) afterward if file size matters for email or upload limits.
- For scanned document pages specifically, converting to grayscale first with [Grayscale Image](/tools/grayscale-image) can make the final PDF noticeably smaller and give it a more consistent "scanned document" look.

## Common Mistakes When Building a PDF From Images

- **Not checking image order before generating.** It's easy to select a folder of scanned pages and assume they'll load in filename order, but depending on how your files were named (or how your phone exported them), the default order might not match the actual page sequence. Always scroll through the thumbnail order before generating, not after.
- **Mixing portrait and landscape images without a plan.** A document that alternates between tall and wide pages without a clear reason looks disorganized when printed or viewed as a PDF. Decide ahead of time whether every page should share one orientation or rotate individual images first.
- **Forgetting that phone photos often need straightening.** Pictures taken handheld, especially of paper documents on a table, are rarely perfectly square to the page. A few degrees of tilt is barely noticeable in a single photo but becomes obvious once several tilted "pages" sit back to back in a PDF. A quick pass through [Rotate Image](/tools/rotate-image) before converting fixes this.
- **Including a blurry or duplicate shot by accident.** When converting a big batch of scan photos (common if you photographed a multi-page document one shot per page), it's easy to accidentally include a near-duplicate or an out-of-focus retake. Review the full set before generating since removing a page afterward means regenerating the whole file.

## Images to PDF vs. Scanning Apps

If you're converting phone photos of a paper document specifically, a dedicated scanning app on your phone might auto-crop and straighten each shot for you before you even get to this step, which can save you a cleanup pass. But for anything that isn't a fresh paper scan, screenshots, downloaded photos, existing digital images, Images to PDF is the simpler and more direct route since there's no scanning step to begin with.

### Can I mix different image formats like PNG and JPG in one PDF?

Yes, the tool handles different formats in the same batch; each image becomes a page regardless of its original file type.

### Will image quality be reduced in the PDF?

The tool preserves the image quality you provide. If you want a smaller output file, compress the images beforehand or compress the resulting PDF afterward rather than relying on automatic downscaling.

### What if I need to add more images after creating the PDF?

You can always add more images and regenerate the PDF since nothing is saved server-side between sessions. Alternatively, convert the new images separately and use [Merge PDF](/tools/merge-pdf) to combine the two PDFs together.

## Build your PDF in seconds

Turning a batch of images into one tidy document shouldn't involve uploading your photos anywhere. The [Images to PDF tool](/tools/images-to-pdf) handles the whole thing locally and instantly. Give it a try next time you need to bundle scans or photos into a single file.
