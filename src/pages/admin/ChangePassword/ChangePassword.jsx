
import { useState } from "react";

import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiSave,
  FiRefreshCw,
} from "react-icons/fi";

import "./ChangePassword.css";

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Password validation
  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: formData.newPassword.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(formData.newPassword),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(formData.newPassword),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(formData.newPassword),
    },
    {
      label: "One special character",
      valid: /[^A-Za-z0-9]/.test(formData.newPassword),
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      setMessage("Please enter your current password.");
      setMessageType("error");
      return;
    }

    if (passwordRules.some((rule) => !rule.valid)) {
      setMessage("Please meet all password requirements.");
      setMessageType("error");
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      setMessage("New password must be different from current password.");
      setMessageType("error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New password and confirm password do not match.");
      setMessageType("error");
      return;
    }

    // Frontend validation only.
    // Real password update must be handled by a secure backend API.
    setMessage(
      "Validation successful. Connect your backend API to update the password."
    );
    setMessageType("success");

    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleReset = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setMessage("");
    setMessageType("");
  };

  const renderPasswordField = (
    label,
    name,
    placeholder,
    fieldKey
  ) => (
    <div className="password-field">

      <label htmlFor={name}>
        <FiLock />
        {label}
      </label>

      <div className="password-input-wrapper">

        <input
          id={name}
          type={showPasswords[fieldKey] ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <button
          type="button"
          className="password-eye-btn"
          onClick={() => togglePassword(fieldKey)}
          aria-label={
            showPasswords[fieldKey]
              ? "Hide password"
              : "Show password"
          }
        >
          {showPasswords[fieldKey] ? <FiEyeOff /> : <FiEye />}
        </button>

      </div>

    </div>
  );

  return (
    <div className="change-password-page">

      {/* Page Header */}
      <div className="change-password-header">
        <h1>Change Password</h1>
        <p>Update your administrator account password.</p>
      </div>

      {/* Password Card */}
      <div className="change-password-card">

        <div className="change-password-card-header">
          <div className="change-password-icon">
            <FiShield />
          </div>

          <div>
            <h2>Security Information</h2>
            <p>
              Choose a strong password to protect your
              administrator account.
            </p>
          </div>
        </div>

        <div className="password-divider"></div>

        <form onSubmit={handleSubmit} autoComplete="off">

          {/* Current Password */}
          {renderPasswordField(
            "Current Password",
            "currentPassword",
            "Enter current password",
            "current"
          )}

          {/* New Password */}
          {renderPasswordField(
            "New Password",
            "newPassword",
            "Enter new password",
            "new"
          )}

          {/* Confirm Password */}
          {renderPasswordField(
            "Confirm New Password",
            "confirmPassword",
            "Confirm new password",
            "confirm"
          )}

          {/* Password Requirements */}
          <div className="password-requirements">

            <h3>Password Requirements</h3>

            {passwordRules.map((rule) => (
              <div
                className={`password-rule ${
                  rule.valid ? "valid" : ""
                }`}
                key={rule.label}
              >
                {rule.valid ? <FiCheckCircle /> : <FiXCircle />}
                <span>{rule.label}</span>
              </div>
            ))}

          </div>

          {/* Message */}
          {message && (
            <div
              className={`password-message ${messageType}`}
              role="status"
            >
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="change-password-actions">

            <button
              type="button"
              className="password-reset-btn"
              onClick={handleReset}
            >
              <FiRefreshCw />
              Clear
            </button>

            <button
              type="submit"
              className="password-submit-btn"
            >
              <FiSave />
              Update Password
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ChangePassword;
