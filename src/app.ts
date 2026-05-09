import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./routes/userRoute";
import { AiRoutes } from "./routes/aiRoute";
import { ItemRoutes } from "./routes/itemRoute";

const app: Application = express();

// পার্সার ও মিডলওয়্যার (Requirements অনুযায়ী)
app.use(express.json());
app.use(cors());

// বেসিক রুট
app.use("/api/auth", UserRoutes);
app.use("/api/ai", AiRoutes);
app.use("/api/items", ItemRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Welcome to Krishoky API Services!",
  });
});

app.use(
  (
    err: Error & { statusCode?: number },
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
