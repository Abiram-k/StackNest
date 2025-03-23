import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "window",
    process: {
      env: {}, // Shim process.env
      nextTick: (fn: any, ...args: any) => setTimeout(() => fn(...args), 0), // Shim process.nextTick
    },
  },
  resolve: {
    alias: {
      util: "util/",
      "@": path.resolve(__dirname, "./src"),
      events: "eventemitter3",
    },
  },
});
