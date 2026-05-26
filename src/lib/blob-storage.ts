import { put } from "@vercel/blob";

function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.checktarga_READ_WRITE_TOKEN;
}

export async function storePdfReport(
  pdfBuffer: Buffer,
  orderId: string,
  metadata: {
    customerEmail: string;
    searchType: string;
    searchValue: string;
    vehicleBrand?: string;
  }
): Promise<{ url: string; storagePath: string } | null> {
  try {
    const today = new Date();
    const datePath = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const blobPath = `vehicle-reports/${datePath}/report-${orderId}.pdf`;

    const token = getBlobToken();
    if (!token) {
      console.error("[Vercel Blob] BLOB_READ_WRITE_TOKEN mancante");
      return null;
    }

    const result = await put(blobPath, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
      allowOverwrite: true,
      token,
      addRandomSuffix: false,
    });

    console.log(`[Vercel Blob] PDF salvato: ${result.url}`, metadata.searchValue);

    return {
      url: result.url,
      storagePath: `vercel_blob:${blobPath}`,
    };
  } catch (error) {
    console.error("[Vercel Blob] Errore storage PDF:", error);
    return null;
  }
}

export function resolveBlobDownloadUrl(storagePath: string, orderId: string): string {
  if (storagePath.startsWith("vercel_blob:")) {
    const blobPath = storagePath.replace("vercel_blob:", "");
    return `https://blob.vercel-storage.com/${blobPath}?download=report-${orderId}.pdf`;
  }
  return storagePath;
}
