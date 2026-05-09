// src/controllers/itemController.ts

import { AiServices } from "../services/aiService";
import { ItemServices } from "../services/itemService";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createItem = catchAsync(async (req, res) => {
  const { title } = req.body;

  // এআই ডেসক্রিপশন জেনারেট করা
  const aiDescription = await AiServices.generateResponseFromAI(title);

  const itemData = {
    ...req.body,
    description: aiDescription
  };

  const result = await ItemServices.createItemIntoDB(itemData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Item created successfully!",
    data: result,
  });
});

const getAllItems = catchAsync(async (req, res) => {
  const result = await ItemServices.getAllItemsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Items retrieved successfully!",
    data: result,
  });
});

// এই অংশটি খুব ভালো করে দেখো (Plural 's' খেয়াল করো)
export const ItemControllers = {
  createItem,
  getAllItems,
};