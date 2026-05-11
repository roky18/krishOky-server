import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./routes/userRoute";
import { AiRoutes } from "./routes/aiRoute";
import { ItemRoutes } from "./routes/itemRoute";

const app: Application = express();

// ১. CORS কনফিগারেশন (এটি ফ্রন্টএন্ডের সাথে কানেকশন নিশ্চিত করবে)
app.use(
  cors({
    origin: "http://localhost:3000", // আপনার ফ্রন্টএন্ডের URL
    credentials: true,
  }),
);

// ২. পার্সার ও মিডলওয়্যার
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ৩. রুট সেটআপ
app.use("/api/auth", UserRoutes);
app.use("/api/ai", AiRoutes);
app.use("/api/items", ItemRoutes);

// মেইন রুট
app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Welcome to Krishoky API Services!",
  });
});

// ৪. "Not Found" রুট হ্যান্ডেলার (যদি কেউ ভুল ইউআরএল-এ হিট করে)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found!",
  });
});

// ৫. গ্লোবাল এরর হ্যান্ডেলার
app.use(
  (
    err: any, // গ্লোবাল হ্যান্ডেলারের জন্য আপাতত any ব্যবহার করা হয়েছে
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  },
);

export default app;
