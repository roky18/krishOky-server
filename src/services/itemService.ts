import { Item } from "../models/itemModel";

const createItemIntoDB = async (payload: any) => {
  const result = await Item.create(payload);
  return result;
};

const getAllItemsFromDB = async () => {
  const result = await Item.find().populate("sellerId");
  return result;
};

export const ItemServices = {
  createItemIntoDB,
  getAllItemsFromDB,
};
