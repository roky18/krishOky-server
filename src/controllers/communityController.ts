import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import httpStatus from "http-status";
import {
  createPostIntoDB,
  getAllPostsFromDB,
} from "../services/communityService";
import { IPost } from "../interfaces/communityInterface";

export const createPost = catchAsync(async (req: Request, res: Response) => {
  // req.body কে IPost টাইপে কাস্ট করে দেওয়া হলো
  const result = await createPostIntoDB(req.body as IPost);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Post created successfully!",
    data: result,
  });
});

export const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllPostsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts retrieved successfully!",
    data: result,
  });
});
