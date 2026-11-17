
import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import API from "../../../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/customer/auth/login", {
        email: cleanEmail,
        password,
      });

      const data = response.data;

      if (!data.success) {
        setError(data.message || "Login failed.");
        return;
      }

      const { token, user } = data;

      if (!token || !user) {
        setError("Login response is missing token or user details.");
        return;
      }

      // Clear previous customer session
      localStorage.removeItem("customerToken");
      sessionStorage.removeItem("customerToken");
      localStorage.removeItem("shopnexa_user");
      sessionStorage.removeItem("shopnexa_user");
      localStorage.removeItem("shopnexa_demo_user");
      sessionStorage.removeItem("shopnexa_demo_user");

      // Save session based on Remember Me
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("customerToken", token);
      storage.setItem("shopnexa_user", JSON.stringify(user));

      // Notify other components
      window.dispatchEvent(new Event("auth-updated"));

      const redirectPath = location.state?.from?.pathname || "/";

      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">

        {/* LEFT LOGIN PANEL */}
        <div className="login-panel">
          <div className="login-leaf-decoration">✦</div>

          {/* BRAND HEADER */}
          <header className="login-header">
            <Link to="/" className="login-logo">
              <span className="logo-mark">S</span>

              <span className="logo-name">
                Shop<span className="logo-highlight">Nexa</span>
              </span>
            </Link>

            <div className="secure-login">
              <span>♢</span>
              Secure Login
            </div>
          </header>

          {/* LOGIN CONTENT */}
          <div className="login-content">
            <div className="login-heading">
              <p className="login-eyebrow">WELCOME BACK</p>

              <h1>
                Sign in to <span>your account</span>
              </h1>

              <p className="login-description">
                Please enter your email address and password
                to continue shopping.
              </p>

              <div className="heading-underline" />
            </div>

            {/* LOGIN FORM */}
            <form
              onSubmit={handleSubmit}
              className="login-form"
              autoComplete="off"
            >
              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="login-email">
                  <span className="field-icon">✉</span>
                  Email address
                </label>

                <input
                  type="email"
                  id="login-email"
                  name="shopnexa-login-email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label htmlFor="login-password">
                  <span className="field-icon">♙</span>
                  Password
                </label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    name="shopnexa-login-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* REMEMBER + FORGOT */}
              <div className="login-options">
                <label className="remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-link"
                >
                  Forgot password?
                </Link>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <p
                  className="login-alert error-alert"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                className="signin-button"
                disabled={loading}
              >
                <span>
                  {loading ? "Signing in..." : "Sign In"}
                </span>
                <span className="signin-arrow">→</span>
              </button>
            </form>

            {/* DIVIDER */}
            <div className="login-divider">
              <span />
              <p>OR CONTINUE WITH</p>
              <span />
            </div>

            {/* SOCIAL LOGIN */}
            <div className="social-login">
              <button
                type="button"
                className="social-button"
                onClick={() =>
                  setError("Google login needs authentication setup.")
                }
              >
                <span className="google-symbol">G</span>
                Continue with Google
              </button>

              <button
                type="button"
                className="social-button"
                onClick={() =>
                  setError("Phone login needs authentication setup.")
                }
              >
                <span className="phone-symbol">☎</span>
                Continue with Phone
              </button>
            </div>

            {/* SIGN UP */}
            <p className="signup-text">
              Don't have an account?
              <Link to="/register">Sign up</Link>
            </p>
          </div>

          {/* FOOTER */}
          <footer className="login-footer">
            <span>© 2026 ShopNexa. All rights reserved.</span>
          </footer>
        </div>

        {/* RIGHT FASHION BANNER */}
        <aside className="login-banner">
          <img
            className="banner-image"
            src="https://shopxnow.in/wp-content/uploads/2026/05/9-1.jpg"
            alt="ShopNexa fashion collection"
          />

          <div className="banner-overlay" />

          <div className="banner-decoration banner-decoration-one" />
          <div className="banner-decoration banner-decoration-two" />

          <div className="banner-top-tag">
            THE NEXT IN FASHION
          </div>

          {/* BANNER TEXT */}
          <div className="banner-content">
            <p className="banner-kicker">
              YOUR STYLE. YOUR STORY.
            </p>

            <div className="banner-gold-line" />

            <h2>
              Discover a
              <br />
              world of
              <br />
              <span>possibilities.</span>
            </h2>

            <p className="banner-description">
              Explore styles you love, find your next
              favourite, and make every look your own.
            </p>
          </div>

          {/* BENEFITS */}
          <div className="banner-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">♧</div>
              <span>
                Fast
                <br />
                Delivery
              </span>
            </div>

            <div className="benefit-divider" />

            <div className="benefit-item">
              <div className="benefit-icon">♢</div>
              <span>
                Secure
                <br />
                Payments
              </span>
            </div>

            <div className="benefit-divider" />

            <div className="benefit-item">
              <div className="benefit-icon">◇</div>
              <span>
                Easy
                <br />
                Returns
              </span>
            </div>
          </div>

          <div className="banner-bottom-curve" />

          <div className="banner-dots">
            <span className="active-dot" />
            <span />
            <span />
          </div>
        </aside>
      </section>
    </main>
  );
}
