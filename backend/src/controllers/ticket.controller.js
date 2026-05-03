import Ticket from "../models/ticket.model.js";

// 📝 CREATE TICKET
export const createTicketController = async (req, res) => {
  try {
    const {
      companyId,
      customerId,
      subject,
      description,
      priority,
    } = req.body;

if(!companyId || !customerId || !subject || !description || !priority){
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
}

    const ticket = await Ticket.create({
      companyId,
      customerId,
      subject,
      description,
      priority,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket,
    });

  } catch (error) {
    console.log("Error in createTicketController:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 📋 GET ALL TICKETS (ADMIN)
export const getAllTicketsController = async (req, res) => {
  try {
    const { status, priority } = req.query;

    let filter = { companyId: req.user.companyId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tickets = await Ticket.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });

  } catch (error) {
    console.log("Error in getAllTicketsController:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 👤 GET MY TICKETS (AGENT)
export const getMyTicketsController = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      assignedTo: req.user._id,
    })
      .populate("customerId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 🔥 ASSIGN TICKET (ADMIN)
export const assignTicketController = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentIds } = req.body; // array of agent IDs

    const ticket = await Ticket.findOne({ _id: id, companyId: req.user.companyId });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found or unauthorized",
      });
    }

    ticket.assignedTo = agentIds;
    ticket.status = "pending";

    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Ticket assigned successfully",
      ticket,
    });

  } catch (error) {
    console.log("Error in assignTicketController:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 🔄 UPDATE TICKET STATUS (AGENT)
export const updateTicketStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findOne({ _id: id, companyId: req.user.companyId });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found or unauthorized",
      });
    }

    ticket.status = status;

    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      ticket,
    });

  } catch (error) {
    console.log("Error in updateTicketStatusController:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 🔍 GET TICKET BY ID
export const getTicketByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findOne({ _id: id, companyId: req.user.companyId })
      .populate("assignedTo", "name email")
      .populate("customerId")
      .populate("createdBy", "name email");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      ticket,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 📊 GET TICKET STATS
export const getTicketStatsController = async (req, res) => {
  try {
    if (!req.user || !req.user.companyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized or missing company association",
      });
    }

    const companyId = req.user.companyId;

    const [
      total,
      open,
      pending,
      resolved,
      closed,
      activeAgentIds,
      myTotal,
      myResolved
    ] = await Promise.all([
      Ticket.countDocuments({ companyId }),
      Ticket.countDocuments({ companyId, status: "open" }),
      Ticket.countDocuments({ companyId, status: "pending" }),
      Ticket.countDocuments({ companyId, status: "resolved" }),
      Ticket.countDocuments({ companyId, status: "closed" }),
      Ticket.distinct("assignedTo", { companyId, assignedTo: { $exists: true, $ne: [] } }),
      Ticket.countDocuments({ assignedTo: req.user._id }),
      Ticket.countDocuments({ assignedTo: req.user._id, status: "resolved" })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        open,
        inProgress: pending, // Mapping 'pending' to 'inProgress' for the UI
        resolved,
        closed,
        activeAgents: activeAgentIds.length,
        myTotal,
        myResolved
      }
    });
  } catch (error) {
    console.error("Error in getTicketStatsController:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching stats",
      error: error.message
    });
  }
};