// src/routes/communityRoute.ts
import { Router } from "express";
import { createPost, getAllPosts } from "../controllers/communityController";

const router = Router();

// এখানে "/" মানে হলো "/api/community/"
router.get("/", getAllPosts);
router.post("/create-post", createPost);

export default router;
