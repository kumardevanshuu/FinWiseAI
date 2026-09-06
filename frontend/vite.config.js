import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/summary": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/recommendations": {        
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
