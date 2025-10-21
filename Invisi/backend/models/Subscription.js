const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  noteId: { type: String, required: true },
  revealDate: { type: Date, required: true },
  subscription: { type: Object, required: true },
  notified: { type: Boolean, default: false },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
