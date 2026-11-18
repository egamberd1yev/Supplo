import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Backend ishga tushganda /api so'rovlari shu yerga yo'naltiriladi
    proxy: { "/api": "http://localhost:5000" },
  },
});
