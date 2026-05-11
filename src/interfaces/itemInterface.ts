import { Types } from "mongoose";

export interface IItem {
  title: {
    bn: string;
    en: string;
  };
  description: {
    bn: string;
    en: string;
  };
  price: number;
  category: "Seeds" | "Fertilizer" | "Tools" | "Branding" | "Others";
  image?: string;
  stock: number;
  sellerId: Types.ObjectId;
}
