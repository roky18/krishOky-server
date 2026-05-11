import { Request, Response } from "express"; // Express টাইপ ইমপোর্ট
import { AiServices } from "../services/aiService";
import { ItemServices } from "../services/itemService";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { sendImageToCloudinary } from "../utils/sendImageToCloudinary";

// ১. ক্লাউডিনারি রেসপন্সের জন্য টাইপ (any এড়াতে)
interface ICloudinaryResponse {
  secure_url: string;
  [key: string]: unknown;
}

// ২. কাস্টম রিকোয়েস্ট টাইপ (req.file এবং টাইপ করা বডির জন্য)
interface IItemRequest extends Request {
  body: {
    data?: string; // যদি JSON স্ট্রিং হিসেবে আসে
    title: { bn: string; en: string };
    price: number;
    category: string;
    stock: number;
    sellerId: string;
  };
  file?: Express.Multer.File; // Multer ফাইলের টাইপ
}

const createItem = catchAsync(async (req: Request, res: Response) => {
  // টাইপ কাস্টিং করে any এরর দূর করা
  const typedReq = req as IItemRequest;

  // ৩. ডাটা পার্স করা
  const body = typedReq.body.data
    ? JSON.parse(typedReq.body.data)
    : typedReq.body;
  const { title } = body;
  const file = typedReq.file;

  // ৪. ইমেজ হ্যান্ডেল করা
  let imageUrl = "";
  if (file) {
    const path = file.path;
    const imageName = `${title.en}-${Date.now()}`;

    // এখানে any এর বদলে ICloudinaryResponse ব্যবহার করা হয়েছে
    const uploadResult = (await sendImageToCloudinary(
      imageName,
      path,
    )) as ICloudinaryResponse;
    imageUrl = uploadResult.secure_url;
  }

  // ৫. মাল্টি-ল্যাঙ্গুয়েজ এআই ডেসক্রিপশন
  const enDescPromise = AiServices.generateResponseFromAI(
    `Generate a short professional product description in English for: ${title.en}`,
  );
  const bnDescPromise = AiServices.generateResponseFromAI(
    `এই পণ্যটির জন্য একটি ছোট প্রফেশনাল বিবরণ বাংলায় তৈরি করুন: ${title.bn}`,
  );

  const [enDescription, bnDescription] = await Promise.all([
    enDescPromise,
    bnDescPromise,
  ]);

  // ৬. ফাইনাল ডাটা অবজেক্ট
  const itemData = {
    ...body,
    description: {
      en: enDescription,
      bn: bnDescription,
    },
    image: imageUrl,
  };

  const result = await ItemServices.createItemIntoDB(itemData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Item created with Image & Multilingual AI description!",
    data: result,
  });
});

const getAllItems = catchAsync(async (req: Request, res: Response) => {
  // req.query এর টাইপ নেক্সট লেভেলে হ্যান্ডেল করা আছে সার্ভিসে
  const result = await ItemServices.getAllItemsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Items retrieved successfully!",
    data: result,
  });
});

export const ItemControllers = {
  createItem,
  getAllItems,
};
