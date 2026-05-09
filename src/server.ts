import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./config/db";


const port = process.env.PORT || 5000;

// সার্ভার চালু করার আগে ডাটাবেজ কানেক্ট করা
const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 Krishoky server running on http://localhost:${port}`);
  });
};

startServer();
