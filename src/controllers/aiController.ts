import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { AiServices } from "../services/aiService";

const getChatResponse = catchAsync(async (req, res) => {
  const { prompt } = req.body;
  const result = await AiServices.generateResponseFromAI(prompt);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "AI responded successfully!",
    data: result,
  });
});

export const AiControllers = {
  getChatResponse,
};
