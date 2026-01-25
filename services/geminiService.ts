
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiProfileResponse } from "../types";

export const analyzeProfile = async (base64Image: string): Promise<GeminiProfileResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return {
      name: "Elite Talent",
      country: "International",
      about:
        "A versatile and compelling presence in the modern fashion landscape, known for a unique aesthetic and effortless poise.",
      category: "Editorial"
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const prompt = `Act as a senior fashion editor. Analyze this portrait for a "Top 40 Rankings" website.
  Provide:
  1. "name": A unique professional stage name.
  2. "country": The model's country of origin (choose one that fits the aesthetic).
  3. "about": A 3-sentence high-fashion editorial biography (the "About her" section).
  4. "category": A primary fashion category (e.g., Haute Couture, Commercial, Swimwear).
  
  Return strictly as valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(",")[1] || base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            country: { type: Type.STRING },
            about: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["name", "country", "about", "category"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as GeminiProfileResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      name: "Elite Talent",
      country: "International",
      about: "A versatile and compelling presence in the modern fashion landscape, known for a unique aesthetic and effortless poise.",
      category: "Editorial"
    };
  }
};
