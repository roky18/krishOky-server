import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, UserModel } from "../interfaces/userInterface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // 🚀 ১. পাসওয়ারড ফিল্ড থেকে required: true তুলে দেওয়া হলো (সোশ্যাল লগইনের জন্য)
    password: { type: String, select: 0 },
    phone: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    address: { type: String },
    image: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// ২. পাসওয়ার্ড হ্যাস করার মিডলওয়্যার (Modern Async Style)
userSchema.pre("save", async function () {
  const user = this;

  // 🚀 যদি পাসওয়ার্ড না থাকে (যেমন গুগল লগইন), তবে হ্যাস করার দরকার নেই, রিটার্ন করো
  if (!user.password || !user.isModified("password")) return;

  user.password = await bcrypt.hash(user.password, 12);
});

// ৩. পাসওয়ার্ড চেক করার স্ট্যাটিক মেথড
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  // ফলব্যাক প্রটেকশন: যদি ডাটাবেসে পাসওয়ার্ড না থাকে (গুগল ইউজার)
  if (!hashedPassword) return false;
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// ৪. মডেল এক্সপোর্ট
export const User = model<IUser, UserModel>("User", userSchema);
