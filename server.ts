import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// =========================================================================
// CONFIGURATION: Gemini API key dibaca dari environment variable GEMINI_API_KEY
// Jangan hardcode key di sini — set di .env (lokal) atau di dashboard hosting (production)
// =========================================================================
const UNIVERSAL_TEAM_GEMINI_API_KEY = "";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Route for Gemini AI Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, model = "gemini-3.5-flash", customKey } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Prioritas Kunci: 
      // 1. UNIVERSAL_TEAM_GEMINI_API_KEY yang Anda hardcode di atas (jika diisi)
      // 2. Environment variable GEMINI_API_KEY dari server settings
      // 3. Custom key dari input pengaturan client
      const apiKey = UNIVERSAL_TEAM_GEMINI_API_KEY || process.env.GEMINI_API_KEY || customKey;

      if (!apiKey) {
        return res.status(400).json({ 
          error: "API Key is missing. Silakan masukkan GEMINI_API_KEY tim Anda di server.ts baris 9 atau via settings." 
        });
      }

      // Initialize Google GenAI Client with appropriate User-Agent for telemetry
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      res.json({ text: response.text || "" });
    } catch (err: any) {
      console.error("Error generating content via Gemini API:", err);
      res.status(500).json({ 
        error: err.message || "An error occurred while generating content via the AI model." 
      });
    }
  });

  // Serve static assets or mount Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[extinctionIBT®] Gateway server running on port ${PORT}`);
  });
}

startServer();
