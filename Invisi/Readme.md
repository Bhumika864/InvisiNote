🕵️‍♂️ InvisiNote
Send encrypted messages that reveal themselves at the perfect moment

📖 About
InvisiNote is a time-locked encrypted messaging app. Send messages that automatically unlock at a specific date and time. Perfect for birthday surprises, anniversaries, or digital time capsules.
✨ Key Features

🔐 End-to-End Encryption - AES-256 client-side encryption
⏰ Time-Locked Delivery - Messages unlock at scheduled time
🚫 No Sign-Up Required - No authentication needed
🌐 Zero-Knowledge - Server cannot read your messages

🛠️ Tech Stack
Frontend: React, CryptoJS, React Router, Service Workers
Backend: Node.js, Express, MongoDB, Web Push

🔐 Security
- **AES-256 encryption** - Client-side only
- **Random keys** - 256-bit key + 128-bit IV per message
- **Zero-knowledge** - Server stores only ciphertext
- **Time-lock** - Server enforces reveal time
- **Key in URL** - Encryption key shared via URL parameter

## 📁 Project Structure
```
invisinote/
├── backend/
│   ├── config/db.js
│   ├── models/
│   │   ├── Note.js
│   │   └── Subscription.js
│   ├── routes/
│   │   ├── notes.js
│   │   └── subscriptions.js
│   ├── jobs/scheduler.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── CreateNote.js
│   │   ├── ViewNote.js
│   │   ├── YourNotes.js
│   │   └── sw.js
│   └── public/
└── README.md


🎯 Use Cases
🎂 Birthday wishes that unlock at midnight
💝 Anniversary messages for special dates
🎓 Messages to your future self
🎉 Party invitations that reveal location at event time
🔒 Confidential information with delayed access