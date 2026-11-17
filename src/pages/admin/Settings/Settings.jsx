import { useState } from "react";
import { FiSave, FiRefreshCw, FiSettings } from "react-icons/fi";
import "./Settings.css";

const emptySettings = {
  storeName: "",
  email: "",
  phone: "",
  address: "",
  currency: "INR",
  description: "",
};

function Settings() {
  const [settings, setSettings] = useState(emptySettings);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  // Save settings
  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "shopnexa_settings",
      JSON.stringify(settings)
    );

    setMessage("Settings saved successfully!");
  };

  // Reset all settings
  const handleReset = () => {
    setSettings({
      ...emptySettings,
    });

    localStorage.removeItem("shopnexa_settings");

    setMessage("All settings cleared successfully!");
  };

  return (
    <div className="settings-container">

      {/* Page Header */}
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your ShopNexa store information.</p>
        </div>
      </div>

      {/* Store Information Card */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-title">
            <FiSettings />
            <h2>Store Information</h2>
          </div>

          <p>Enter your store details below.</p>
        </div>

        <form
          className="settings-form"
          onSubmit={handleSave}
          autoComplete="off"
        >

          {/* Store Name */}
          <div className="settings-form-grid">

            <div className="settings-field">
              <label htmlFor="storeName">
                Store Name
              </label>

              <input
                type="text"
                id="storeName"
                name="storeName"
                placeholder="Enter store name"
                value={settings.storeName}
                autoComplete="off"
                onChange={handleChange}
              />
            </div>

            {/* Store Email */}
            <div className="settings-field">
              <label htmlFor="email">
                Store Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter store email"
                value={settings.email}
                autoComplete="off"
                onChange={handleChange}
              />
            </div>

            {/* Phone Number */}
            <div className="settings-field">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={settings.phone}
                autoComplete="off"
                onChange={handleChange}
              />
            </div>

            {/* Currency */}
            <div className="settings-field">
              <label htmlFor="currency">
                Currency
              </label>

              <select
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={handleChange}
              >
                <option value="INR">
                  INR - Indian Rupee (₹)
                </option>

                <option value="USD">
                  USD - US Dollar ($)
                </option>

                <option value="EUR">
                  EUR - Euro (€)
                </option>

                <option value="GBP">
                  GBP - British Pound (£)
                </option>
              </select>
            </div>

          </div>

          {/* Store Address */}
          <div className="settings-field full-width">
            <label htmlFor="address">
              Store Address
            </label>

            <textarea
              id="address"
              name="address"
              placeholder="Enter store address"
              value={settings.address}
              autoComplete="off"
              rows="3"
              onChange={handleChange}
            />
          </div>

          {/* Store Description */}
          <div className="settings-field full-width">
            <label htmlFor="description">
              Store Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Enter store description"
              value={settings.description}
              autoComplete="off"
              rows="3"
              onChange={handleChange}
            />
          </div>

          {/* Success Message */}
          {message && (
            <div className="settings-message">
              {message}
            </div>
          )}

          {/* Buttons */}
          <div className="settings-actions">

            <button
              type="button"
              className="settings-reset-btn"
              onClick={handleReset}
            >
              <FiRefreshCw />
              Reset
            </button>

            <button
              type="submit"
              className="settings-save-btn"
            >
              <FiSave />
              Save Settings
            </button>

          </div>

        </form>
      </div>

    </div>
  );
}

export default Settings;