---
title: "How to Round Image Corners or Crop a Photo into a Circle"
date: "2026-10-10"
description: "Add rounded corners or a perfect circle crop to any photo online, instantly in your browser, with transparent PNG output and no watermark."
---

Nearly every modern app avatar, profile picture, or card thumbnail uses a rounded or circular image instead of a hard rectangle. It's a small design detail, but it's the kind of thing you need right now while you're building a landing page or setting up a profile, and you don't want to open a full design program just to round four corners.

Rounding corners or cropping to a circle is a shape mask applied to your image, something a browser can draw in a single canvas operation. There's no reason it needs a server round trip.

## Why This Should Happen Locally, Not on a Server

A rounded corner or circle crop is drawn using a clipping path, a shape your browser already knows how to render natively through its own graphics engine. Uploading your photo to a remote service just to apply a mask means waiting on a network request for something your device could finish before the request even reaches the server. It also means a profile photo, a product shot, or someone's headshot sits on a third-party server, even briefly, for an operation that gains nothing from being done remotely.

Processing this in-browser also sidesteps the common gotcha with these tools: many of them flatten your rounded image onto a white or checkered background and sell you the transparent PNG as a "pro" feature. Doing it locally means you get a proper transparent background PNG by default, since there's no monetization incentive built into the tool.

## How to Round or Circle-Crop an Image with ihatetools

The [Round Image tool](/tools/round-image) applies the mask directly in your browser and exports a transparent PNG.

1. Open the [Round Image tool](/tools/round-image).
2. Upload the photo you want to shape.
3. Choose a circle crop for a perfectly round result, or set a corner radius for softened rectangular corners.
4. Adjust the radius or circle size until the preview looks right, you can see exactly how it will look against any background.
5. Download the result as a PNG with a transparent background, ready to drop into a design, website, or app.

Because the whole process runs locally, you can iterate on the radius setting as many times as you want without re-uploading anything.

## Common Uses for Rounded and Circular Images

- **Profile pictures and avatars**: nearly every social platform and app displays user photos as circles.
- **Website team or testimonial sections**: rounded or circular headshots feel friendlier and more modern than hard-edged rectangles.
- **App icons and favicons**: a circular or rounded-square crop is often the first step before generating a full icon set.
- **Product thumbnails in e-commerce grids**: subtly rounded corners on product photos is a common design pattern to soften a grid layout.

## Tips for a Clean Result

- Start with a square photo when you're aiming for a circle crop. If your source photo isn't square, crop it to a square first with the [Image Crop tool](/tools/crop-image) so the circle doesn't awkwardly cut off important parts of the subject.
- Center your subject before rounding. A circle crop is unforgiving if the subject is off to one side, since the corners of the frame get cut away entirely.
- Keep the exported PNG transparent if you're placing the image over anything other than plain white, a flattened white background will show as an ugly square behind your circle once placed on a colored page.
- If you're building a full favicon set from a rounded logo, head to the [Favicon Generator](/tools/favicon-generator) afterward to generate every required size in one go.

## Frequently Asked Questions

### Will rounding the corners add a white background behind the image?
Not if you export as PNG. The tool keeps the corners transparent rather than filling them with a solid color, so the image will blend cleanly into whatever background you place it on.

### What image format should I use for the output?
PNG is almost always the right choice here because it supports transparency. JPEG doesn't support transparent pixels, so a JPEG export would show a solid color where the rounded corners were cut.

### Can I undo the crop if I pick the wrong radius?
Yes, since nothing is uploaded or destroyed, you can simply re-upload the original image and try a different radius or circle size as many times as you like.

### Does this work for non-square images too?
Yes, you can round the corners of any rectangular image without cropping it to a square first. Circle crops, however, look best on square source images.

## Round Your Image Now

A rounded or circular photo is a small touch that makes interfaces feel more polished, and it should take seconds to produce. Try the [Round Image tool](/tools/round-image) on [ihatetools](/home) to get a clean, transparent result with no watermark and no uploads. For logos specifically, pair it with the [Favicon Generator](/tools/favicon-generator) to finish the whole icon set in one sitting.
