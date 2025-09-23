import type { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

function dataUrlToInlineData(dataUrl: string): {
  mimeType: string;
  data: string;
} {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL");
  }
  const mimeType = match[1];
  const data = match[2];
  return { mimeType, data };
}

export const aiDescribe: RequestHandler = async (req, res) => {
  try {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) {
      res.status(501).json({ error: "GOOGLE_API_KEY not configured" });
      return;
    }

    const { imageDataUrl, imageDataUrls, audioDataUrl, hint } = req.body as {
      imageDataUrl?: string;
      imageDataUrls?: string[];
      audioDataUrl?: string;
      hint?: string;
    };

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const parts: any[] = [
      {
        text: "You are helping a citizen report a civic issue to the local council. Based on the provided media, write a concise, clear description (2-3 sentences). Focus on what, where (if visible), severity, and any hazards. Avoid personal data. If audio is provided, extract the key details.",
      },
    ];

    const images: string[] = [];
    if (Array.isArray(imageDataUrls)) images.push(...imageDataUrls);
    if (imageDataUrl) images.push(imageDataUrl);

    for (const img of images) {
      try {
        const inline = dataUrlToInlineData(img);
        parts.push({ inlineData: inline });
      } catch {}
    }
    if (audioDataUrl) {
      try {
        const inline = dataUrlToInlineData(audioDataUrl);
        parts.push({ inlineData: inline });
      } catch {}
    }
    if (hint && typeof hint === "string" && hint.trim()) {
      parts.push({ text: `User notes: ${hint.trim()}` });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });
    const text = result.response.text();

    res.json({ description: text });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "AI error" });
  }
};
