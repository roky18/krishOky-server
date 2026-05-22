import { GoogleGenerativeAI } from "@google/generative-ai";

type THttpError = Error & {
  statusCode?: number;
};

const getErrorStatusCode = (error: unknown): number => {
  const maybeStatus = (error as { status?: unknown })?.status;
  return typeof maybeStatus === "number" ? maybeStatus : 500;
};

// কাস্টম HTTP এরর হ্যান্ডলার
const createHttpError = (message: string, statusCode = 500): THttpError => {
  const error: THttpError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * ১. প্রোডাক্ট ক্রিয়েশনের জন্য দ্বী-ভাষিক ডেসক্রিপশন জেনারেটর (Promise.all)
 */
const generateResponseFromAI = async (
  title: string,
): Promise<{ bn: string; en: string }> => {
  if (!title || typeof title !== "string") {
    throw createHttpError("Product title is required.", 400);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw createHttpError(
      "GEMINI_API_KEY is missing from environment variables.",
      500,
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const promptEN = `You are an expert agricultural consultant. Write a professional, concise, and informative e-commerce product description in English for: "${title}". Explain its benefits and usage for farmers in max 3 sentences. Do not add any extra greeting or markdown titles.`;
  const promptBN = `তুমি একজন অভিজ্ঞ কৃষি বিশেষজ্ঞ। "${title}" এই পণ্যটির জন্য বাংলায় একটি প্রফেশনাল এবং আকর্ষণীয় ই-কমার্স প্রোডাক্ট ডেসক্রিপশন লেখো। কৃষকদের জন্য এর উপকারিতা এবং ব্যবহার পদ্ধতি সর্বোচ্চ ৩ লাইনে ফুটিয়ে তোলো। কোনো অতিরিক্ত শুভেচ্ছা বা মার্কডাউন টাইটেল যোগ করবে না।`;

  try {
    const [resultEN, resultBN] = await Promise.all([
      model.generateContent(promptEN),
      model.generateContent(promptBN),
    ]);

    const responseEN = await resultEN.response;
    const responseBN = await resultBN.response;

    return {
      en: responseEN.text()?.trim() || "",
      bn: responseBN.text()?.trim() || "",
    };
  } catch (error) {
    console.error("AI Error:", error);
    if (error instanceof Error) {
      throw createHttpError(
        `AI response generation failed: ${error.message}`,
        getErrorStatusCode(error),
      );
    }
    throw createHttpError("AI response generation failed.", 500);
  }
};

/**
 * ২. কাস্টমার রিভিউ সামারি করার মেথড
 */
const generateReviewSummary = async (reviews: string[]): Promise<string> => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    throw createHttpError("Reviews array is required.", 400);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw createHttpError("GEMINI_API_KEY is missing.", 500);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });

  const reviewsText = reviews.join("\n- ");
  const prompt = `Analyze and summarize the following customer reviews for this product. Provide a single bulleted list highlighting the key pros and cons in a concise professional manner:\n\n- ${reviewsText}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text()?.trim() || "No summary available.";
  } catch (error) {
    if (error instanceof Error) {
      throw createHttpError(
        `Failed to generate review summary: ${error.message}`,
        getErrorStatusCode(error),
      );
    }
    throw createHttpError("Failed to generate review summary.");
  }
};

/**
 * ৩. কৃষকদের সাহায্য করার জন্য AI Chatbot অ্যাসিস্ট্যান্ট (নতুন যোগ করা হলো)
 */
const getAIChatResponse = async (message: string): Promise<string> => {
  if (!message || typeof message !== "string") {
    throw createHttpError("Message is required for AI chat.", 400);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw createHttpError("GEMINI_API_KEY is missing.", 500);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });

  // চ্যাটবটের জন্য কাস্টম প্রম্পট গাইডলাইনস
  const chatbotPrompt = `You are "KrishOky AI", an expert agricultural assistant. Answer the user's question politely, accurately, and short. Use the exact same language (Bangla or English) that the user used to ask the question. Question: "${message}"`;

  try {
    const result = await model.generateContent(chatbotPrompt);
    const response = await result.response;
    return response.text()?.trim() || "Sorry, I couldn't process that request.";
  } catch (error) {
    console.error("AI Chatbot Error:", error);
    if (error instanceof Error) {
      throw createHttpError(
        `AI Chatbot failed to respond: ${error.message}`,
        getErrorStatusCode(error),
      );
    }
    throw createHttpError("AI Chatbot failed to respond.");
  }
};

export const AiServices = {
  generateResponseFromAI,
  generateReviewSummary,
  getAIChatResponse, // এক্সপোর্ট করা হলো যেন কন্ট্রোলারে ব্যবহার করা যায়
};
