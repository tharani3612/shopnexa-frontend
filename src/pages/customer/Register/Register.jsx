
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        const cleanName = form.name.trim();
        const cleanEmail = form.email.trim().toLowerCase();
        const cleanPhone = form.phone.trim();

        if (
            !cleanName ||
            !cleanEmail ||
            !cleanPhone ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!/^[0-9]{10}$/.test(cleanPhone)) {
            setError("Enter a valid 10-digit phone number.");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!acceptedTerms) {
            setError("Please accept the Terms and Conditions.");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post(
                "/customer/auth/register",
                {
                    name: cleanName,
                    email: cleanEmail,
                    phone: cleanPhone,
                    password: form.password
                }
            );

            if (response.data.success) {
                setMessage(
                    "Account created successfully! Redirecting to login..."
                );

                setForm({
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: ""
                });

                setAcceptedTerms(false);

                setTimeout(() => {
                    navigate("/login", {
                        state: {
                            message: "Registration successful! Please sign in."
                        }
                    });
                }, 1200);
            } else {
                setError(
                    response.data.message || "Registration failed."
                );
            }

        } catch (err) {
            console.error("Registration Error:", err);

            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page">
            <section className="register-card">

                <div className="register-panel">

                    <Link to="/" className="register-logo">
                        <span className="register-logo-mark">S</span>
                        <span>
                            Shop<span className="register-logo-highlight">
                                Nexa
                            </span>
                        </span>
                    </Link>

                    <div className="register-content">

                        <div className="register-heading">
                            <p className="register-eyebrow">
                                JOIN SHOPNEXA
                            </p>

                            <h1>Create your account</h1>

                            <p className="register-description">
                                Discover your style. Create an account and
                                make your next shopping experience special.
                            </p>
                        </div>

                        <form
                            className="register-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="register-form-group">
                                <label htmlFor="register-name">
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    id="register-name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="register-email">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    id="register-email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="register-phone">
                                    Phone number
                                </label>

                                <input
                                    type="tel"
                                    id="register-phone"
                                    name="phone"
                                    placeholder="10-digit mobile number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    required
                                />
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="register-password">
                                    Password
                                </label>

                                <div className="register-password-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="register-password"
                                        name="password"
                                        placeholder="Minimum 8 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="register-password-toggle"
                                        onClick={() =>
                                            setShowPassword(prev => !prev)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="register-confirm-password">
                                    Confirm password
                                </label>

                                <div className="register-password-wrapper">
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        id="register-confirm-password"
                                        name="confirmPassword"
                                        placeholder="Re-enter your password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="register-password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(prev => !prev)
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide confirm password"
                                                : "Show confirm password"
                                        }
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <label className="register-terms">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) =>
                                        setAcceptedTerms(e.target.checked)
                                    }
                                />

                                <span>
                                    I agree to the{" "}
                                    <Link to="/terms">
                                        Terms and Conditions
                                    </Link>
                                    {" "}and{" "}
                                    <Link to="/privacy">
                                        Privacy Policy
                                    </Link>.
                                </span>
                            </label>

                            {error && (
                                <p
                                    className="register-alert register-error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )}

                            {message && (
                                <p
                                    className="register-alert register-success"
                                    role="status"
                                >
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="register-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}

                                <span>→</span>
                            </button>

                        </form>

                        <p className="register-login-text">
                            Already have an account?{" "}
                            <Link to="/login">Sign in</Link>
                        </p>

                        <div className="register-security-note">
                            <span aria-hidden="true">✦</span>
                            Your shopping journey starts here.
                        </div>

                    </div>

                    <footer className="register-footer">
                        © 2026 ShopNexa
                    </footer>

                </div>

                <aside className="register-banner">

                    <img
                        className="register-banner-image"
                        src="https://media.voguearabia.com/photos/6942597d9813f670894e0551/2:3/w_2560%2Cc_limit/GettyImages-2250748211.jpg"
                        alt="Fashion shopping experience"
                    />

                    <div className="register-banner-overlay" />

                    <div className="register-banner-tag">
                        <span className="register-banner-dot" />
                        STYLE STARTS HERE
                    </div>

                    <div className="register-banner-content">
                        <p className="register-banner-kicker">
                            MORE THAN JUST SHOPPING
                        </p>

                        <h2>
                            Find your
                            <br />
                            style. Make it
                            <br />
                            <span>your own.</span>
                        </h2>

                        <p className="register-banner-description">
                            Explore fresh finds, discover everyday favourites,
                            and bring your personal style to life.
                        </p>

                        <Link
                            to="/products"
                            className="register-banner-link"
                        >
                            Explore collection <span>↗</span>
                        </Link>
                    </div>

                    <div className="register-banner-bottom">
                        <div className="register-banner-avatar">S</div>

                        <div>
                            <p className="register-banner-bottom-title">
                                Welcome to ShopNexa
                            </p>

                            <p className="register-banner-bottom-subtitle">
                                Your style, your story.
                            </p>
                        </div>
                    </div>

                </aside>

            </section>
        </main>
    );
}
