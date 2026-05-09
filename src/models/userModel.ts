import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, UserModel } from "../interfaces/userInterface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 }, // ডাটা খোঁজার সময় পাসওয়ার্ড হাইড থাকবে
    phone: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }, // এটি createdAt এবং updatedAt অটো তৈরি করবে
);

// ১. পাসওয়ার্ড হ্যাস করার মিডলওয়্যার (Modern Async Style)
// এখানে next() কল করার দরকার নেই, তাই SaveOptions এরর আসবে না
userSchema.pre("save", async function () {
  const user = this;
  // যদি পাসওয়ার্ড নতুন হয় বা পরিবর্তন হয় তবেই হ্যাস করো
  if (!user.isModified("password")) return;

  user.password = await bcrypt.hash(user.password, 12);
});

// ২. পাসওয়ার্ড চেক করার স্ট্যাটিক মেথড
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// ৩. মডেল এক্সপোর্ট (IUser এবং UserModel দুটোই দিতে হবে)
export const User = model<IUser, UserModel>("User", userSchema);
