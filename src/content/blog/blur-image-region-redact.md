---
title: "How to Blur or Redact a Part of an Image Online"
date: "2026-09-21"
description: "Blur or redact sensitive parts of any photo, like faces, license plates, or documents, instantly in your browser with no uploads involved."
---

You're about to share a screenshot that has an email address visible, or a photo that includes someone's license plate or a document with an account number on it, and before you post it anywhere, that part needs to disappear. Uploading a photo that contains exactly the sensitive information you're trying to hide, to a random website's server, just to redact it, defeats the purpose a little.

Blurring or redacting a region of an image is a localized pixel operation: the browser just needs to apply a blur filter (or a solid fill) to the specific area you select. There's no reason that needs to leave your device.

## Why Redacting Should Never Touch a Server

This is maybe the clearest case for client-side processing on this entire site. The whole point of blurring a region is to hide sensitive information, a face, a document number, a license plate, an address, before you share the image publicly. If you upload that same image to a third-party server first, you've already exposed the information you're trying to protect, just to a different, less visible audience. Even if the service claims not to store anything, there's no way to verify that from the outside, and the file still had to leave your device at some point during the process.

Doing the redaction entirely in your browser means the sensitive image never transmits anywhere, the blur is applied and the final image is generated locally, and only the redacted version ever needs to leave your computer, if you choose to share it at all.

## How to Blur a Region of an Image with ihatetools

The [Blur Image Region tool](/tools/blur-image-region) lets you select and blur specific areas directly in the browser.

1. Open the [Blur Image Region tool](/tools/blur-image-region).
2. Upload the image you want to redact.
3. Draw a selection box or shape over the area you want to blur or hide, a face, a license plate, a line of text, anything sensitive.
4. Adjust the blur intensity until the underlying content is no longer recognizable.
5. Download the finished image with the region permanently obscured.

Because the whole process stays local, you can check the blurred region closely before downloading to make sure the original information really is unreadable, without having already sent it anywhere.

## Common Situations Where This Is Useful

- **Sharing screenshots publicly**: hiding an email address, usernames, or account details visible in a screenshot before posting it in a forum or support thread.
- **Photos with bystanders**: blurring faces or license plates in a photo before sharing it online, especially for street photography or event photos.
- **Document photos**: covering an ID number, signature, or account number in a photographed document before sending it somewhere it doesn't need full visibility.
- **Internal screen recordings or demos**: blurring a sensitive part of a UI (like real customer data) before using a screenshot in a presentation or tutorial.

## Tips for Redaction That Actually Holds Up

- A light blur can sometimes be reversed or guessed at, especially for short, predictable text like a phone number. When the content is genuinely sensitive, use a strong enough blur setting, or consider a solid fill instead of a blur, to make sure nothing is recoverable.
- Double-check your selection fully covers the sensitive area with some margin, a selection box that's slightly too small can leave an edge of readable text or a partial face visible.
- If you're redacting a scanned document rather than a photo, also consider the dedicated [Redact PDF tool](/tools/redact-pdf) if the source file is actually a PDF, it's built specifically for that format.
- After redacting, review the final downloaded image at full size (not just the thumbnail preview) to confirm the blurred area is actually unreadable before you share it anywhere.

## Frequently Asked Questions

### Can a blurred region be reversed or "unblurred" by someone else?
A strong enough blur applied to sufficiently small or simple content (like a short string of digits) can sometimes be guessed or partially reconstructed with enough effort. For truly sensitive information, a heavier blur or a solid color fill over the region is safer than a light blur.

### What's the difference between blurring and redacting?
They're often used interchangeably here: blurring obscures the content by smearing the pixels so it's no longer legible, while redacting more broadly refers to hiding sensitive information, which can be done with a blur or with a solid opaque fill, depending on how certain you need to be that it's unrecoverable.

### Does this work on photos taken with a phone?
Yes, any standard image file, including phone photos, can be uploaded and have specific regions blurred the same way.

### Is this the right tool for redacting a PDF document?
If your sensitive file is a PDF rather than an image, the dedicated [Redact PDF tool](/tools/redact-pdf) is built specifically for that format and workflow.

## Redact Your Image Now

When you're hiding sensitive information, the last thing you want is to expose it to a third party in the process. Try the [Blur Image Region tool](/tools/blur-image-region) on [ihatetools](/home) and redact what needs hiding without a single upload. If you need to crop out the sensitive area entirely instead of just blurring it, the [Image Crop tool](/tools/crop-image) is a good alternative approach.
