const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const isValidDate = require("../utils/validateDate");
const isValidObjectId = require("../utils/isValidObjectId");

// Create a note
router.post("/", async (req, res) => {
  const { sender, receiver, message, iv, revealDate } = req.body;

  if (!sender || !receiver || !message || !revealDate) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (typeof sender !== "string" || typeof receiver !== "string" || typeof message !== "string") {
    return res.status(400).json({ error: "Sender, receiver, and message must be strings." });
  }

  if (!isValidDate(revealDate)) {
    return res.status(400).json({ error: "Invalid revealDate format." });
  }

  try {
    const note = new Note({ sender, receiver, message, iv, revealDate: new Date(revealDate) });
    await note.save();
    res.status(200).json({ id: note._id });
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get a note by ID
router.get("/:id", async (req, res) => {
  const noteId = req.params.id;

  if (!isValidObjectId(noteId)) {
    return res.status(400).json({ error: "Invalid note ID format." });
  }

  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found." });

    const now = new Date();
    const isRevealTime = now >= new Date(note.revealDate);

    res.json({
      sender: note.sender,
      receiver: note.receiver,
      message: isRevealTime ? note.message : "This Sweetnote is still hidden! 🤫",
      iv: note.iv,
      revealDate: note.revealDate,
      timeToDecrypt: isRevealTime,
    });
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
