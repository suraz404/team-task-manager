import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { errorMiddleware } from "./middleware/error.middleware.js";
import router from "./modules/tasks/task.route.js"; //taskroute
import authRoutes from "./modules/auth/auth.routes.js";
import projectRouter from "./modules/projects/project.routes.js";

const app = express();

const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/tasks", router);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRouter);

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
