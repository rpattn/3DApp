export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { access, constants as FS_CONSTANTS, stat as fsStat } from "fs/promises";
import { createReadStream } from "fs";
import { Readable } from "stream";

// --- Policy ---
const BASE_DIR = path.resolve(process.cwd(), "data"); // only serve from ./data
const MAX_BYTES = 50 * 1024 * 1024; // 50MB safety cap (tune as needed)
const ALLOWED_EXTS = new Set([
  ".json",
  ".txt",
  ".csv",
  ".bin",
  ".gguf",
  ".onnx",
  ".pt",
  ".model",
  ".glb"
]);

const CONTENT_TYPES: Record<string, string> = {
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  // model/binary defaults to octet-stream
};

function isHiddenSegment(relative: string) {
  return relative.split(path.sep).some((seg) => seg.startsWith("."));
}

export async function GET(request: NextRequest) {
  try {
    const resource = request.nextUrl.searchParams.get("url");
    if (!resource) {
      return NextResponse.json({ error: "Missing 'url' query param." }, { status: 400 });
    }

    // Example denylist
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

    // Proceed with resolve+containment checks
    const resolved = path.resolve(BASE_DIR, raw);
    if (!resolved.startsWith(BASE_DIR + path.sep) && resolved !== BASE_DIR) {
    return NextResponse.json({ error: "Path traversal detected." }, { status: 403 });
    }

    const rel = path.relative(BASE_DIR, resolved);
    if (isHiddenSegment(rel)) {
      return NextResponse.json({ error: "Hidden files are not accessible." }, { status: 403 });
    }

    const ext = path.extname(resolved).toLowerCase();
    if (!ALLOWED_EXTS.has(ext)) {
      return NextResponse.json({ error: "File type not permitted." }, { status: 415 });
    }

    await access(resolved, FS_CONSTANTS.R_OK);
    const stats = await fsStat(resolved);
    if (!stats.isFile()) {
      return NextResponse.json({ error: "Not a file." }, { status: 400 });
    }
    if (stats.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large." }, { status: 413 });
    }

    // Basic caching
    const etag = `W/"${stats.size}-${Math.trunc(stats.mtimeMs)}"`;
    const ifNoneMatch = request.headers.get("if-none-match");
    const ifModifiedSince = request.headers.get("if-modified-since");

    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }
    if (ifModifiedSince) {
      const ims = Date.parse(ifModifiedSince);
      if (!Number.isNaN(ims) && stats.mtimeMs <= ims) {
        return new NextResponse(null, { status: 304 });
      }
    }

    // Stream the file (safer for large binaries than readFile)
    const nodeStream = createReadStream(resolved);
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream<Uint8Array>;

    const filename = path.basename(resolved);
    const headers = new Headers({
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Content-Length": String(stats.size),
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `inline; filename="${encodeURIComponent(filename)}"`,
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      ETag: etag,
      "Last-Modified": new Date(stats.mtimeMs).toUTCString(),
    });

    return new NextResponse(webStream, { status: 200, headers });
  } catch (err: any) {
    console.error("File serve error:", err?.message ?? err);
    // Keep responses generic to avoid leaking internals
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
