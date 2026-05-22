import { Order } from "../models/orderModel";
import { Item } from "../models/itemModel";

// ১. নতুন অর্ডার তৈরি করা
const createOrderIntoDB = async (payload: any) => {
  // অর্ডার প্লেস করার সাথে সাথে পণ্যের স্টক আপডেট করার জন্য এখানে লজিক থাকতে পারে
  const result = await Order.create(payload);
  return result;
};

// ২. ইউজারের নিজের অর্ডারগুলো দেখা
const getMyOrdersFromDB = async (userId: string) => {
  const result = await Order.find({ userId }).populate("items.productId");
  return result;
};

// ৩. অ্যাডমিনের জন্য সব অর্ডার দেখা
const getAllOrdersFromDB = async () => {
  const result = await Order.find()
    .populate("userId")
    .populate("items.productId");
  return result;
};

export const OrderServices = {
  createOrderIntoDB,
  getMyOrdersFromDB,
  getAllOrdersFromDB,
};
