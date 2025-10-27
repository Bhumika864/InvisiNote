import CryptoJS from "crypto-js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Custom SVG Icon Component
const Icon = ({ name, className }) => {
  const icons = {
    lock: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    unlock: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </svg>
    ),
    clock: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
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
    calendar: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    chevronLeft: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    ),
    chevronRight: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )
  };

  return icons[name] || <div className={className}>?</div>;
};

//  Only ONE valid backend URL — do not duplicate!
const backendUrl = process.env.REACT_APP_API_URL;

const YourNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 5;

  // Function to decrypt a note's message using CryptoJS
  const decryptNoteMessage = (encryptedMessage, encryptionKey, iv) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey, {
        iv: CryptoJS.enc.Hex.parse(iv),
      }).toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.error("Decryption error for note:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const keys = Object.keys(localStorage).filter((key) =>
          key.startsWith("note-key-")
        );
        const noteIds = keys.map((key) => key.replace("note-key-", ""));

        if (noteIds.length === 0) {
          setLoading(false);
          return;
        }

        const results = await Promise.all(
          noteIds.map(async (noteId) => {
            try {
              const response = await fetch(`${backendUrl}/api/notes/${noteId}`);
              if (!response.ok) throw new Error(`Failed to fetch note ${noteId}`);
              const data = await response.json();
              return { ...data, id: noteId };
            } catch (err) {
              console.error("Error fetching note", noteId, err);
              return null;
            }
          })
        );

        const validNotes = results.filter((note) => note !== null);
        setNotes(validNotes);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load your notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const totalPages = Math.ceil(notes.length / itemsPerPage);
  const displayedNotes = notes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNoteClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const formatTimeUntilReveal = (revealDate) => {
    const now = new Date();
    const reveal = new Date(revealDate);
    const diffMs = reveal - now;

    if (diffMs <= 0) return "Revealed!";

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} minutes`;
  };

  if (loading) {
    return (
      <div className="your-notes-container">
        <h2>Your Secret Notes</h2>
        <div className="loading-container">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="note-skeleton">
              <div className="skeleton-header"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="your-notes-container">
      <div className="notes-header">
        <h2>Your Secret Notes</h2>
        <p>Messages that will reveal themselves at the perfect moment</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Icon name="lock" className="icon-lg" />
          </div>
          <h3>No Secret Notes Yet</h3>
          <p>Create your first InvisiNote to surprise someone special!</p>
          <button
            className="create-note-btn"
            onClick={() => navigate('/create')}
          >
            Create Your First Note
          </button>
        </div>
      ) : (
        <>
          <div className="notes-grid">
            {displayedNotes.map((note) => {
              const now = new Date();
              const noteRevealDate = new Date(note.revealDate);
              const isRevealed = now >= noteRevealDate;
              const timeUntilReveal = formatTimeUntilReveal(note.revealDate);

              let snippet = "";
              let statusClass = isRevealed ? "revealed" : "hidden";
              let statusText = isRevealed ? "Revealed" : "Hidden";
              let statusIcon = isRevealed ? "unlock" : "lock";

              if (isRevealed) {
                const storedKey = localStorage.getItem(`note-key-${note.id}`);
                if (storedKey) {
                  const decrypted = decryptNoteMessage(
                    note.message,
                    storedKey,
                    note.iv
                  );
                  if (decrypted && decrypted.length > 0) {
                    snippet =
                      decrypted.length > 100
                        ? decrypted.substring(0, 100) + "..."
                        : decrypted;
                  } else {
                    snippet = "Open to read the note";
                  }
                } else {
                  snippet = "Open to read the note";
                }
              } else {
                snippet = "This Note is still hidden! 🤫";
              }

              return (
                <div
                  key={note.id}
                  className={`note-card ${statusClass}`}
                  onClick={() => handleNoteClick(note.id)}
                >
                  <div className="note-status">
                    <Icon name={statusIcon} className="status-icon" />
                    <span>{statusText}</span>
                  </div>

                  <div className="note-meta">
                    <div className="meta-item">
                      <Icon name="user" className="icon-sm" />
                      <span>{note.sender}</span>
                    </div>
                    <div className="meta-item">
                      <Icon name="mail" className="icon-sm" />
                      <span>{note.receiver}</span>
                    </div>
                    <div className="meta-item">
                      <Icon name="calendar" className="icon-sm" />
                      <span>{new Date(note.revealDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="note-preview">
                    {snippet}
                  </div>

                  {!isRevealed && (
                    <div className="countdown">
                      <Icon name="clock" className="icon-sm" />
                      <span>Reveals in {timeUntilReveal}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                <Icon name="chevronLeft" className="icon-sm" />
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
                <Icon name="chevronRight" className="icon-sm" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default YourNotes;