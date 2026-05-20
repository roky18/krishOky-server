import { Item } from "../models/itemModel";

const escapeRegex = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const buildItemFilter = (query: any) => {
  const searchValue = query.search || query.searchTerm;
  const minimumPrice = query.priceMin ?? query.minPrice;
  const maximumPrice = query.priceMax ?? query.maxPrice;
  const filter: any = {};

  if (searchValue) {
    const safeSearch = escapeRegex(String(searchValue));

    filter.$or = [
      { "title.en": { $regex: safeSearch, $options: "i" } },
      { "title.bn": { $regex: safeSearch, $options: "i" } },
      { "description.en": { $regex: safeSearch, $options: "i" } },
      { "description.bn": { $regex: safeSearch, $options: "i" } },
    ];
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (minimumPrice || maximumPrice) {
    filter.price = {};
    if (minimumPrice) filter.price.$gte = Number(minimumPrice);
    if (maximumPrice) filter.price.$lte = Number(maximumPrice);
  }

  return filter;
};

const createItemIntoDB = async (payload: any) => {
  const result = await Item.create(payload);
  return result;
};

const getAllItemsFromDB = async (
  query: any,
  sortOptions: any,
  skip: number,
  limitNumber: number,
) => {
  const filter = buildItemFilter(query);

  const result = await Item.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)
    .populate("sellerId");

  return result;
};

const countItemsCount = async (query: any) => {
  const filter = buildItemFilter(query);
  return await Item.countDocuments(filter);
};

const getSingleItemFromDB = async (id: string) => {
  const result = await Item.findById(id).populate("sellerId");
  return result;
};

export const ItemServices = {
  createItemIntoDB,
  getAllItemsFromDB,
  countItemsCount,
  getSingleItemFromDB,
};
