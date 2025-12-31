import { GoogleGenAI } from "@google/genai";
import { ChatType } from "../domain/types";
import logger from "../utils/logger";
import { settings } from "../config/env";

const ai = new GoogleGenAI({ apiKey: settings.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are a calm and helpful e-commerce support agent.

Store Policy:
- Shipping: worldwide except Antarctica
- Delivery: 5-7 business days
- Returns: 30-day refund window
- Support: 9AM–6PM IST, Mon–Sat

Always be concise, friendly, and factual.
`;

export const LLMServices = {
  streamReply: async (
    userMessage: string,
    history: ChatType[],
    onToken: (chunk: any) => void
  ) => {
    console.log("Ai service");
    const contents = history
      .filter((m) => m.text?.trim())
      .map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    try {
      const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: contents,
      });
      let finalReply = "";
      for await (let chunk of stream) {
        console.log("Ai service", stream);
        let token = chunk?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        console.log("Ai service token", token);
        if (!token) continue;
        onToken(token);
        finalReply += token;
      }
      console.log("✅final Reply")
      return finalReply;
    } catch (error) {
      logger.error("[LLM]-stream:streaming failed");
      console.log(error);
      return `data:${JSON.stringify({ event: "error" })}\n\n`;
    }
  },
};
