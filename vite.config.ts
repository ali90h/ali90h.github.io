import { defineConfig } from "vite";
export default defineConfig({
  root: "src",
  build: { outDir: "../dist", assetsDir: "assets", emptyOutDir: true },
  publicDir: "public"
});
