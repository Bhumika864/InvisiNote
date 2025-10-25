import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { formatISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import CryptoJS from "crypto-js";

// Custom SVG Icon Component
const Icon = ({ name, className }) => {
  const icons = {
    user: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    mail: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    lock: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    calendar: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  };

  return icons[name] || <div className={className}>?</div>;
};

function CreateNote() {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [revealDate, setRevealDate] = useState(() => {
    const now = new Date();
    now.setSeconds(0);
    return now;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const encryptionKey = CryptoJS.lib.WordArray.random(32).toString();
      const iv = CryptoJS.lib.WordArray.random(16).toString();
      const encryptedMessage = CryptoJS.AES.encrypt(message, encryptionKey, {
        iv,
      }).toString();
      const revealDateISO = formatISO(revealDate);

      const response = await fetch(`${backendUrl}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender,
          receiver,
          message: encryptedMessage,
          iv,
          revealDate: revealDateISO,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const noteId = data.id;
        navigate(`/notes/${noteId}?key=${encryptionKey}`);
      } else {
        alert("Failed to create the note. Please try again.");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-note-container">
      <div className="create-note-header">
        <h2>Create Your Secret Note</h2>
        <p>Write a message that will reveal itself at the perfect moment</p>
      </div>

      <div className="security-banner">
        <Icon name="lock" className="lock-icon" />
        <span>Your message is end-to-end encrypted. Not even we can read it.</span>
      </div>

      <form className="note-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            <Icon name="user" className="icon" /> From
          </label>
          <div className="input-container">
            <input
              type="text"
              className="form-input"
              value={sender}
              placeholder="Your name"
              onChange={(e) => setSender(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <Icon name="mail" className="icon" /> To
          </label>
          <div className="input-container">
            <input
              type="text"
              className="form-input"
              value={receiver}
              placeholder="Recipient's name"
              onChange={(e) => setReceiver(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <Icon name="lock" className="icon" /> Secret Message
          </label>
          <div className="input-container">
            <textarea
              className="form-textarea"
              value={message}
              placeholder="What secret do you want to share?"
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="6"
            ></textarea>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <Icon name="calendar" className="icon" /> Reveal Date & Time
          </label>
          <div className="input-container">
            <DatePicker
              selected={revealDate}
              onChange={(date) => {
                const adjustedDate = new Date(date);
                adjustedDate.setSeconds(0);
                setRevealDate(adjustedDate);
              }}
              timeInputLabel="Time:"
              showTimeInput
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-input"
              onFocus={(e) => (e.target.readOnly = true)}
              required
              minDate={new Date()}
              popperPlacement="bottom-start"
            />
          </div>
          <p className="date-hint">Select when your message should be revealed</p>
        </div>

        <div className="form-group">
          <div className="security-info">
            <Icon name="lock" className="security-icon" />
            <p>
              <strong>Security Note:</strong> Your message is encrypted before it leaves your browser.
              The decryption key will only be shown once after creation - save it!
            </p>
          </div>
        </div>

        <button
          className="submit-button"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-circle"></span> Securing Your Secret...
            </>
          ) : (
            "Create Secret Note"
          )}
        </button>
      </form>

      <div className="creation-tips">
        <h3>Tips for Perfect Secrets</h3>
        <ul>
          <li>Set reveal times for birthdays, anniversaries, or special events</li>
          <li>Use pseudonyms if you want to remain anonymous</li>
          <li>Send the link separately from any hints about the content</li>
          <li>Save the decryption key - it can't be recovered!</li>
        </ul>
      </div>
    </div>
  );
}

export default CreateNote;