import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    user: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "Fruits",
        "Vegetables",
        "Crops",
        "Agricultural Machinery",
        "Spices",
        "Seeds & Saplings",
        "Fertilizer",
        "Others",
      ],
      default: "Others",
    },
    img: { type: String },
    likes: [{ type: String }], // User IDs
    comments: [
      {
        user: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
); // Eta dilei createdAt/updatedAt automatic paben

export const Post = model("Post", postSchema);
