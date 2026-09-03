import { NextRequest, NextResponse } from "next/server";
import { decryptPDF } from "@pdfsmaller/pdf-decrypt";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const password = formData.get("password") as string | null;

    if (!file || !password) {
      return NextResponse.json(
        { error: "File and password are required" },
        { status: 400 }
      );
    }

    if (file.size > 4.2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds the 4MB limit" },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    try {
      const decryptedBytes = await decryptPDF(uint8Array, password);

      return new NextResponse(decryptedBytes as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="unlocked-${file.name}"`,
        },
      });
    } catch (decryptError: unknown) {
      if (decryptError instanceof Error) {
        if (decryptError.message?.includes("Incorrect password")) {
          return NextResponse.json(
            { error: "Incorrect password" },
            { status: 401 }
          );
        }
        if (decryptError.message?.includes("not encrypted")) {
          return NextResponse.json(
            { error: "This PDF is not encrypted." },
            { status: 400 }
          );
        }
      }
      throw decryptError; // Let outer catch handle generic errors
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[Remove Password API Error]", error.message);
    } else {
      console.error("[Remove Password API Error]", error);
    }
    return NextResponse.json(
      { error: "Failed to unlock the PDF. The file may be corrupt or unsupported." },
      { status: 500 }
    );
  }
}
