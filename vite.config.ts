import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Config for the products React app. It used to live at src/products/ as its
// own npm project with its own `vite --port=3000` dev server — merged in here
// so the one `npm run dev` at the project root covers both pages. server/index.js
// runs this same config in Vite's middleware mode, mounted at /products/.
export default defineConfig({
  root: "src/product-page",
  base: "/products/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
