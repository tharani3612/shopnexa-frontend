
import { Link } from "react-router-dom";
import { FiArrowLeft, FiFileText } from "react-icons/fi";
import "./Terms.css";
import "../InfoPage.css";
function Terms() {
  return (
    <main className="info-page terms-page">
      <div className="info-container">
        <Link to="/" className="info-back">
          <FiArrowLeft /> Back to Home
        </Link>

        <header className="info-header">
          <span>SHOPNEXA GUIDELINES</span>
          <h1>Terms & Conditions</h1>
          <p>Please read these terms before using our website.</p>
        </header>

        <article className="terms-content">
          <div className="terms-intro">
            <FiFileText />
            <p>
              By accessing or using the ShopNexa website, you agree to
              follow the terms described on this page. If you do not
              agree, please discontinue using the website.
            </p>
          </div>

          <section>
            <h2>1. Website Usage</h2>
            <p>
              You agree to use ShopNexa only for lawful purposes and
              in a way that does not harm the website, its users or
              its services.
            </p>
          </section>

          <section>
            <h2>2. Customer Accounts</h2>
            <p>
              You are responsible for providing accurate information
              when creating an account and for keeping your login
              credentials secure.
            </p>
          </section>

          <section>
            <h2>3. Product Information</h2>
            <p>
              We aim to display product descriptions, images and prices
              accurately. Product availability and displayed information
              may change without prior notice.
            </p>
          </section>

          <section>
            <h2>4. Orders and Payments</h2>
            <p>
              Placing an order is a request to purchase the selected
              products. Order confirmation and available payment options
              will be communicated through the website.
            </p>
          </section>

          <section>
            <h2>5. Pricing and Availability</h2>
            <p>
              Product prices, offers and availability may be updated.
              Any applicable charges should be shown during checkout
              before you confirm your order.
            </p>
          </section>

          <section>
            <h2>6. Returns and Refunds</h2>
            <p>
              Return and refund requests are subject to the applicable
              ShopNexa return and refund policy.
              Please read our{" "}
              <Link to="/refund-policy">Refund Policy</Link>.
            </p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>
              Website content, branding, graphics and design elements
              may be protected by applicable intellectual property laws.
              They should not be copied or reused without permission.
            </p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              To the extent permitted by applicable law, ShopNexa is
              not responsible for indirect losses arising from the use
              of the website or temporary service interruptions.
            </p>
          </section>

          <section>
            <h2>9. Changes to These Terms</h2>
            <p>
              ShopNexa may update these terms when necessary.
              Continued use of the website after changes are published
              may be subject to the updated terms.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              If you have questions about these terms, please{" "}
              <Link to="/contact">contact our support team</Link>.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}

export default Terms;
