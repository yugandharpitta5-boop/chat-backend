const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// Get all messages
router.get("/", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Add new message
router.post("/", async (req, res) => {
  const msg = new Message(req.body);
  await msg.save();
  res.json(msg);
});

module.exports = router;