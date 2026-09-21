import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import { validate } from "../../middleware/validate.middleware.js";

import { addMemberSchema, createProjectSchema } from "./project.validation.js";

import {
  addMemberController,
  createProjectController,
  getProjectMembersController,
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

projectRouter.post(
  "/:projectId/members",
  authenticate,
  validate(addMemberSchema),
  addMemberController,
);

projectRouter.get(
  "/:projectId/members",
  authenticate,
  getProjectMembersController,
);
