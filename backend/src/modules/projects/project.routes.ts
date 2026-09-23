import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import { validate } from "../../middleware/validate.middleware.js";

import {
  addMemberSchema,
  createProjectSchema,
  updateMemberRoleSchema,
  updateProjectSchema,
} from "./project.validation.js";

import {
  addMemberController,
  createProjectController,
  deleteProjectController,
  getProjectMembersController,
  getProjectsController,
  getProjectsControllerById,
  removeMemberController,
  updateMemberRoleController,
  updateProjectController,
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
projectRouter.patch(
  "/:projectId/members/:userId",
  authenticate,
  validate(updateMemberRoleSchema),
  updateMemberRoleController,
);

projectRouter.delete(
  "/:projectId/members/:userId",
  authenticate,
  removeMemberController,
);
projectRouter.patch(
  "/:id",
  authenticate,
  validate(updateProjectSchema),
  updateProjectController,
);
projectRouter.delete("/:id", authenticate, deleteProjectController);
