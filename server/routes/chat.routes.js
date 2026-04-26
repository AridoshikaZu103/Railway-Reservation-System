const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authenticate = require("../middleware/auth");

// Only authenticated users can use the chatbot
router.use(authenticate);

router.post("/", chatController.sendMessage);

module.exports = router;
