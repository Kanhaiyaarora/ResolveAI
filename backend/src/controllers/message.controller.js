import InternalMessage from "../models/internalMessage.model.js";

export const getMessagesController = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const messages = await InternalMessage.find({ ticketId })
      .populate("senderId", "name email role")
      .sort({ createdAt: 1 });
      
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendMessageController = async (req, res) => {
  try {
    const { ticketId, text } = req.body;
    const senderId = req.user.id;

    const message = await InternalMessage.create({
      ticketId,
      senderId,
      text,
    });

    const populatedMessage = await InternalMessage.findById(message._id).populate("senderId", "name email role");

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
