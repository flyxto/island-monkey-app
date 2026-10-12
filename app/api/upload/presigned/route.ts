import { NextRequest, NextResponse } from "next/server";
import {
  getPresignedUploadUrl,
  generateProfileKey,
  generatePortfolioKey,
  StorageCategory,
} from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, contentType, type, modelId: incomingModelId, category = "models" } = body;

    if (!filename || typeof filename !== "string") {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    if (!contentType || typeof contentType !== "string" || !contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "A valid image content-type is required (e.g. image/jpeg, image/png, image/webp)" },
        { status: 400 }
      );
    }

    const validCategory: StorageCategory =
      category === "creators" || category === "professionals" || category === "gigs"
        ? category
        : "models";

    const prefix =
      validCategory === "creators"
        ? "crt"
        : validCategory === "professionals"
        ? "pro"
        : validCategory === "gigs"
        ? "gig"
        : "mdl";

    const entityId =
      incomingModelId && typeof incomingModelId === "string" && incomingModelId.trim()
        ? incomingModelId.trim()
        : `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    // Key format:
    // Profile: <category>/<entityId>/profile/<unique-file-name>.<ext>
    // Portfolio / Gig: <category>/<entityId>/portfolio/<unique-file-name>.<ext>
    const key =
      type === "profile"
        ? generateProfileKey(entityId, filename, validCategory)
        : generatePortfolioKey(entityId, filename, validCategory);

    // Generate temporary PUT upload URL (valid for 15 minutes)
    const { uploadUrl, r2Key, publicUrl } = await getPresignedUploadUrl(
      key,
      contentType,
      900
    );

    return NextResponse.json(
      {
        uploadUrl,
        r2Key,
        publicUrl,
        modelId: entityId,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate presigned upload URL";
    console.error("POST /api/upload/presigned error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
