// import express from "express";
// import { AiControllers } from "../controllers/aiController";

// const router = express.Router();

// router.post("/chat", AiControllers.getChatResponse);

// export const AiRoutes = router;

import express from "express";
import { AiControllers } from "../controllers/aiController";

const router = express.Router();

// ১. কৃষকদের জন্য AI Chatbot এন্ডপয়েন্ট
router.post("/chat", AiControllers.getChatResponse);

// ২. কাস্টমার রিভিউ সামারি জেনারেটর এন্ডপয়েন্ট
router.post(
  "/generate-description",
  AiControllers.generateBilingualDescription,
);

// ৩. কাস্টমার রিভিউ সামারি জেনারেটর এন্ডপয়েন্ট
router.post("/review-summary", AiControllers.getReviewSummary);

export const aiRoutes = router;
