import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../../services/api";
import "./OrderDetails.css";

// Order tracking stages
const trackingSteps = [
  "Order Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const statusIndexes = {
  Placed: 0,
  Pending: 0,
  Confirmed: 1,
  Processing: 1,
  Packed: 2,
  Shipped: 3,
  "Out for Delivery": 4,
  Delivered: 5,
};

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch order details from backend
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/customer/orders/${orderId}`
        );

        const data = response.data.order;

        if (!data) {
          setOrder(null);
          return;
        }

        setOrder(data);
      } catch (err) {
        console.error("Order Details Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load order details. Please try again."
        );

        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Loading screen
  if (loading) {
    return (
      <main className="od-page">
        <div className="od-container od-message">
          <div className="od-loader"></div>
          <p>Loading order details...</p>
        </div>
      </main>
    );
  }

  // Error or order not found
  if (error || !order) {
    return (
      <main className="od-page">
        <div className="od-container od-not-found">
          <div className="od-not-found-icon">📦</div>

          <span className="od-eyebrow">
            SHOPNEXA ORDERS
          </span>

          <h1>
            {error ? "Unable to load order" : "Order not found"}
          </h1>

          <p>
            {error ||
              "This order could not be found in your account."}
          </p>

          <Link to="/orders" className="od-primary-btn">
            ← Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  // Backend order data
  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const id = order._id || orderId;

  const status = order.orderStatus || "Placed";

  const currentStep = statusIndexes[status] ?? 0;

  const total = Number(order.totalPrice || 0);

  const totalItems = Number(
    order.totalItems ||
      items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      )
  );

  const subtotal = items.reduce((sum, item) => {
    return (
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0)
    );
  }, 0);

  const address = order.shippingAddress || {};

  const customerName = address.fullName || "";

  const phone = address.phone || "";

  const addressLines = [
    address.address,
    [address.city, address.state]
      .filter(Boolean)
      .join(", "),
    address.pincode ? `PIN: ${address.pincode}` : "",
  ].filter(Boolean);

  const paymentMethod =
    order.paymentMethod || "Not available";

  const paymentStatus =
    order.paymentStatus || "Pending";

  const orderDate = order.createdAt;

  const isCancelled = status === "Cancelled";

  const deliveryFee = Number(order.deliveryFee || 0);

  const discount = Number(order.discount || 0);

  return (
    <main className="od-page">
      <div className="od-container">

        {/* Breadcrumb */}
        <nav className="od-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/orders">My Orders</Link>
          <span>/</span>
          <span>Order Details</span>
        </nav>

        {/* Page Heading */}
        <header className="od-page-heading">
          <div>
            <span className="od-eyebrow">
              SHOPNEXA · ORDER MANAGEMENT
            </span>

            <h1>
              Order Details<span>.</span>
            </h1>

            <p>
              Review your purchase and delivery information.
            </p>
          </div>

          <Link to="/products" className="od-outline-btn">
            Continue Shopping <span>↗</span>
          </Link>
        </header>

        {/* Order Banner */}
        <section className="od-order-banner">
          <div className="od-banner-icon">▤</div>

          <div className="od-banner-main">
            <span>ORDER NUMBER</span>

            <h2>#{id}</h2>

            <p>
              Placed on {formatDate(orderDate)}
            </p>
          </div>

          <span
            className={`od-status od-status-${status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <span className="od-status-dot"></span>
            {status}
          </span>
        </section>

        {/* Order Tracking */}
        <section className="od-panel od-tracking-panel">
          <div className="od-section-heading">
            <div>
              <span className="od-section-label">
                DELIVERY UPDATES
              </span>

              <h2>Track your order</h2>

              <p>
                {isCancelled
                  ? "This order has been cancelled."
                  : status === "Delivered"
                    ? "Your order has been delivered."
                    : "Your order progress will appear here."}
              </p>
            </div>

            <div className="od-truck-icon">🚚</div>
          </div>

          {!isCancelled ? (
            <div className="od-timeline">
              {trackingSteps.map((step, index) => {
                const complete = index <= currentStep;

                return (
                  <div
                    key={step}
                    className={`od-timeline-step ${
                      complete ? "is-complete" : ""
                    } ${
                      index === currentStep
                        ? "is-current"
                        : ""
                    }`}
                  >
                    <div className="od-timeline-marker">
                      {complete ? "✓" : index + 1}
                    </div>

                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="od-cancelled-message">
              Your order is cancelled.
            </div>
          )}

          <p className="od-demo-note">
            Tracking is based on the order status saved by
            the backend. Live courier tracking is not
            connected yet.
          </p>
        </section>

        {/* Main Content */}
        <div className="od-content-grid">

          {/* Left Column */}
          <div className="od-main-column">

            {/* Products */}
            <section className="od-panel">
              <div className="od-panel-heading">
                <div>
                  <span className="od-section-label">
                    YOUR PURCHASE
                  </span>

                  <h2>Items in this order</h2>
                </div>

                <span className="od-item-count">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="od-empty-items">
                  Product details are unavailable.
                </div>
              ) : (
                <div className="od-items-list">
                  {items.map((item, index) => {
                    const quantity = Number(
                      item.quantity || 0
                    );

                    const itemTotal =
                      Number(item.price || 0) * quantity;

                    return (
                      <article
                        className="od-product"
                        key={`${item.product || item.name}-${index}`}
                      >
                        <div className="od-product-image-wrap">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name || "Product"}
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";

                                e.currentTarget.nextElementSibling.style.display =
                                  "flex";
                              }}
                            />
                          ) : null}

                          <div
                            className="od-image-placeholder"
                            style={{
                              display: item.image
                                ? "none"
                                : "flex",
                            }}
                          >
                            📦
                          </div>
                        </div>

                        <div className="od-product-info">
                          <span className="od-product-category">
                            SHOPNEXA COLLECTION
                          </span>

                          <h3>
                            {item.name || "Product"}
                          </h3>

                          <p>
                            Quantity: {quantity}
                          </p>

                          <span className="od-unit-price">
                            {formatPrice(item.price)} each
                          </span>
                        </div>

                        <strong className="od-product-total">
                          {formatPrice(itemTotal)}
                        </strong>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Delivery Address */}
            <section className="od-panel od-address-panel">
              <div className="od-panel-heading">
                <div>
                  <span className="od-section-label">
                    SHIPPING INFORMATION
                  </span>

                  <h2>Delivery address</h2>
                </div>

                <div className="od-small-icon">⌖</div>
              </div>

              <div className="od-address-content">
                <div className="od-address-pin">⌖</div>

                <div className="od-address-text">
                  <h3>
                    {customerName || "Delivery recipient"}
                  </h3>

                  {addressLines.length > 0 ? (
                    addressLines.map((line, index) => (
                      <p key={`${line}-${index}`}>
                        {line}
                      </p>
                    ))
                  ) : (
                    <p>Address details unavailable.</p>
                  )}

                  {phone && (
                    <p className="od-phone">
                      ☎ {phone}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <aside className="od-side-column">

            {/* Order Summary */}
            <section className="od-panel od-summary-panel">
              <span className="od-section-label">
                PAYMENT OVERVIEW
              </span>

              <h2>Order summary</h2>

              <div className="od-summary-row">
                <span>Items subtotal</span>
                <span>{formatPrice(subtotal || total)}</span>
              </div>

              <div className="od-summary-row">
                <span>Delivery fee</span>

                {deliveryFee === 0 ? (
                  <span className="od-free">FREE</span>
                ) : (
                  <span>{formatPrice(deliveryFee)}</span>
                )}
              </div>

              {discount > 0 && (
                <div className="od-summary-row">
                  <span>Discount</span>

                  <span className="od-discount">
                    −{formatPrice(discount)}
                  </span>
                </div>
              )}

              <div className="od-summary-total">
                <span>Total amount</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              {/* Payment Method */}
              <div className="od-payment-card">
                <div className="od-payment-icon">
                  ▣
                </div>

                <div>
                  <span>PAYMENT METHOD</span>

                  <strong>
                    {paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : paymentMethod}
                  </strong>
                </div>
              </div>

              {/* Payment Status */}
              <div className="od-payment-status">
                <span>Payment status</span>

                <strong>{paymentStatus}</strong>
              </div>

              <p className="od-payment-note">
                Payment information reflects the data saved
                when the order was placed.
              </p>
            </section>

            {/* Help Card */}
            <section className="od-help-card">
              <div className="od-help-icon">?</div>

              <h3>Need help with your order?</h3>

              <p>
                Return to your order history to view
                another purchase.
              </p>

              <Link
                to="/orders"
                className="od-help-link"
              >
                Visit My Orders <span>→</span>
              </Link>
            </section>
          </aside>
        </div>

        {/* Bottom Actions */}
        <div className="od-bottom-actions">
          <Link to="/orders" className="od-back-link">
            ← Back to My Orders
          </Link>

          <span>
            <span className="od-secure-icon">✓</span>
            Order information fetched from your account.
          </span>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;