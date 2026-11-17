
import { Link } from "react-router-dom";
import { FiMail, FiMapPin, FiClock, FiArrowLeft } from "react-icons/fi";
import "./Contact.css";

function Contact() {
  return (
    <main className="info-page">
      <div className="info-container">
        <Link to="/" className="info-back">
          <FiArrowLeft /> Back to Home
        </Link>

        <div className="info-header">
          <span>WE ARE HERE TO HELP</span>
          <h1>Contact Us</h1>
          <p>Have a question? We'd love to hear from you.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <FiMail />
            <h3>Email Support</h3>
            <p>support@shopnexa.example</p>
          </div>

          <div className="contact-card">
            <FiMapPin />
            <h3>Our Location</h3>
            <p>Tamil Nadu, India</p>
          </div>

          <div className="contact-card">
            <FiClock />
            <h3>Working Hours</h3>
            <p>Monday – Saturday</p>
            <p>9 AM – 6 PM</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
