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


// src/services/itemService.ts
import { Item } from "../models/itemModel";

const getAllItemsFromDB = async (query: Record<string, unknown>) => {
  const { searchTerm, category, minPrice, maxPrice, sort } = query;

  let filter: any = {};

  // ১. সার্চ লজিক (নাম দিয়ে খোঁজা)
  if (searchTerm) {
    filter.title = { $regex: searchTerm, $options: "i" }; // 'i' মানে ছোট-বড় হাতের অক্ষরের পার্থক্য করবে না
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

  const result = await Item.find(filter).sort(sortStr);
  return result;
};

// ItemServices অবজেক্টে এটি আপডেট করে দাও
export const ItemServices = {
  createItemIntoDB: async (payload: any) => await Item.create(payload),
  getAllItemsFromDB,
};