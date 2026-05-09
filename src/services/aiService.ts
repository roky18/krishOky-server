import { GoogleGenerativeAI } from "@google/generative-ai";

type THttpError = Error & {
  statusCode?: number;
};

const createHttpError = (message: string, statusCode = 500): THttpError => {
  const error: THttpError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const generateResponseFromAI = async (title: string) => {
  if (!title || typeof title !== "string") {
    throw createHttpError("Prompt is required.", 400);
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw createHttpError("GEMINI_API_KEY is missing from environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });

  const customPrompt = `You are an expert agricultural consultant.
  Please write a professional and informative product description for: "${title}".
  Explain the benefits and usage of this product for farmers.

  Important: Detect the language of the input "${title}".
  - If the input is in Bangla, provide the full description in Bangla.
  - If the input is in English, provide the full description in English.
  Always respond in the same language as the input.`;

  try {
    const result = await model.generateContent(customPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);

    if (error instanceof Error) {
      throw createHttpError(`AI response generation failed: ${error.message}`);
    }

    throw createHttpError("AI response generation failed.");
  }
};

export const AiServices = {
  generateResponseFromAI,
};
