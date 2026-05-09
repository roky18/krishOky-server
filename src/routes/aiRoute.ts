import express from "express";
import { AiControllers } from "../controllers/aiController";

const router = express.Router();

router.post("/chat", AiControllers.getChatResponse);

export const AiRoutes = router;
