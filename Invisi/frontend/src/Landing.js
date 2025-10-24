// Landing.js
import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Secure Timed Messages - Shared Only at the Right Moment</h1>
          <p>End-to-end encrypted messages that unlock only when you choose</p>
          <div className="hero-actions">
            <Link to="/create" className="btn-primary">Create Your First Note</Link>
            <Link to="/features" className="btn-secondary">How It Works</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="note-preview">
            <div className="note-content">
              <div className="countdown">Revealing in 2 days, 4 hours</div>
              <div className="encrypted-indicator">🔒 End-to-end encrypted</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How InvisiNote Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Write a Hidden Message</h3>
            <p>Type out your surprise and choose when it should unlock.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Share the Magic Link</h3>
            <p>Send your friend a special link that holds the secret.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Watch the Clock Tick</h3>
            <p> The secret stays sealed until it’s time.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Secret Revealed!</h3>
            <p>When the moment hits, the message appears like magic.</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases">
        <h2>Perfect For</h2>
        <div className="cases">
          <div className="case-card">
            <div className="case-icon">💌</div>
            <h3>Confessions</h3>
            <p>Reveal your feelings at the perfect moment</p>
          </div>
          <div className="case-card">
            <div className="case-icon">🎂</div>
            <h3>Birthday Surprises</h3>
            <p>Make birthday wishes appear exactly at midnight</p>
          </div>
          <div className="case-card">
            <div className="case-icon">💼</div>
            <h3>Job Offers</h3>
            <p>Create anticipation for important announcements</p>
          </div>
          <div className="case-card">
            <div className="case-icon">💍</div>
            <h3>Proposals</h3>
            <p>Make your special question even more memorable</p>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section">
        <div className="security-content">
          <h2>Military-Grade Security</h2>
          <p>Your secrets are safe with our end-to-end encryption</p>
          <ul className="security-features">
            <li>🔒 End-to-end encryption - not even we can read your messages</li>
            <li>🛡️ Zero-knowledge architecture - we don't store your keys</li>
            <li>🚀 Automatic deletion - messages disappear after being read</li>
            <li>🕵️‍♂️ No metadata tracking - we don't monitor who you message</li>
          </ul>
        </div>
        <div className="security-image">
          <div className="lock-icon">🔒</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Create Some Anticipation?</h2>
        <p>Join thousands of users sending secret notes today</p>
        <Link to="/create" className="btn-primary">Send Your First InvisiNote</Link>
      </section>
    </div>
  );
}

export default Landing;