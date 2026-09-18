import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import { errorMiddleware } from "./middleware/error.middleware.js";
import router from "./modules/tasks/task.route.js"; //taskroute

const app = express();

const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/tasks", router);

// Basic test route
app.get("/api/hello", (req: Request, res: Response) => {
  res.json({
    message: "Hello from server",
  });
});

app.get("/api/status", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
