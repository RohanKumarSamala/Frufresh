import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.join(__dirname, "..");

// The main site is served straight out of src/. Its own media sits under
// src/assets/, so those arrive as plain /assets/... requests.
const ROOT = path.join(PROJECT, "src");
const PORT = process.env.PORT || 5173;

// The products page used to be a separate Vite app you had to `cd` into and
// run its own `npm run dev` for. It's merged in now: its source lives at
// src/product-page (one dependency tree, one `npm run dev` here), and Vite
// runs in middleware mode inside this same process/port, so editing it
// live-reloads exactly like the vanilla pages do. `npm run build:products`
// still produces a static src/product-page/dist for anyone who wants a
// prebuilt bundle instead, but dev no longer needs it.
const PRODUCT_PAGE = path.join(ROOT, "product-page");
const PRODUCTS_BASE = "/products/";

const MOUNTS = [
  { prefix: "/products-assets", dir: path.join(ROOT, "assets", "product-page") },
];

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

function serveStatic(req, res) {
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
}

// Create the raw server first, with no request listener yet, so it can be
// handed to Vite as the socket to attach its HMR websocket to — otherwise
// Vite would spin up a second listener of its own for that.
const server = http.createServer();

const vite = await createViteServer({
  configFile: path.join(PROJECT, "vite.config.ts"),
  root: PRODUCT_PAGE,
  base: PRODUCTS_BASE,
  server: {
    middlewareMode: true,
    hmr: { server },
  },
  appType: "custom",
});

async function serveProductsIndex(req, res) {
  try {
    const indexPath = path.join(PRODUCT_PAGE, "index.html");
    const raw = fs.readFileSync(indexPath, "utf-8");
    const html = await vite.transformIndexHtml(req.url, raw);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (err) {
    vite.ssrFixStacktrace(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(String(err));
  }
}

server.on("request", (req, res) => {
  const reqPath = decodeURIComponent(req.url.split("?")[0]);

  if (reqPath === "/products" || reqPath === "/products/") {
    serveProductsIndex(req, res);
    return;
  }

  // Vite only intercepts requests under its own base (/products/...) plus
  // its internal /@vite, /@react-refresh, etc. paths — anything else calls
  // next(), which falls through to the plain static file server below.
  vite.middlewares(req, res, () => serveStatic(req, res));
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} at http://localhost:${PORT}`);
  console.log(`Products app (live, via Vite) at http://localhost:${PORT}/products/`);
});
