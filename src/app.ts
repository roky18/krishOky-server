import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./routes/userRoute";

const app: Application = express();

// পার্সার ও মিডলওয়্যার (Requirements অনুযায়ী)
app.use(express.json());
app.use(cors());

// বেসিক রুট
app.use("/api/auth", UserRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Welcome to Krishoky API Services!",
  });
});

export default app;
