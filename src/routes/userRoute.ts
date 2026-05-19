import express from "express";
import { UserControllers } from "../controllers/userController";

const router = express.Router();

router.post("/register", UserControllers.registerUser);
router.post("/login", UserControllers.loginUser); // লগইন রাস্তা
router.post("/google-login", UserControllers.googleLogin);

export const UserRoutes = router;
