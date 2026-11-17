
import { Link } from "react-router-dom";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import "./Privacy.css";
import "../InfoPage.css";
function Privacy() {
  return (
    <main className="info-page policy-page">
      <div className="info-container">
        <Link to="/" className="info-back">
          <FiArrowLeft /> Back to Home
        </Link>

        <header className="info-header">
          <span>YOUR PRIVACY MATTERS</span>
          <h1>Privacy Policy</h1>
          <p>How ShopNexa handles your information.</p>
        </header>

        <article className="policy-content">
          <div className="policy-intro">
            <FiShield />
            <p>
              ShopNexa respects your privacy. This page explains the types
              of information that may be collected when you use our website
              and how that information may be used.
            </p>
          </div>

          <section>
            <h2>1. Information We Collect</h2>
            <p>
              When you create an account or place an order, we may collect
              information such as your name, email address, phone number,
              delivery address and order details.
            </p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>Your information may be used to:</p>
            <ul>
              <li>Create and manage your customer account.</li>
              <li>Process and manage your orders.</li>
              <li>Provide order updates and customer support.</li>
              <li>Improve website performance and user experience.</li>
              <li>Protect the website against misuse and unauthorized access.</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Security</h2>
            <p>
              We take reasonable measures to protect customer information.
              However, no online platform can guarantee complete security
              of information transmitted over the internet.
            </p>
          </section>

          <section>
            <h2>4. Cookies and Website Data</h2>
            <p>
              Our website may use browser storage or similar technologies
              to support features such as login sessions, shopping cart
              functionality and user preferences.
            </p>
          </section>

          <section>
            <h2>5. Sharing of Information</h2>
            <p>
              Customer information should only be shared when necessary
              to operate the service, fulfill orders, provide support,
              comply with applicable law or protect the platform.
            </p>
          </section>

          <section>
            <h2>6. Your Choices</h2>
            <p>
              You may contact our support team if you want to ask about
              the personal information associated with your account or
              request assistance with account-related information.
            </p>
          </section>

          <section>
            <h2>7. Policy Updates</h2>
            <p>
              This policy may be updated when our website features,
              business practices or legal requirements change.
              Updated information will be published on this page.
            </p>
          </section>

          <section>
            <h2>8. Contact Us</h2>
            <p>
              For privacy-related questions, please visit our{" "}
              <Link to="/contact">Contact Us</Link> page.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}

export default Privacy;
