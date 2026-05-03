export const getAiSuggestionsController = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Simulate AI logic based on message content
    let suggestions = [
      "I'll look into this immediately.",
      "Could you please provide more logs or screenshots?",
      "We've seen this before, try restarting the service."
    ];

    if (message.toLowerCase().includes("login") || message.toLowerCase().includes("auth")) {
      suggestions = [
        "Check if the user has verified their email.",
        "Resetting the session usually fixes this.",
        "Are there any error codes in the console?"
      ];
    }

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
