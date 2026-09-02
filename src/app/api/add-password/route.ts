import { NextRequest, NextResponse } from "next/server";
import { encryptPDF } from "@pdfsmaller/pdf-encrypt";

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

    // Run purely in-memory Web Crypto AES-256
    const encryptedBytes = await encryptPDF(uint8Array, password);

    // Return the bytes directly
    return new NextResponse(encryptedBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="encrypted-${file.name}"`,
      },
    });
  } catch (error: any) {
    console.error("[Add Password API Error]", error.message);
    return NextResponse.json(
      { error: "Failed to encrypt the PDF. The file may be corrupt." },
      { status: 500 }
    );
  }
}
