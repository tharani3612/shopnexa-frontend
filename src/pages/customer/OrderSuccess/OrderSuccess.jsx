
import { Link, useLocation, Navigate } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/products" replace />;
  }

  // Format price
  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  // Backend order ID
  const orderId = order._id || "Order";

  // Backend order date
  const orderDate = (() => {
    const date = new Date(order.createdAt || Date.now());

    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  })();

  // Backend order items
  const items = Array.isArray(order.items) ? order.items : [];

  // Backend shipping address
  const address = order.shippingAddress;

  // Total quantity
  const totalItems = Number(
    order.totalItems ||
    items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    )
  );

  // Order status
  const orderStatus = order.orderStatus || "Placed";

  return (
    <main className="order-success-page">
      <section className="success-card">

        {/* SUCCESS ICON */}
        <div className="success-icon">
          <svg
            viewBox="0 0 64 64"
            role="img"
            aria-label="Order successful"
          >
            <circle cx="32" cy="32" r="29" />
            <path d="M18 32 L27 41 L46 22" />
          </svg>
        </div>

        <p className="success-eyebrow">SHOPNEXA</p>

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Thank you for shopping with us.
          Your order has been placed successfully.
        </p>

        {/* ORDER ID */}
        <div className="success-order-id">
          <span>ORDER ID</span>

          <strong>{orderId}</strong>

          <span className="success-status">
            {orderStatus}
          </span>
        </div>

        {/* ORDER INFORMATION */}
        <div className="success-info-grid">

          <div className="success-info-item">
            <span>Order Date</span>
            <strong>{orderDate}</strong>
          </div>

          <div className="success-info-item">
            <span>Payment Method</span>
            <strong>
              {order.paymentMethod === "ONLINE"
                ? "Online Payment"
                : "Cash on Delivery"}
            </strong>
          </div>

          <div className="success-info-item">
            <span>Total Amount</span>
            <strong className="success-total">
              {formatPrice(order.totalPrice)}
            </strong>
          </div>

          <div className="success-info-item">
            <span>Items Ordered</span>
            <strong>{totalItems}</strong>
          </div>

        </div>

        {/* PAYMENT STATUS */}
        <div className="success-payment-status">
          <span>Payment Status</span>

          <strong>
            {order.paymentStatus || "Pending"}
          </strong>
        </div>

        {/* DELIVERY ADDRESS */}
        {address && (
          <div className="success-delivery">

            <div className="success-delivery-icon">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 7h11v11H3z" />
                <path d="M14 11h4l3 3v4h-7z" />
                <circle cx="7.5" cy="19" r="1.5" />
                <circle cx="17.5" cy="19" r="1.5" />
              </svg>
            </div>

            <div>
              <h2>Delivery Address</h2>

              <p>{address.fullName}</p>
              <p>{address.address}</p>
              <p>
                {address.city}, {address.state}
              </p>
              <p>Pincode: {address.pincode}</p>
              <p>Phone: {address.phone}</p>
            </div>

          </div>
        )}

        {/* ORDER SUMMARY */}
        <div className="success-products">

          <h2>Order Summary</h2>

          {items.map((item, index) => {

            const quantity = Number(item.quantity || 1);

            return (
              <div
                className="success-product"
                key={item._id || `${orderId}-${index}`}
              >

                <div className="success-product-image">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || "Product"}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>

                <div className="success-product-info">
                  <strong>
                    {item.name || "Product"}
                  </strong>

                  <span>Qty: {quantity}</span>
                </div>

                <strong>
                  {formatPrice(item.subtotal)}
                </strong>

              </div>
            );
          })}

        </div>

        {/* TOTAL */}
        <div className="success-final-total">
          <span>Grand Total</span>
          <strong>{formatPrice(order.totalPrice)}</strong>
        </div>

        {/* ACTION BUTTONS */}
        <div className="success-actions">

          <Link
            to="/products"
            className="success-primary-btn"
          >
            CONTINUE SHOPPING
          </Link>

          <Link
            to="/orders"
            className="success-secondary-btn"
          >
            VIEW MY ORDERS
          </Link>

        </div>

        <p className="success-footer-note">
          Thank you for choosing ShopNexa.
        </p>

      </section>
    </main>
  );
}

export default OrderSuccess;
