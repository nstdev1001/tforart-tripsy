import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) return "vendor-firebase";
            if (id.includes("@mantine")) return "vendor-mantine";
            if (id.includes("framer-motion")) return "vendor-framer";
            if (id.includes("lucide-react") || id.includes("@fortawesome"))
              return "vendor-icons";
            if (
              id.includes("react/") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            )
              return "vendor-react";
            return "vendor";
          }
        },
      },
    },
  },
});
