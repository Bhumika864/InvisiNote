import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";
import Header from "./Header"; // Ensure you have this component

const backendUrl = process.env.REACT_APP_API_URL;

function ViewNote() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy Link");
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  const baseURL = window.location.origin;

  useEffect(() => {
    const keyFromUrl = searchParams.get("key");

    if (keyFromUrl) {
      setEncryptionKey(keyFromUrl);
      localStorage.setItem(`note-key-${id}`, keyFromUrl);
    } else {
      const storedKey = localStorage.getItem(`note-key-${id}`);
      if (storedKey) {
        setEncryptionKey(storedKey);
        setSearchParams({ key: storedKey });
      } else {
        setError("Missing encryption key! Please use the original link provided by the sender.");
        setIsLoading(false);
      }
    }
  }, [id, searchParams, setSearchParams]);

  useEffect(() => {
    if (encryptionKey) {
      const fetchNote = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${backendUrl}/api/notes/${id}`);
          if (!response.ok) throw new Error("Failed to fetch note");
          const data = await response.json();

          if (data.timeToDecrypt) {
            const decryptedMessage = CryptoJS.AES.decrypt(
              data.message,
              encryptionKey,
              { iv: CryptoJS.enc.Hex.parse(data.iv) }
            ).toString(CryptoJS.enc.Utf8);

            if (!decryptedMessage) throw new Error("Failed to decrypt the message.");

            setNote({
              sender: data.sender,
              receiver: data.receiver,
              message: decryptedMessage,
              revealDate: new Date(data.revealDate)
            });
            setIsRevealed(true);
          } else {
            setNote({
              sender: data.sender,
              receiver: data.receiver,
              message: "This Note is still hidden! 🤫",
              revealDate: new Date(data.revealDate)
            });
          }
        } catch (error) {
          console.error("Error fetching or decrypting the note:", error);
          setError("An error occurred. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchNote();
    }
  }, [encryptionKey, id, backendUrl]);

  // Service worker registration code remains the same as before...

  function urlBase64ToUint8Array(base64String) {
    // Implementation remains the same as before
  }

  const copyToClipboard = () => {
    const encryptionKey = searchParams.get("key");
    const noteLink = `${baseURL}/notes/${id}?key=${encryptionKey}`;

    navigator.clipboard.writeText(noteLink)
      .then(() => setCopyButtonText("Copied!"))
      .catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = noteLink;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
        setCopyButtonText("Copied!");
      });

    setTimeout(() => setCopyButtonText("Copy Link"), 2000);
  };

  const shareOnWhatsApp = () => {
    const encryptionKey = searchParams.get("key");
    if (note) {
      const noteLink = `${baseURL}/notes/${id}?key=${encryptionKey}`;
      
      const whatsappMessage = `🕵️‍♀️ Top Secret: ${note.sender} left a hidden note just for ${note.receiver}. Decode it now! \n ${noteLink} `;
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappURL, "_blank");
    }
  };

  const handleSaveAsImage = () => {
    const noteElement = document.querySelector(".note-card");
    if (!noteElement) {
      alert("Note element not found!");
      return;
    }

    html2canvas(noteElement, {
      backgroundColor: "#fff9f0",
      scale: 2 // Higher resolution
    }).then((canvas) => {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `note-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(date);
  };

  // SVG Icons
  const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.05-.084-.182-.133-.38-.232z" />
    </svg>
  );

  const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
      <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
    </svg>
  );

  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    </svg>
  );

  return (
    <div className="view-note-container">
      <Header />

      <div className="note-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Unwrapping your InvisiNote...</p>
          </div>
        ) : error ? (
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        ) : note ? (
          <div className="note-card">
            <div className="note-header">
              <h2>
                {isRevealed ? "Secret Revealed!" : "InvisiNote Locked"}
                {isRevealed ? " 🔓" : " 🔒"}
              </h2>
              <div className={`status-badge ${isRevealed ? "revealed" : "hidden"}`}>
                <LockIcon />
                <span>{isRevealed ? "Revealed" : "Hidden"}</span>
              </div>
            </div>

            <div className="note-meta">
              <div className="meta-item">
                <strong>From:</strong> {note.sender}
              </div>
              <div className="meta-item">
                <strong>To:</strong> {note.receiver}
              </div>
              <div className="meta-item">
                <strong>Reveal Date:</strong> {formatDate(note.revealDate)}
              </div>
            </div>

            <div className="note-message">
              {note.message}
            </div>

            <div className="security-note">
              <LockIcon />
              <p>
                This message was end-to-end encrypted. Not even we could read it before the reveal time.
              </p>
            </div>

            <div className="share-section">
              <h3>Share this InvisiNote</h3>
              <div className="share-buttons">
                <button className="share-button copy-button" onClick={copyToClipboard}>
                  <CopyIcon />
                  <span>{copyButtonText}</span>
                </button>
                <button className="share-button whatsapp-button" onClick={shareOnWhatsApp}>
                  <WhatsAppIcon />
                  <span>WhatsApp</span>
                </button>
                <button className="share-button image-button" onClick={handleSaveAsImage}>
                  <ImageIcon />
                  <span>Save as Image</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <h3>Note Not Found</h3>
            <p>The Note you're looking for doesn't exist or has been deleted.</p>
            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewNote;