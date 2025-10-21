const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  iv: String,
  revealDate: Date,
});

module.exports = mongoose.model("Note", noteSchema);
