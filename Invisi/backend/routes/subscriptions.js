const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");

router.post("/", async (req, res) => {
  const { subscription, userId, noteId, revealDate } = req.body;

  try {
    await Subscription.findOneAndUpdate(
      { userId, noteId },
      { subscription, revealDate, notified: false },
      { upsert: true, new: true }
    );
    res.status(201).json({ message: "Subscription saved!" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});

module.exports = router;
