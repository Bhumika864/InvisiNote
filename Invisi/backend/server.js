const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const webpush = require("web-push");

// Load environment variables
dotenv.config();

// Web push VAPID keys
webpush.setVapidDetails(
  'mailto:rajputbhumika121@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// App setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// DB connection
require("./config/db");

// Routes
app.use("/api/notes", require("./routes/notes"));
app.use("/subscribe", require("./routes/subscriptions"));

// Background job
require("./jobs/scheduler");

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
