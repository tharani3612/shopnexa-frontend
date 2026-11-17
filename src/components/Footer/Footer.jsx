
import { Link } from "react-router-dom";
import {
  FiGrid,
  FiHeadphones,
  FiSend,
  FiMapPin,
  FiMail,
  FiClock,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiLinkedin,
  FiArrowUpRight,
  FiShoppingBag,
} from "react-icons/fi";
import "./Footer.css";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Shop All", to: "/products" },
  { label: "Electronics", to: "/products?category=electronics" },
  { label: "Fashion", to: "/products?category=fashion" },
  { label: "Home & Living", to: "/products?category=home" },
];

const serviceLinks = [
  { label: "Track Order", to: "/orders" },
  { label: "Shopping Cart", to: "/cart" },
  { label: "My Account", to: "/login" },
  { label: "Contact Us", to: "/contact" },
  { label: "FAQs", to: "/faq" },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sn-footer">
      <div className="sn-footer-decoration sn-decoration-top" />
      <div className="sn-footer-decoration sn-decoration-bottom" />

      <div className="sn-footer-main">
        {/* Brand */}
        <section className="sn-footer-brand">
          <Link to="/" className="sn-footer-logo">
            <span className="sn-logo-symbol">S</span>
            <span className="sn-logo-text">
              Shop<span>Nexa</span>
            </span>
          </Link>

          <p className="sn-footer-description">
            Your one-stop destination for smart shopping.
            Discover quality products, amazing prices and
            a shopping experience you'll love.
          </p>

          <div className="sn-footer-socials">
            <a href="https://www.instagram.com/" target="_blank"
              rel="noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="https://www.facebook.com/" target="_blank"
              rel="noreferrer" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="https://www.youtube.com/" target="_blank"
              rel="noreferrer" aria-label="YouTube">
              <FiYoutube />
            </a>
            <a href="https://www.linkedin.com/" target="_blank"
              rel="noreferrer" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
          </div>

          <div className="sn-footer-tagline">
            <span className="sn-tagline-bag">
              <FiShoppingBag />
            </span>
            <span>SHOP YOUR STYLE</span>
          </div>
        </section>

        {/* Quick Links */}
        <section className="sn-footer-column">
          <h3>
            <FiGrid className="sn-heading-icon" />
            <span>Quick Links</span>
          </h3>

          <div className="sn-heading-line" />

          <nav className="sn-footer-links">
            {quickLinks.map((item) => (
              <Link to={item.to} key={item.label}>
                {item.label}
                <FiArrowUpRight />
              </Link>
            ))}
          </nav>
        </section>

        {/* Customer Service */}
        <section className="sn-footer-column">
          <h3>
            <FiHeadphones className="sn-heading-icon" />
            <span>Customer Service</span>
          </h3>

          <div className="sn-heading-line" />

          <nav className="sn-footer-links">
            {serviceLinks.map((item) => (
              <Link to={item.to} key={item.label}>
                {item.label}
                <FiArrowUpRight />
              </Link>
            ))}
          </nav>
        </section>

        {/* Contact */}
        <section className="sn-footer-column sn-footer-contact">
          <h3>
            <FiSend className="sn-heading-icon" />
            <span>Get in Touch</span>
          </h3>

          <div className="sn-heading-line" />

          <div className="sn-contact-list">
            <p>
              <span className="sn-contact-icon"><FiMapPin /></span>
              <span>Tamil Nadu, India</span>
            </p>

            <p>
              <span className="sn-contact-icon"><FiMail /></span>
              <span>support@shopnexa.example</span>
            </p>

            <p>
              <span className="sn-contact-icon"><FiClock /></span>
              <span>Mon – Sat, 9 AM – 6 PM</span>
            </p>
          </div>

          <div className="sn-payment-section">
            <h4>We Accept</h4>

            <div className="sn-payment-methods">
              <div className="sn-payment-card sn-upi">
                <span className="sn-upi-symbol">UPI</span>
                <span className="sn-upi-arrows">➜</span>
              </div>

              <div className="sn-payment-card sn-visa">
                VISA
              </div>

              <div
                className="sn-payment-card sn-mastercard"
                aria-label="Mastercard"
                title="Mastercard"
              >
                <span />
                <span />
              </div>

              <div className="sn-payment-card sn-rupay">
                <span>Ru</span><span>Pay</span>
              </div>

              <div className="sn-payment-card sn-cod">
                COD
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Bar */}
      <div className="sn-footer-bottom">
        <p className="sn-copyright">
          © {currentYear} <strong>ShopNexa.</strong> All rights reserved.
        </p>

        <nav className="sn-footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </nav>

        <p className="sn-footer-made">
          Made with <span>♥</span> in India
        </p>
      </div>
    </footer>
  );
}

export default Footer;
