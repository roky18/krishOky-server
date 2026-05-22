import { Request, Response } from "express";
import { OrderServices } from "../services/orderService";
import { Item } from "../models/itemModel";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

// ১. নতুন অর্ডার তৈরি ও স্টক আপডেট
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const { items } = orderData;

  // প্রতিটি পণ্যের স্টক চেক ও আপডেট করা
  for (const item of items) {
    const product = await Item.findById(item.productId);
    if (!product || product.stock < item.quantity) {
      return res
        .status(400)
        .json({ success: false, message: "দুঃখিত, পর্যাপ্ত পণ্য স্টকে নেই!" });
    }
    // স্টক কমিয়ে দেওয়া
    await Item.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  const result = await OrderServices.createOrderIntoDB(orderData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "অর্ডার সফলভাবে সম্পন্ন হয়েছে!",
    data: result,
  });
});

// ২. ইউজারের অর্ডার লিস্ট দেখা
const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const result = await OrderServices.getMyOrdersFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "আপনার অর্ডারসমূহ সফলভাবে পাওয়া গেছে!",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getMyOrders,
};
