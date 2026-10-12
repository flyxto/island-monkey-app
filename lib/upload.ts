"use client";

import { getR2PublicUrl } from "./r2";

export interface DirectUploadResult {
  r2Key: string;
  publicUrl: string;
  modelId: string;
}

export interface DirectUploadOptions {
  type: "profile" | "portfolio";
  modelId?: string;
  category?: "models" | "creators" | "professionals" | "gigs";
  onProgress?: (percent: number) => void;
}

/**
 * Uploads a file directly from the browser to Cloudflare R2 using a temporary presigned PUT URL.
 * Bypasses intermediate server limits by streaming directly to Cloudflare storage.
 */
export async function uploadDirectToR2(
  file: File,
  options: DirectUploadOptions
): Promise<DirectUploadResult> {
  // 1. Request presigned upload URL from Next.js API
  const presignedRes = await fetch("/api/upload/presigned", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "image/jpeg",
      type: options.type,
      modelId: options.modelId,
      category: options.category || "models",
    }),
  });

  if (!presignedRes.ok) {
    const errorData = await presignedRes.json().catch(() => ({}));
    throw new Error(
      errorData.error || "Failed to obtain upload authorization for storage"
    );
  }

  const { uploadUrl, r2Key, publicUrl, modelId } = await presignedRes.json();

  if (!uploadUrl || !r2Key) {
    throw new Error("Invalid presigned URL response from upload service");
  }

  // 2. Stream file directly from the browser to Cloudflare R2 via XMLHttpRequest with progress tracking
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", file.type || "image/jpeg");

    if (xhr.upload && options.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(
            100,
            Math.max(0, Math.round((event.loaded / event.total) * 100))
          );
          options.onProgress?.(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        options.onProgress?.(100);
        resolve();
      } else {
        reject(
          new Error(
            `Image upload failed with status ${xhr.status}. Make sure CORS allows PUT on Cloudflare R2.`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Network error during image upload. Check internet connection and R2 CORS configuration."
        )
      );
    };

    xhr.onabort = () => {
      reject(new Error("Upload aborted by client."));
    };

    xhr.send(file);
  });

  return {
    r2Key,
    publicUrl: publicUrl || getR2PublicUrl(r2Key),
    modelId,
  };
}
