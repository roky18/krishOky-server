import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync"; // আপনার প্রজেক্টের ইউটিলিটি
import sendResponse from "../utils/sendResponse"; // আপনার প্রজেক্টের ইউটিলিটি
import { AiServices } from "../services/aiService";

// ১. কৃষকদের জন্য AI Chatbot অ্যাসিস্ট্যান্ট
const getChatResponse = catchAsync(async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    // এরর এর ক্ষেত্রে স্ট্যান্ডার্ড ফরম্যাট ব্যবহার করা ভালো
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Message is required for AI chat.",
      data: null,
    });
  }

  const response = await AiServices.getAIChatResponse(message);

  // চ্যাটবটের সাকসেস রেসপন্স: জাস্ট { data: { reply } }
  res.status(200).json({
    data: {
      reply: response,
    },
  });
});

// ২. প্রোডাক্ট ডেসক্রিপশন জেনারেশন
const generateBilingualDescription = catchAsync(
  async (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Product title is required.",
        data: null,
      });
    }

    const result = await AiServices.generateResponseFromAI(title);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bilingual AI description generated successfully!",
      data: result,
    });
  },
);

// ৩. রিভিউ সামারি জেনারেশন
const getReviewSummary = catchAsync(async (req: Request, res: Response) => {
  const { reviews } = req.body;

  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Reviews array is required.",
      data: null,
    });
  }

  const summary = await AiServices.generateReviewSummary(reviews);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "AI Review summary generated successfully!",
    data: summary,
  });
});

export const AiControllers = {
  getChatResponse,
  generateBilingualDescription,
  getReviewSummary,
};
