
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../services/api";
import "./AdminLogin.css";

const ADMIN_IMAGE =
  "https://img.magnific.com/premium-vector/standing-man-suit-businessman-suit-tie-illustration_591091-771.jpg?semt=ais_hybrid&w=740&q=80";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
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

      const response = await API.post("/admin/login", {
        email: cleanEmail,
        password,
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Admin login failed.");
      }

      const token = data.token || data.adminToken;
      const admin = data.admin || data.user;

      if (!token) {
        throw new Error("Authentication token not received.");
      }

      localStorage.setItem("adminToken", token);

      if (admin) {
        localStorage.setItem("admin", JSON.stringify(admin));
      }

      const redirectPath =
        location.state?.from?.pathname || "/admin";

      navigate(redirectPath, { replace: true });

    } catch (err) {
      console.error("Admin Login Error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">

        {/* LEFT IMAGE PANEL */}
        <aside className="admin-login-left">

          <img
            src={ADMIN_IMAGE}
            alt="Businessman managing ShopNexa store"
            className="admin-illustration"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          <div className="admin-image-text">
            <h2>Manage Your Store</h2>
            <p>
              Everything you need to manage your business
              in one place.
            </p>
          </div>

        </aside>

        {/* RIGHT LOGIN PANEL */}
        <section className="admin-login-right">

          <div className="admin-login-logo">
            <div className="admin-logo-icon">🛒</div>

            <div className="admin-logo-text">
              <h2>
                Shop<span>Nexa</span>
              </h2>
              <p>ADMIN PANEL</p>
            </div>
          </div>

          <div className="admin-login-heading">
            <span className="admin-welcome-tag">
              WELCOME BACK
            </span>

            <h1>
              ShopNexa <span>Admin</span>
            </h1>

            <p>Login to access your dashboard</p>
          </div>

          <form
            className="admin-login-form"
            onSubmit={handleLogin}
            autoComplete="off"
          >

            {/* EMAIL */}
            <div className="admin-field">
              <label htmlFor="admin-email">
                Email Address
              </label>

              <div className="admin-input-group">
                <span className="admin-input-icon">✉</span>

                <input
                  id="admin-email"
                  name="admin-login-email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  spellCheck="false"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="admin-field">
              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-input-group">
                <span className="admin-input-icon">🔒</span>

                <input
                  id="admin-password"
                  name="admin-login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="admin-password-toggle"
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

            {/* ERROR */}
            {error && (
              <p className="admin-login-error" role="alert">
                {error}
              </p>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              <span className="admin-login-arrow">↪</span>
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="admin-login-footer">
            <span className="admin-footer-line" />

            <p>
              <span className="admin-shield">♡</span>
              Secure Admin Access
            </p>

            <span className="admin-footer-line" />
          </div>

          <p className="admin-copyright">
            © 2026 ShopNexa. All rights reserved.
          </p>

        </section>
      </section>
    </main>
  );
}

export default AdminLogin;
