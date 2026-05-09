import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { IUser } from "../interfaces/userInterface";

const createUserIntoDB = async (userData: IUser) => {
  const result = await User.create(userData);
  return result;
};

const loginUser = async (payload: Partial<IUser>) => {
  // ১. ইমেইল দিয়ে ইউজার খোঁজা (পাসওয়ার্ডসহ)
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new Error("User not found!");
  }

  // ২. পাসওয়ার্ড চেক করা
  const isPasswordMatched = await (User as any).isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error("Password incorrect!");
  }

  // ৩. JWT টোকেন তৈরি
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: "1d" },
  );

  return { accessToken };
};

export const UserServices = {
  createUserIntoDB,
  loginUser,
};
