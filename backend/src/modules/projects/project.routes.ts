import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import { validate } from "../../middleware/validate.middleware.js";

import { createProjectSchema } from "./project.validation.js";

import {
  createProjectController,
  getProjectsController,
  getProjectsControllerById,
} from "./project.controller.js";

const projectRouter = Router();

projectRouter.post(
  "/",
  authenticate,
  validate(createProjectSchema),
  createProjectController,
);
projectRouter.get(
  "/",
  authenticate,

  getProjectsController,
);
projectRouter.get(
  "/:id",
  authenticate,

  getProjectsControllerById,
);
export default projectRouter;
