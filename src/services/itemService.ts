// import { Item } from "../models/itemModel";

// const createItemIntoDB = async (payload: any) => {
//   const result = await Item.create(payload);
//   return result;
// };

// const getAllItemsFromDB = async () => {
//   const result = await Item.find().populate("sellerId");
//   return result;
// };

// export const ItemServices = {
//   createItemIntoDB,
//   getAllItemsFromDB,
// };

import { Item } from "../models/itemModel";

// ১. আইটেম তৈরি করার সার্ভিস
const createItemIntoDB = async (payload: any) => {
  const result = await Item.create(payload);
  return result;
};

// ২. সব আইটেম গেট করার সার্ভিস (ফিল্টার, সার্চ এবং সর্টিং সহ)
const getAllItemsFromDB = async (query: Record<string, unknown>) => {
  const { searchTerm, category, minPrice, maxPrice, sort } = query;

  let filter: any = {};

  // ১. সার্চ লজিক: নাম দিয়ে খোঁজা (বাংলা ও ইংলিশ দুইটাই চেক করবে)
  if (searchTerm) {
    filter.$or = [
      { "title.en": { $regex: searchTerm, $options: "i" } },
      { "title.bn": { $regex: searchTerm, $options: "i" } },
    ];
  }

  // ২. ক্যাটাগরি ফিল্টার
  if (category) {
    filter.category = category;
  }

  // ৩. প্রাইস রেঞ্জ ফিল্টার (কম দাম থেকে বেশি দাম)
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice); // এর থেকে বেশি
    if (maxPrice) filter.price.$lte = Number(maxPrice); // এর থেকে কম
  }

  // ৪. সর্টিং (যেমন: কম দাম আগে বা নতুন পণ্য আগে)
  let sortStr = "-createdAt"; // ডিফল্টভাবে নতুন পণ্য আগে দেখাবে
  if (sort) {
    sortStr = sort as string; // সর্টিং প্যারামিটার (যেমন: price বা -price)
  }

  // populate("sellerId") যোগ করেছি যাতে বিক্রেতার তথ্যও সাথে পাওয়া যায়
  const result = await Item.find(filter).sort(sortStr).populate("sellerId");
  return result;
};

const getSingleItemFromDB = async (id: string) => {
  const result = await Item.findById(id).populate("sellerId");
  return result;
};

export const ItemServices = {
  createItemIntoDB,
  getAllItemsFromDB,
  getSingleItemFromDB,
};
