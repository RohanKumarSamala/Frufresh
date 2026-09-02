import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.join(__dirname, "..");

// The main site is served straight out of src/. Its own media sits under
// src/assets/, so those arrive as plain /assets/... requests.
const ROOT = path.join(PROJECT, "src");
const PORT = process.env.PORT || 5173;

// The products page is a separate Vite app living inside the main one at
// src/products. Build it with:
//   cd src/products && npx vite build --base=/products/
//
// Its bundle is mounted at /products/. Its media is referenced from the
// source as absolute paths built at runtime, which Vite's `base` does not
// rewrite — so it gets its own /products-assets/ namespace, kept clear of
// the main site's /assets/ (which falls through to src/assets).
const PRODUCTS_APP = path.join(ROOT, "products");
const MOUNTS = [
  { prefix: "/products-assets", dir: path.join(PRODUCTS_APP, "assets") },
  { prefix: "/products", dir: path.join(PRODUCTS_APP, "dist") },
];

// The products sequences are served straight from assets/images/frames/.
// There used to be a swap here that handed back compressed JPEGs from a
// frames-optimised/ folder; that folder is gone and the originals are
// served as they are, so the swap (and its existsSync on every single
// frame request) has gone with it.

function resolveFile(reqPath) {
  for (const mount of MOUNTS) {
    if (reqPath === mount.prefix || reqPath.startsWith(mount.prefix + "/")) {
      let rest = reqPath.slice(mount.prefix.length);
      if (rest === "" || rest === "/") rest = "/index.html";

      const full = path.normalize(path.join(mount.dir, rest));
      return full.startsWith(mount.dir) ? full : null;
    }
  }

  const full = path.normalize(
    path.join(ROOT, reqPath === "/" ? "/index.html" : reqPath)
  );
  return full.startsWith(ROOT) ? full : null;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
};

const server = http.createServer((req, res) => {
  const reqPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = resolveFile(reqPath);

  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found: " + reqPath);
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME[ext] || "application/octet-stream";
    const range = req.headers.range;

    // Media needs byte-range replies. Safari in particular refuses to
    // play a video the server answers with a plain 200, and looping
    // seeks back to the start via a Range request too.
    if (range) {
      const match = /bytes=(\d*)-(\d*)/.exec(range);
      const start = match && match[1] ? parseInt(match[1], 10) : 0;
      const end = match && match[2] ? parseInt(match[2], 10) : stat.size - 1;

      if (start >= stat.size || end >= stat.size || start > end) {
        res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        res.end();
        return;
      }

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": contentType,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      "Content-Length": stat.size,
      "Accept-Ranges": "bytes",
      "Content-Type": contentType,
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} at http://localhost:${PORT}`);
});
