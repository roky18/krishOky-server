import { AiServices } from "../services/aiService";
import { ItemServices } from "../services/itemService";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { sendImageToCloudinary } from "../utils/sendImageToCloudinary"; // ইম্পোর্ট করো

const createItem = catchAsync(async (req, res) => {
  const { title } = req.body;

  const file = (req as any).file;

  // ১. ইমেজ হ্যান্ডেল করা
  let imageUrl = "";
  if (file) {
    const path = file.path; // ইমেজ যেখানে জমা আছে
    const imageName = `${title}-${Date.now()}`;

    // ক্লাউডিনারিতে পাঠানো
    const uploadResult: any = await sendImageToCloudinary(imageName, path);
    imageUrl = uploadResult.secure_url; // আপলোড করা ছবির অনলাইন লিঙ্ক
  }

  // ২. এআই ডেসক্রিপশন জেনারেট করা
  const aiDescription = await AiServices.generateResponseFromAI(title);

  // ৩. ডেসক্রিপশন এবং ইমেজের লিঙ্কসহ ডাটা তৈরি
  const itemData = {
    ...req.body,
    description: aiDescription,
    image: imageUrl, // ডাটাবেজে ইমেজের লিঙ্ক চলে যাবে
  };

  const result = await ItemServices.createItemIntoDB(itemData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Item created with Image & AI description!",
    data: result,
  });
});

const getAllItems = catchAsync(async (req, res) => {
  // req.query পাস করে দাও, যাতে সার্চ এবং ফিল্টারিং কাজ করে
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
