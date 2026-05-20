// import { Request, Response } from "express"; // Express টাইপ ইমপোর্ট
// import { AiServices } from "../services/aiService";
// import { ItemServices } from "../services/itemService";
// import catchAsync from "../utils/catchAsync";
// import sendResponse from "../utils/sendResponse";
// import { sendImageToCloudinary } from "../utils/sendImageToCloudinary";

// // ১. ক্লাউডিনারি রেসপন্সের জন্য টাইপ (any এড়াতে)
// interface ICloudinaryResponse {
//   secure_url: string;
//   [key: string]: unknown;
// }

// // ২. কাস্টম রিকোয়েস্ট টাইপ (req.file এবং টাইপ করা বডির জন্য)
// interface IItemRequest extends Request {
//   body: {
//     data?: string; // যদি JSON স্ট্রিং হিসেবে আসে
//     title: { bn: string; en: string };
//     price: number;
//     category: string;
//     stock: number;
//     sellerId: string;
//   };
//   file?: Express.Multer.File; // Multer ফাইলের টাইপ
// }

// const createItem = catchAsync(async (req: Request, res: Response) => {
//   // টাইপ কাস্টিং করে any এরর দূর করা
//   const typedReq = req as IItemRequest;

//   // ৩. ডাটা পার্স করা
//   const body = typedReq.body.data
//     ? JSON.parse(typedReq.body.data)
//     : typedReq.body;
//   const { title } = body;
//   const file = typedReq.file;

//   // ৪. ইমেজ হ্যান্ডেল করা
//   let imageUrl = "";
//   if (file) {
//     const path = file.path;
//     const imageName = `${title.en}-${Date.now()}`;

//     // এখানে any এর বদলে ICloudinaryResponse ব্যবহার করা হয়েছে
//     const uploadResult = (await sendImageToCloudinary(
//       imageName,
//       path,
//     )) as ICloudinaryResponse;
//     imageUrl = uploadResult.secure_url;
//   }

//   // ৫. মাল্টি-ল্যাঙ্গুয়েজ এআই ডেসক্রিপশন
//   const enDescPromise = AiServices.generateResponseFromAI(
//     `Generate a short professional product description in English for: ${title.en}`,
//   );
//   const bnDescPromise = AiServices.generateResponseFromAI(
//     `এই পণ্যটির জন্য একটি ছোট প্রফেশনাল বিবরণ বাংলায় তৈরি করুন: ${title.bn}`,
//   );

//   const [enDescription, bnDescription] = await Promise.all([
//     enDescPromise,
//     bnDescPromise,
//   ]);

//   // ৬. ফাইনাল ডাটা অবজেক্ট
//   const itemData = {
//     ...body,
//     title: {
//       bn: body.titleBn || body.title?.bn || body.title,
//       en: body.titleEn || body.title?.en || body.title,
//     },
//     description: {
//       en: enDescription,
//       bn: bnDescription,
//     },
//     image: imageUrl,
//   };

//   const result = await ItemServices.createItemIntoDB(itemData);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Item created with Image & Multilingual AI description!",
//     data: result,
//   });
// });

// const getAllItems = catchAsync(async (req: Request, res: Response) => {
//   // req.query এর টাইপ নেক্সট লেভেলে হ্যান্ডেল করা আছে সার্ভিসে
//   const result = await ItemServices.getAllItemsFromDB(req.query);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Items retrieved successfully!",
//     data: result,
//   });
// });

// const getSingleItem = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await ItemServices.getSingleItemFromDB(id as string);

//   // যদি ডাটা না পাওয়া যায়, তবে ৪MD৪ এরর রিটার্ন করবে
//   if (!result) {
//     return res.status(404).json({
//       success: false,
//       message: "দুঃখিত, এই পণ্যটি ডাটাবেসে খুঁজে পাওয়া যায়নি!",
//     });
//   }

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Item retrieved successfully!",
//     data: result,
//   });
// });

// export const ItemControllers = {
//   createItem,
//   getAllItems,
//   getSingleItem,
// };


import { Request, Response } from "express"; // Express টাইপ ইমপোর্ট
import { AiServices } from "../services/aiService";
import { ItemServices } from "../services/itemService";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { sendImageToCloudinary } from "../utils/sendImageToCloudinary";

// ১. ক্লাউডিনারি রেসপন্সের জন্য টাইপ (any এড়াতে)
interface ICloudinaryResponse {
  secure_url: string;
  [key: string]: unknown;
}

// ২. কাস্টম রিকোয়েস্ট টাইপ (req.file এবং টাইপ করা বডির জন্য)
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

/**
 * ১. ইমেজ আপলোড ও মাল্টি-ল্যাঙ্গুয়েজ এআই বিবরণসহ প্রোডাক্ট তৈরি (createItem)
 */
const createItem = catchAsync(async (req: Request, res: Response) => {
  // টাইপ কাস্টিং করে any এরর দূর করা
  const typedReq = req as IItemRequest;

  // ৩. ডাটা পার্স করা
  const body = typedReq.body.data
    ? JSON.parse(typedReq.body.data)
    : typedReq.body;
  
  const file = typedReq.file;

  // ৪. প্রোডাক্ট টাইটেল অবজেক্ট ফরমেট ঠিক করা
  const finalTitle = {
    bn: body.title?.bn || body.titleBn || (typeof body.title === "string" ? body.title : ""),
    en: body.title?.en || body.titleEn || (typeof body.title === "string" ? body.title : ""),
  };

  // ৫. ইমেজ হ্যান্ডেল করা
  let imageUrl = "";
  if (file) {
    const path = file.path;
    // ইমেজ নামের জন্য টাইটেল অবজেক্ট থেকে সেফটি হ্যান্ডলিং
    const titleForName = finalTitle.en || "product";
    const imageName = `${titleForName.replace(/\s+/g, "-")}-${Date.now()}`;

    const uploadResult = (await sendImageToCloudinary(
      imageName,
      path,
    )) as ICloudinaryResponse;
    imageUrl = uploadResult.secure_url;
  }

  // ৬. রিফ্যাক্টর্ড এআই সার্ভিস কল (সরাসরি টাইটেল পাস করে Promise.all এর সুবিধা নেওয়া)
  // এটি এক কলেই { bn: "...", en: "..." } অবজেক্ট রিটার্ন করবে যা ফাস্টার পারফরম্যান্স দেয়
  const aiDescriptions = await AiServices.generateResponseFromAI(finalTitle.en || finalTitle.bn);

  // ৭. ফাইনাল ডাটা অবজেক্ট তৈরি
  const itemData = {
    ...body,
    title: finalTitle,
    description: {
      en: aiDescriptions.en,
      bn: aiDescriptions.bn,
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

/**
 * ২. অ্যাডভান্সড সার্চ, ফিল্টারিং, সর্টিং এবং পেজিনেশনসহ প্রোডাক্ট খোঁজা (getAllItems)
 */
const getAllItems = catchAsync(async (req: Request, res: Response) => {
  const { search, category, priceMin, priceMax, sort, page = 1, limit = 10 } = req.query;

  // ডাইনামিক মঙ্গোডিবি কুয়েরি অবজেক্ট
  const query: any = {};

  // দ্বি-ভাষিক (Bilingual) সার্চ ফিল্টার
  if (search) {
    query.$or = [
      { "title.en": { $regex: search, $options: "i" } },
      { "title.bn": { $regex: search, $options: "i" } },
      { "description.en": { $regex: search, $options: "i" } },
      { "description.bn": { $regex: search, $options: "i" } },
    ];
  }

  // ক্যাটাগরি ফিল্টার
  if (category) {
    query.category = category;
  }

  // প্রাইস রেঞ্জ ফিল্টার
  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
  }

  // সর্টিং নির্ধারণ
  let sortOptions: any = { createdAt: -1 }; // ডিফল্ট: নতুন প্রোডাক্ট আগে আসবে
  if (sort) {
    if (sort === "priceLowHigh") sortOptions = { price: 1 };
    if (sort === "priceHighLow") sortOptions = { price: -1 };
  }

  // পেজিনেশন ম্যাথ ক্যালকুলেশন
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // ডাটাবেস অপারেশন (সার্ভিস লেয়ারের মাধ্যমে)
  const items = await ItemServices.getAllItemsFromDB(
    req.query,
    sortOptions,
    skip,
    limitNumber,
  );
  const totalItems = await ItemServices.countItemsCount(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Items retrieved successfully!",
    data: {
      items,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total: totalItems,
        totalPage: Math.ceil(totalItems / limitNumber),
      },
    },
  });
});

/**
 * ৩. সিঙ্গেল প্রোডাক্ট খোঁজা (getSingleItem)
 */
const getSingleItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ItemServices.getSingleItemFromDB(id as string);

  // যদি ডাটা না পাওয়া যায়, তবে ৪MD৪ (404) এরর রিটার্ন করবে
  if (!result) {
    return res.status(404).json({
      success: false,
      message: "দুঃখিত, এই পণ্যটি ডাটাবেসে খুঁজে পাওয়া যায়নি!",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item retrieved successfully!",
    data: result,
  });
});

export const ItemControllers = {
  createItem,
  getAllItems,
  getSingleItem,
};
