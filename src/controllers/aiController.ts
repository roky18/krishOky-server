// import catchAsync from "../utils/catchAsync";
// import sendResponse from "../utils/sendResponse";
// import { AiServices } from "../services/aiService";

// const getChatResponse = catchAsync(async (req, res) => {
//   const { prompt } = req.body;
//   const result = await AiServices.generateResponseFromAI(prompt);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "AI responded successfully!",
//     data: result,
//   });
// });

// export const AiControllers = {
//   getChatResponse,
// };

import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { AiServices } from "../services/aiService";

/**
 * ১. প্রোডাক্ট ক্রিয়েশনের সময় একসাথে বাংলা ও ইংলিশ ডেসক্রিপশন জেনারেশন
 * Route: POST /api/ai/generate-description
 */
const generateBilingualDescription = catchAsync(
  async (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Product title is required for generating description",
        data: null,
      });
    }

    const result = await AiServices.generateResponseFromAI(title);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bilingual AI description generated successfully!",
      data: result, // ডাটাবেসে সেভ করার জন্য { bn, en } অবজেক্ট রিটার্ন করবে
    });
  },
);

/**
 * ২. কাস্টমার রিভিউ সামারি জেনারেশন
 * Route: POST /api/ai/review-summary
 */
const getReviewSummary = catchAsync(async (req: Request, res: Response) => {
  const { reviews } = req.body; // রিকোয়েস্টে রিভিউগুলোর একটি Array ['good', 'bad'] আশা করা হচ্ছে

  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Reviews array is required and cannot be empty",
      data: null,
    });
  }

  const summary = await AiServices.generateReviewSummary(reviews);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "AI Review summary generated successfully!",
    data: { summary },
  });
});

/**
 * ৩. কৃষকদের জন্য AI Chatbot অ্যাসিস্ট্যান্ট
 * Route: POST /api/ai/chat
 */
const getChatResponse = catchAsync(async (req: Request, res: Response) => {
  const { prompt } = req.body; // আপনার আগের ফ্রন্টএন্ড বা ইনপুটের 'prompt' কী-টি বজায় রাখা হলো

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required for AI chat",
    });
  }

  const reply = await AiServices.getAIChatResponse(prompt.trim());

  res.json({ data: { reply } });
});

export const AiControllers = {
  generateBilingualDescription,
  getReviewSummary,
  getChatResponse,
};
