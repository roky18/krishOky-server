import { Post } from '../models/Post';

// ডাটাবেসে নতুন পোস্ট সেভ করার সার্ভিস
export const createPostIntoDB = async (payload: any) => {
  const result = await Post.create(payload);
  return result;
};

// ডাটাবেস থেকে সব পোস্ট রিট্রিভ করার সার্ভিস
export const getAllPostsFromDB = async () => {
  const result = await Post.find().sort({ createdAt: -1 });
  return result;
};