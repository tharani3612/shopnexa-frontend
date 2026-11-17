
import { Link } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import "./RefundPolicy.css";
import "../InfoPage.css";
function RefundPolicy() {
  return (
    <main className="info-page refund-page">
      <div className="info-container">
        <Link to="/" className="info-back">
          <FiArrowLeft /> Back to Home
        </Link>

        <header className="info-header">
          <span>SHOP WITH CONFIDENCE</span>
          <h1>Refund & Return Policy</h1>
          <p>Important information about return and refund requests.</p>
        </header>

        <article className="refund-content">
          <div className="refund-intro">
            <FiRefreshCw />
            <p>
              Customer satisfaction is important to ShopNexa.
              This page explains the general process for requesting
              a return or refund. Final eligibility depends on the
              applicable product and order conditions.
            </p>
          </div>

          <section>
            <h2>1. Return Eligibility</h2>
            <p>
              Products may be considered for return if they meet the
              applicable return conditions. Eligibility may depend on
              product type, condition and the reason for the request.
            </p>
          </section>

          <section>
            <h2>2. Damaged or Incorrect Products</h2>
            <p>
              If you receive a damaged, defective or incorrect product,
              contact our support team with your order ID and a clear
              description of the issue. Supporting photographs may
              be requested.
            </p>
          </section>

          <section>
            <h2>3. How to Request a Return</h2>
            <ol>
              <li>Open the My Orders page after logging in.</li>
              <li>Keep your order ID ready.</li>
              <li>Contact our support team with the issue details.</li>
              <li>Wait for confirmation and further instructions.</li>
            </ol>
          </section>

          <section>
            <h2>4. Refund Approval</h2>
            <p>
              Refund requests will be reviewed before approval.
              A refund is not guaranteed until the request has
              been checked and approved under the applicable policy.
            </p>
          </section>

          <section>
            <h2>5. Refund Method</h2>
            <p>
              If a refund is approved, the available refund method
              and next steps will be communicated by our support team.
              The method may depend on the original payment method
              and order circumstances.
            </p>
          </section>

          <section>
            <h2>6. Order Cancellation</h2>
            <p>
              Cancellation requests depend on the order's processing
              and delivery status. Contact support as soon as possible
              if you want to request cancellation.
            </p>
          </section>

          <section>
            <h2>7. Need Help?</h2>
            <p>
              For return, cancellation or refund-related questions,
              please visit our{" "}
              <Link to="/contact">Contact Us</Link> page.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}

export default RefundPolicy;
