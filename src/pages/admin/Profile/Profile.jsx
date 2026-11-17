
import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiEdit2,
  FiSave,
  FiX,
} from "react-icons/fi";

import "./Profile.css";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
};

function Profile() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("shopnexa_admin_profile");
      return saved ? { ...emptyProfile, ...JSON.parse(saved) } : emptyProfile;
    } catch {
      return emptyProfile;
    }
  });

  const [formData, setFormData] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
    setMessage("");
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedProfile = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    setProfile(updatedProfile);
    localStorage.setItem(
      "shopnexa_admin_profile",
      JSON.stringify(updatedProfile)
    );

    setIsEditing(false);
    setMessage("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    setMessage("");
  };

  return (
    <div className="profile-page">

      {/* Page Header */}
      <div className="profile-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your administrator profile information.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">

        {/* Profile Overview */}
        <div className="profile-overview">

          <div className="profile-avatar">
            <FiUser />
          </div>

          <div className="profile-overview-info">
            <h2>{profile.name || "Admin User"}</h2>
            <p>Administrator</p>

            <span className="profile-status">
              <span className="status-dot"></span>
              Active Account
            </span>
          </div>

          {!isEditing && (
            <button
              type="button"
              className="profile-edit-btn"
              onClick={handleEdit}
            >
              <FiEdit2 />
              Edit Profile
            </button>
          )}

        </div>

        <div className="profile-divider"></div>

        {/* Personal Information */}
        <div className="profile-section-heading">
          <h3>Personal Information</h3>
          <p>View and update your administrator details.</p>
        </div>

        <form onSubmit={handleSave} autoComplete="off">

          <div className="profile-fields-grid">

            {/* Full Name */}
            <div className="profile-field">
              <label htmlFor="profileName">
                <FiUser /> Full Name
              </label>

              {isEditing ? (
                <input
                  id="profileName"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="profile-value">
                  {profile.name || "Not provided"}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="profile-field">
              <label htmlFor="profileEmail">
                <FiMail /> Email Address
              </label>

              {isEditing ? (
                <input
                  id="profileEmail"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="profile-value">
                  {profile.email || "Not provided"}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="profile-field">
              <label htmlFor="profilePhone">
                <FiPhone /> Phone Number
              </label>

              {isEditing ? (
                <input
                  id="profilePhone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              ) : (
                <div className="profile-value">
                  {profile.phone || "Not provided"}
                </div>
              )}
            </div>

            {/* Role */}
            <div className="profile-field">
              <label>
                <FiShield /> Account Role
              </label>

              <div className="profile-value role-value">
                Administrator
              </div>
            </div>

          </div>

          {/* Message */}
          {message && (
            <div className="profile-success-message">
              {message}
            </div>
          )}

          {/* Edit Actions */}
          {isEditing && (
            <div className="profile-actions">

              <button
                type="button"
                className="profile-cancel-btn"
                onClick={handleCancel}
              >
                <FiX />
                Cancel
              </button>

              <button
                type="submit"
                className="profile-save-btn"
              >
                <FiSave />
                Save Changes
              </button>

            </div>
          )}

        </form>

      </div>

    </div>
  );
}

export default Profile;
