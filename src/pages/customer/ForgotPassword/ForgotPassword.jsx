
import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Frontend demo only — no real email is sent.
    setMessage(
      "Email validated successfully! Password reset will be available after backend integration."
    );
  };

  return (
    <main className="forgot-page">
      <section className="forgot-card">
        <Link to="/" className="forgot-logo">
          <span className="forgot-logo-mark">S</span>
          <span>
            Shop<span className="forgot-logo-highlight">Nexa</span>
          </span>
        </Link>

        <div className="forgot-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="m3 7 9 6 9-6" />
            <path d="M16 3v4" />
          </svg>
        </div>

        <p className="forgot-eyebrow">ACCOUNT RECOVERY</p>
        <h1>Forgot your password?</h1>

        <p className="forgot-description">
          No worries! Enter the email address associated with your account.
          We’ll help you get back into ShopNexa.
        </p>

        <form className="forgot-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="forgot-email">Email address</label>

          <div className="forgot-input-wrap">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m3 7 9 6 9-6" />
            </svg>

            <input
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-invalid={Boolean(error)}
              required
            />
          </div>

          {error && (
            <p className="forgot-feedback forgot-error" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="forgot-feedback forgot-success" role="status">
              {message}
            </p>
          )}

          <button className="forgot-submit" type="submit">
            Continue <span aria-hidden="true">→</span>
          </button>
        </form>

        <Link to="/login" className="forgot-back">
          <span aria-hidden="true">←</span> Back to Sign In
        </Link>

        <div className="forgot-security">
          <span aria-hidden="true">♧</span>
          Your account security matters to us.
        </div>
      </section>

      <footer className="forgot-footer">
        © 2026 ShopNexa. All rights reserved.
      </footer>
    </main>
  );
}

export default ForgotPassword;
