const pool = require("../config/db");

// System prompt giving the AI context about the application
const SYSTEM_PROMPT = `
You are RailBot, a helpful AI assistant for the Railway Reservation System.
You assist both Passengers and Admins.
Keep your answers very concise, polite, and directly related to railway reservations.
If asked about ticket booking, inform them that they can book tickets from the "Reservations" tab by clicking "+ Book Ticket".
If asked about train schedules, tell them to check the "Search Trains" tab.
Do not make up real-time train statuses. 
Format your responses in clean plain text.
`;

/**
 * POST /api/chat
 * Send a message to the Gemini AI and get a response
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is not configured in the backend .env file.",
      });
    }

    // Format history for Gemini API
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add the current message
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const requestBody = {
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      throw new Error(data.error?.message || "Failed to communicate with AI");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    res.json({
      success: true,
      data: {
        text: aiResponse
      }
    });

  } catch (error) {
    console.error("Chat controller error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your message.",
    });
  }
};
