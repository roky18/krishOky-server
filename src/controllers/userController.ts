import { Request, Response } from "express";
import { UserServices } from "../services/userService";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { User } from "../models/userModel"; // 🚀 আপনার ফোল্ডার অনুযায়ী পাথ ফিক্সড (.model এর জায়গায় Model)
import jwt from "jsonwebtoken";

// ১. রেজিস্ট্রেশন কন্ট্রোলার
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

// ২. লগইন কন্ট্রোলার
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully!",
    data: result,
  });
});

// ৩. গুগল লগইন কন্ট্রোলার (Fully Fixed for Your Layered Structure)
const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, name, image } = req.body;

  // ডাটাবেসে ইউজার চেক করা
  let user: any = await User.findOne({ email });

  if (!user) {
    // নতুন ইউজার হলে পাসওয়ার্ড ছাড়া ডকুমেন্ট তৈরি
    user = await User.create({
      name,
      email,
      image,
      role: "USER", // ডিফল্ট রোল
    });
  }

  // JWT Secret চেক
  // 🚀 process.env রিড করতে না পারলেও যেন আপনার সিক্রেট কি ডিরেক্ট কাজ করে:
  const jwtSecret =
    process.env.JWT_ACCESS_SECRET ||
    "roky_access_secret_12345_secured_key_MERN";

  // কাস্টম JWT Access Token তৈরি
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: "7d" },
  );

  // সাকসেস রেসপন্স পাঠানো হচ্ছে
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Google login successful",
    data: {
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    },
  });
});

export const UserControllers = {
  registerUser,
  loginUser,
  googleLogin, // ⚠️ অবজেক্টের ভেতরে এটি অবশ্যই এক্সপোর্ট থাকবে
};
