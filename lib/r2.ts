import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID =
  process.env.R2_ACCOUNT_ID ||
  process.env.CF_ACCOUNT_ID ||
  "";
const R2_ACCESS_KEY_ID =
  process.env.R2_ACCESS_KEY_ID ||
  process.env.CF_ACCESS_KEY_ID ||
  "";
const R2_SECRET_ACCESS_KEY =
  process.env.R2_SECRET_ACCESS_KEY ||
  process.env.CF_SECRET_ACCESS_KEY ||
  "";
const R2_BUCKET_NAME =
  process.env.R2_BUCKET_NAME ||
  process.env.CF_BUCKET_NAME ||
  "island-monkey-media";

let s3ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error(
      "Cloudflare R2 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) are not configured."
    );
  }

  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }

  return s3ClientInstance;
}

/**
 * Returns the full permanent public URL for a given R2 storage key.
 * If already an absolute HTTP/HTTPS URL, returns it unchanged.
 */
export function getR2PublicUrl(keyOrUrl?: string | null): string {
  if (!keyOrUrl) return "";
  if (
    keyOrUrl.startsWith("http://") ||
    keyOrUrl.startsWith("https://") ||
    keyOrUrl.startsWith("blob:") ||
    keyOrUrl.startsWith("data:")
  ) {
    return keyOrUrl;
  }
  const baseUrl = (
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    process.env.CF_PUBLIC_URL ||
    process.env.R2_PUBLIC_URL ||
    ""
  ).replace(/\/+$/, "");

  const cleanKey = keyOrUrl.replace(/^\/+/, "");
  return baseUrl ? `${baseUrl}/${cleanKey}` : `/${cleanKey}`;
}

export type StorageCategory = "models" | "creators" | "professionals" | "gigs";

/**
 * Generates a standard R2 storage key for a profile photo:
 * <category>/<entityId>/profile/<unique-file-name>.<ext>
 * Defaults to 'models' if not specified for backwards compatibility.
 */
export function generateProfileKey(
  entityId: string,
  filename: string,
  category: StorageCategory = "models"
): string {
  const ext = filename.includes(".") ? filename.split(".").pop() : "jpg";
  const cleanExt = (ext || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const baseName = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  return `${category}/${entityId}/profile/${uniqueSuffix}-${baseName}.${cleanExt}`;
}

/**
 * Generates a standard R2 storage key for a portfolio / gallery image:
 * <category>/<entityId>/portfolio/<unique-file-name>.<ext>
 */
export function generatePortfolioKey(
  entityId: string,
  filename: string,
  category: StorageCategory = "models"
): string {
  const ext = filename.includes(".") ? filename.split(".").pop() : "jpg";
  const cleanExt = (ext || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const baseName = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  return `${category}/${entityId}/portfolio/${uniqueSuffix}-${baseName}.${cleanExt}`;
}

/**
 * Generates a standard R2 storage key for a Gig asset:
 * gigs/<modelOrGigId>/<subfolder>/<unique-file-name>.<ext>
 * where subfolder is 'cover' or 'gallery'
 */
export function generateGigKey(
  entityId: string,
  filename: string,
  subfolder: "cover" | "gallery" = "gallery"
): string {
  const ext = filename.includes(".") ? filename.split(".").pop() : "jpg";
  const cleanExt = (ext || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const baseName = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  return `gigs/${entityId}/${subfolder}/${uniqueSuffix}-${baseName}.${cleanExt}`;
}

/**
 * Generates a temporary presigned PUT upload URL for direct browser-to-R2 upload.
 * Valid for 15 minutes.
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 900
): Promise<{ uploadUrl: string; r2Key: string; publicUrl: string }> {
  if (!R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME is not configured.");
  }

  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });
  const publicUrl = getR2PublicUrl(key);

  return {
    uploadUrl,
    r2Key: key,
    publicUrl,
  };
}

/**
 * Deletes an object from Cloudflare R2 given its storage key.
 */
export async function deleteFromR2(key: string): Promise<void> {
  if (!R2_BUCKET_NAME || !key) return;

  if (key.startsWith("http://") || key.startsWith("https://")) return;

  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );
}
