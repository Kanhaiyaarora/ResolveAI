import { Router } from "express";

import {
  createTicketController,
  getAllTicketsController,
  getMyTicketsController,
  assignTicketController,
  updateTicketStatusController,
  getTicketByIdController,
  getTicketStatsController,
  getRecentActivityController,
} from "../controllers/ticket.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const ticketRouter = Router();

//  CREATE TICKET (customer / admin)
ticketRouter.post("/", authenticateUser, createTicketController);

//  GET ALL TICKETS (ADMIN)
ticketRouter.get(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  getAllTicketsController,
);

//  GET MY TICKETS (AGENT)
ticketRouter.get(
  "/my",
  authenticateUser,
  authorizeRoles("agent"),
  getMyTicketsController,
);

//  GET STATS (must be BEFORE /:id)
ticketRouter.get("/stats", authenticateUser, getTicketStatsController);

//  GET RECENT ACTIVITY (must be BEFORE /:id)
ticketRouter.get("/activity/recent", authenticateUser, getRecentActivityController);

//  ASSIGN TICKET (ADMIN)
ticketRouter.patch(
  "/:id/assign",
  authenticateUser,
  authorizeRoles("admin"),
  assignTicketController,
);

//  UPDATE STATUS (AGENT, ADMIN)
ticketRouter.patch(
  "/:id/status",
  authenticateUser,
  authorizeRoles("agent", "admin"),
  updateTicketStatusController,
);

//  GET TICKET BY ID (must be LAST — catches all /:id patterns)
ticketRouter.get("/:id", authenticateUser, getTicketByIdController);

export default ticketRouter;
