import { Model } from "mongoose";

export type TUserRole = "USER" | "ADMIN";

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: TUserRole;
  address?: string;
  image?: string | null;
  isDeleted: boolean;
}

// এই UserModel ইন্টারফেসটিই তোমার এরর বন্ধ করবে
export interface UserModel extends Model<IUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
