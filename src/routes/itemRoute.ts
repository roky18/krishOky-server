import express from "express";
import { ItemControllers } from "../controllers/itemController";
import { upload } from "../utils/sendImageToCloudinary";

const router = express.Router();

// এখানে ভুল ছিল, ডুপ্লিকেট রুটগুলো সরিয়ে শুধু এটা রাখো:
router.get("/", ItemControllers.getAllItems);

router.get("/:id", ItemControllers.getSingleItem);

router.post(
  "/create-item",
  upload.single("file"), // ফাইল আপলোডের জন্য মুল্টার মিডলওয়্যার
  ItemControllers.createItem,
);

export const ItemRoutes = router;
