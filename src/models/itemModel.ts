import { Schema, model } from "mongoose";
import { IItem } from "../interfaces/itemInterface";

const itemSchema = new Schema<IItem>(
  {
    title: {
      bn: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      bn: { type: String, required: true },
      en: { type: String, required: true },
    },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Seeds", "Fertilizer", "Tools", "Branding", "Others"],
      required: true,
    },
    image: { type: String }, // ইমেজের ইউআরএল
    stock: { type: Number, default: 0 },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true, // এটি createdAt এবং updatedAt অটো তৈরি করবে
  },
);

export const Item = model<IItem>("Item", itemSchema);
