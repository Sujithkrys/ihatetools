export async function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export interface ImageExportOptions {
  mimeType: string;
  quality?: number; // 0 to 1
  fillWhiteBackground?: boolean;
}

export async function processImage(
  img: HTMLImageElement,
  width: number,
  height: number,
  options: ImageExportOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return reject(new Error("Failed to get canvas 2d context"));
    }

    if (options.fillWhiteBackground && options.mimeType === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to export canvas to Blob"));
        }
      },
      options.mimeType,
      options.quality
    );
  });
}
