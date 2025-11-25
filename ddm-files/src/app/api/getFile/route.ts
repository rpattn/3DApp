export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { constants as FS_CONSTANTS } from "fs";
import { Readable } from "stream";

// Configure a safe base and policy
const BASE_DIR = path.resolve(process.cwd(), "data");
const MAX_BYTES = 20 * 1024 * 1024; // 20MB cap (tune as needed)
const ALLOWED_EXTS = new Set([".json", ".txt", ".csv", ".glb", ".html"]); // whitelist

const CONTENT_TYPES: Record<string, string> = {
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
};

function isHiddenSegment(p: string) {
  // Prevent access to dotfiles / dot-directories
  return p.split(path.sep).some((seg) => seg.startsWith("."));
}

export async function GET(request: NextRequest) {
  try {
    const resource = request.nextUrl.searchParams.get("url");

    if (!resource) {
      return NextResponse.json({ error: "Missing 'url' query param." }, { status: 400 });
    }

    // Explicit denylist example
    if (resource === "/users.json") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const raw0 = (resource ?? "").replace(/\0/g, "").trim().replace(/\\/g, "/");
    
    // Block absolute URLs, but allow a single-site absolute path like "/demo/data.json"
    if (raw0.startsWith("http://") || raw0.startsWith("https://") || raw0.startsWith("//")) {
    return NextResponse.json({ error: "Only relative paths are allowed." }, { status: 400 });
    }

    // Collapse "." prefixes
    const raw = raw0.replace(/^(\.\/)+/, "");

    // Resolve against BASE_DIR and verify containment to block traversal
    const resolved = path.resolve(BASE_DIR, raw);

    if (!resolved.startsWith(BASE_DIR + path.sep) && resolved !== BASE_DIR) {
      return NextResponse.json({ error: "Path traversal detected." }, { status: 403 });
    }

    if (isHiddenSegment(path.relative(BASE_DIR, resolved))) {
      return NextResponse.json({ error: "Hidden files are not accessible." }, { status: 403 });
    }

    const ext = path.extname(resolved).toLowerCase();
    if (!ALLOWED_EXTS.has(ext)) {
      return NextResponse.json({ error: "File type not permitted." }, { status: 415 });
    }

    // Ensure the path exists and is a regular file
    await fs.access(resolved, FS_CONSTANTS.R_OK);
    const stat = await fs.stat(resolved);
    if (!stat.isFile()) {
      return NextResponse.json({ error: "Not a file." }, { status: 400 });
    }

    if (stat.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large." }, { status: 413 });
    }

    // Read the file (text formats; if you add binaries, stream or omit utf-8)
    const data = await fs.readFile(resolved);

    const webStream = Readable.toWeb(Readable.from(data)) as ReadableStream<Uint8Array>;
    return new Response(webStream, {
    headers: { "Content-Type": "application/octet-stream" },
    });

  } catch (err: any) {
    // Avoid leaking paths/details in prod logs; keep response generic
    console.error("File fetch error:", err?.message ?? err);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
