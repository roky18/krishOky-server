import { Schema, model } from "mongoose";

const itemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true }, // এখানে এআই জেনারেটেড লেখা থাকবে
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Seeds", "Fertilizer", "Tools", "Others"],
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

export const Item = model("Item", itemSchema);
