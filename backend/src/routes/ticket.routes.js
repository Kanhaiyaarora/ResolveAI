import { Router } from "express";

import {
    createTicketController,
    getAllTicketsController,
    getMyTicketsController,
    assignTicketController,
    updateTicketStatusController,
    getTicketByIdController,
    getTicketStatsController,
} from "../controllers/ticket.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const ticketRouter = Router();


//  CREATE TICKET (customer / admin)
ticketRouter.post( "/", authenticateUser,
    createTicketController
);


//  GET ALL TICKETS (ADMIN)
ticketRouter.get( "/", authenticateUser,
    authorizeRoles("admin"),
    getAllTicketsController
);


//  GET MY TICKETS (AGENT)
ticketRouter.get("/my", authenticateUser,
    authorizeRoles("agent"),
    getMyTicketsController
);


//  ASSIGN TICKET (ADMIN)
ticketRouter.patch("/:id/assign", authenticateUser,
    authorizeRoles("admin"),
    assignTicketController
);


//  UPDATE STATUS (AGENT, ADMIN)
ticketRouter.patch("/:id/status", authenticateUser,
    authorizeRoles("agent","admin"),
    updateTicketStatusController
);


//  GET TICKET BY ID
ticketRouter.get("/:id", authenticateUser,
    getTicketByIdController
);


//  GET STATS
ticketRouter.get("/stats", authenticateUser,
    getTicketStatsController
);


export default ticketRouter;