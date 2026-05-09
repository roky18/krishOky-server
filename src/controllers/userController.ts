import { UserServices } from "../services/userService";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

// লগইন কন্ট্রোলার
const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully!",
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  loginUser, // এটি এক্সপোর্ট করতে ভুলো না
};
