---
title: "Free Barcode Generator: Create Code 128, EAN-13, and UPC Barcodes Online"
date: "2026-10-10"
description: "Generate 1D barcodes in Code 128, EAN-13, and UPC formats instantly in your browser. No uploads, no software installs, no per-barcode fees."
---

Someone selling products on Etsy, listing inventory in a spreadsheet, or printing shelf labels for a small shop usually hits the same wall: they need a barcode, right now, and don't want to install desktop labeling software or pay a subscription just to generate a single image file.

Most "free" barcode generators online are free until you try to download anything larger than a thumbnail, or they want your product data submitted through a form that lands on someone else's server. For something as simple as turning a string of digits into a scannable image, that's a lot of friction for very little benefit.

## Why a barcode generator should run entirely in your browser

A barcode is just a visual encoding of data you already have: a SKU, an ISBN, a product number. There's no reason that encoding step needs a server round trip. Rendering a barcode is lightweight work that any modern browser can do in milliseconds using canvas or SVG, which means there's no upload queue, no "processing" spinner, and no copy of your product catalog sitting in someone's server logs. If you're generating barcodes for internal inventory numbers you'd rather not expose, keeping the whole operation client-side also means that data never leaves your machine in the first place.

## How to generate a barcode with ihatetools

1. Open the [Barcode Generator](/tools/barcode-generator) tool.
2. Choose your format: Code 128 for general-purpose alphanumeric data, EAN-13 for retail products sold in Europe and most of the world, or UPC for North American retail.
3. Type or paste in the number or text you want encoded. For EAN-13 and UPC, make sure you're entering the correct digit length; the tool will flag it if the checksum doesn't line up.
4. Preview the generated barcode immediately, no "generate" button delay.
5. Download it as an image and drop it straight into your label template, product listing, or packaging design.

Because the rendering happens instantly on each keystroke, you can tweak the input and see the result update in real time rather than resubmitting a form.

## Picking the right format

- **Code 128**: Use this for shipping labels, internal tracking numbers, or any alphanumeric string that doesn't need to fit a retail standard. It's compact and supports the full ASCII range.
- **EAN-13**: Required if you're selling a physical product through retail channels outside the US and Canada. The last digit is a checksum, so if you're assigning your own numbers (rather than using a registered GS1 prefix), double-check the checksum calculation or let the tool compute it for you.
- **UPC-A**: The 12-digit standard most common in US and Canadian retail. If you're building a real retail product, you'll want an officially licensed UPC prefix from GS1, not just any 12 digits, to avoid collisions with other sellers' products.
- **Test scan before printing in bulk**: Print one label and scan it with an actual barcode scanner or a phone scanning app before running a full batch. Formatting issues (like insufficient white space margin around the barcode, called the "quiet zone") are easy to miss on screen but will cause real scan failures.

## Practical tips for using barcodes in real workflows

- Keep barcode images at a reasonably high resolution when printing on small labels; blurry, undersized barcodes are a common cause of failed scans at checkout.
- If you're batch-generating barcodes for many SKUs, keep a spreadsheet mapping each code to its product so you're not regenerating or guessing values later.
- Pair a barcode-labeled product with a QR code if you also want to link to a webpage, manual, or warranty page. The [QR Code Generator](/tools/qr-code-generator) handles that case, since QR and 1D barcodes solve different problems: QR codes carry URLs and rich data, 1D barcodes carry short fixed-format identifiers.
- If your labels are part of a larger PDF catalog or packing sheet, you can generate barcode images separately here and then assemble them with the [Images to PDF](/tools/images-to-pdf) tool for printing.

## FAQ

### What's the difference between Code 128 and UPC?
Code 128 encodes any alphanumeric string and is commonly used for logistics and internal tracking. UPC is a strict 12-digit numeric retail standard tied to a registered manufacturer prefix, meant specifically for point-of-sale scanning in stores.

### Can I generate a barcode from a random number, or do I need an official one?
You can generate a barcode from any number for internal use, testing, or non-retail labeling. If you intend to sell a product through retail stores or major marketplaces, you need an officially assigned GS1 prefix to avoid duplicate codes with other sellers.

### Why did my EAN-13 or UPC barcode get rejected?
These formats include a checksum digit calculated from the preceding digits. If you typed the number manually and got the checksum wrong, the barcode will encode correctly as an image but scanners may flag it as invalid. Let the generator calculate the checksum rather than typing all 13 digits yourself.

### Will the barcode scan correctly from a phone screen?
Usually yes for quick tests, but for production use, print it. Screen glare, resolution, and anti-reflective coatings on glass can cause inconsistent scans compared to a printed label.

## Generate your barcode now

There's no reason barcode generation should involve installing software or handing your product data to a third-party server. Open the [Barcode Generator](/tools/barcode-generator) on [ihatetools](/home), pick your format, and get a scannable image in seconds, entirely in your browser.
