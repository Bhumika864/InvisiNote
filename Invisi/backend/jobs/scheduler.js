const webpush = require("web-push");
const Note = require("../models/Note");
const Subscription = require("../models/Subscription");

setInterval(async () => {
  const now = new Date();
  try {
    const subscriptionsToNotify = await Subscription.find({
      revealDate: { $lte: now },
      notified: false,
    });

    for (const sub of subscriptionsToNotify) {
      const note = await Note.findById(sub.noteId);
      if (!note) continue;

      const payload = JSON.stringify({
        title: "🎁✨ Sweetnotes Reveal! 🎁✨",
        body: `*Psst! Sweetnote from ${note.sender} for ${note.receiver} is ready to be read!* `,
        data: { url: `https://sweetnotes.art/notes/${sub.noteId}` }
      });

      try {
        await webpush.sendNotification(sub.subscription, payload);
        sub.notified = true;
        await sub.save();
        console.log(`✅ Notification sent for ${sub._id}`);
      } catch (err) {
        console.error(`❌ Failed to notify ${sub._id}:`, err);
      }
    }
  } catch (error) {
    console.error("Error in notification scheduler:", error);
  }
}, 30000); // Every 30 seconds
