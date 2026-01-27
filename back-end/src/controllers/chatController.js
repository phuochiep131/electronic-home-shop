const chatService = require("../services/chatService");

const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: "Vui lòng gửi message và sessionId" });
    }

    const response = await chatService.handleChat(sessionId, message);
    res.status(200).json({ reply: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetChat = (req, res) => {
    try {
        const { sessionId } = req.body;
        const result = chatService.clearHistory(sessionId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
  chat,
  resetChat
};