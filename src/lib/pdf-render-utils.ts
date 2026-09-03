import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker securely only on the client side
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface PdfPageThumbnail {
  id: string; // unique ID for React keys
  origIndex: number; // 0-based index in the original PDF
  thumbnail: string; // Data URL (JPEG)
}

/**
 * Generates thumbnails for all pages of a given PDF file.
 * Automatically limits the thumbnail size for performance (e.g. 200px width).
 */
export async function generatePdfThumbnails(
  file: File,
  options: {
    targetWidth?: number;
    quality?: number;
    onProgress?: (msg: string) => void;
  } = {}
): Promise<PdfPageThumbnail[]> {
  const { targetWidth = 200, quality = 0.8, onProgress } = options;
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const pageItems: PdfPageThumbnail[] = [];

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) {
      onProgress(`Rendering page ${i} of ${numPages}...`);
    }

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });

    // Calculate a scale to fit thumbnail roughly to targetWidth
    const scale = targetWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not create canvas context");

    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render({ canvasContext: context, viewport: scaledViewport } as any).promise;
    
    const dataUrl = canvas.toDataURL("image/jpeg", quality);

    pageItems.push({
      id: `page-${i}-${Date.now()}`,
      origIndex: i - 1, // 0-based index for pdf-lib usage
      thumbnail: dataUrl,
    });
  }

  return pageItems;
}
