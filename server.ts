import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API route for gemini
  app.post("/api/gemini/generate", async (req: any, res: any) => {
    try {
      const { modelName } = req.body;
      if (!modelName) {
        return res.status(400).json({ error: "modelName is required" });
      }

      const prompt = `请为一款名为“${modelName}”的中国羊纹货泉或钱币遗产，撰写一段非常简短、博学且带有古蜀神话流变色彩的诗意解说词。字数限制在90字以内，语言要高级、留白、有灵性。不需要多余前缀，直接输出正文。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          systemInstruction: "你是一位精通华夏及古蜀美学的高级博物馆策展AI。说话极简、富有深意和神秘力量。"
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
