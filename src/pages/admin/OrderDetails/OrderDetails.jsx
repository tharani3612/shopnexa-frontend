
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  CalendarDays,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  IndianRupee,
} from "lucide-react";

import "./OrderDetails.css";

const API_URL = "http://https://shopnexa-backend-wjk6.onrender.com/api/admin/orders";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Placed");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // ======================================
  // FETCH SINGLE ORDER FROM MONGODB
  // ======================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin session not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch order.");
      }

      setOrder(data.order);
      setStatus(data.order.orderStatus || "Placed");

    } catch (err) {
      console.error("Fetch Order Error:", err);
      setError(err.message || "Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // ======================================
  // UPDATE ORDER STATUS
  // ======================================

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin session not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update order status.");
      }

      setOrder(data.order);
      setStatus(data.order.orderStatus);

      alert("Order status updated successfully!");

    } catch (err) {
      console.error("Update Order Error:", err);
      alert(err.message || "Unable to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  // ======================================
  // LOADING STATE
  // ======================================

  if (loading) {
    return (
      <div className="order-details-not-found">
        <Package size={45} />
        <h2>Loading Order Details...</h2>
        <p>Please wait while we fetch order information.</p>
      </div>
    );
  }

  // ======================================
  // ERROR / NOT FOUND
  // ======================================

  if (error || !order) {
    return (
      <div className="order-details-not-found">
        <Package size={55} />

        <h2>{error ? "Unable to Load Order" : "Order Not Found"}</h2>

        <p>
          {error || "The requested order could not be found."}
        </p>

        <button onClick={() => navigate("/admin/orders")}>
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        {error && (
          <button onClick={fetchOrder}>
            Retry
          </button>
        )}
      </div>
    );
  }

  // ======================================
  // ORDER DATA
  // ======================================

  const customerName =
    order.shippingAddress?.fullName ||
    order.user?.name ||
    order.user?.fullName ||
    "Guest";

  const customerEmail =
    order.user?.email || "Not available";

  const customerPhone =
    order.shippingAddress?.phone || "Not available";

  const address = [
    order.shippingAddress?.address,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.pincode,
  ]
    .filter(Boolean)
    .join(", ") || "Address not available";

  const items = Array.isArray(order.items) ? order.items : [];

  const getItemName = (item) => {
    return (
      item.name ||
      item.product?.name ||
      item.product?.title ||
      "Product"
    );
  };

  const getItemPrice = (item) => {
    return Number(item.price ?? item.product?.price ?? 0);
  };

  const getItemQuantity = (item) => {
    return Number(item.quantity ?? 1);
  };

  const getItemSubtotal = (item) => {
    return Number(
      item.subtotal ??
      getItemPrice(item) * getItemQuantity(item)
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + getItemSubtotal(item),
    0
  );

  const total = Number(order.totalPrice ?? subtotal);

  const orderDate = order.createdAt;

  const formattedDate = orderDate
    ? new Date(orderDate).toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not available";

  const orderId = order._id;

  // ======================================
  // ORDER STATUS TIMELINE
  // ======================================

  const statusSteps = [
    "Placed",
    "Confirmed",
    "Shipped",
    "Delivered",
  ];

  const statusIndex = statusSteps.indexOf(status);

  const getStatusClass = (value) => {
    return value.toLowerCase();
  };

  // ======================================
  // UI
  // ======================================

  return (
    <div className="order-details-page">

      {/* HEADER */}

      <motion.div
        className="order-details-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <button
            className="order-back-btn"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft size={19} />
            Back to Orders
          </button>

          <span className="order-details-subtitle">
            ORDER MANAGEMENT
          </span>

          <h1>Order Details</h1>

          <p>
            View complete information about this customer order.
          </p>
        </div>

        <div className="order-id-box">
          <ShoppingBag size={22} />
          <span>#{orderId}</span>
        </div>
      </motion.div>

      {/* ORDER SUMMARY */}

      <motion.div
        className="order-summary-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="summary-label">ORDER DATE</span>

          <h3>
            <CalendarDays size={19} />
            {formattedDate}
          </h3>
        </div>

        <div>
          <span className="summary-label">PAYMENT METHOD</span>

          <h3>
            <CreditCard size={19} />
            {order.paymentMethod || "Not available"}
          </h3>
        </div>

        <div>
          <span className="summary-label">ORDER TOTAL</span>

          <h3 className="summary-total">
            ₹{total.toLocaleString("en-IN")}
          </h3>
        </div>
      </motion.div>

      {/* ORDER TRACKING */}

      <motion.div
        className="order-status-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="details-section-heading">
          <div>
            <h2>Order Tracking</h2>
            <p>Current order delivery status</p>
          </div>

          <select
            value={status}
            disabled={updating}
            onChange={(e) => updateStatus(e.target.value)}
            className={`details-status-select ${getStatusClass(status)}`}
          >
            <option value="Placed">Placed</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {updating && (
          <p>Updating order status...</p>
        )}

        {status === "Cancelled" ? (
          <div className="cancelled-message">
            Order has been cancelled.
          </div>
        ) : (
          <div className="order-timeline">
            {statusSteps.map((step, index) => {
              const active = statusIndex >= index;

              const Icon = [
                Clock,
                Package,
                Truck,
                CheckCircle,
              ][index];

              return (
                <div
                  className={`timeline-step ${active ? "active" : ""}`}
                  key={step}
                >
                  <div className="timeline-icon">
                    <Icon size={20} />
                  </div>

                  <span>{step}</span>

                  {index !== statusSteps.length - 1 && (
                    <div className="timeline-line" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* MAIN CONTENT */}

      <div className="order-details-grid">

        {/* ORDERED PRODUCTS */}

        <motion.div
          className="order-products-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="details-section-heading">
            <div>
              <h2>Ordered Products</h2>
              <p>{items.length} product types</p>
            </div>

            <Package size={25} />
          </div>

          {items.length > 0 ? (
            <div className="ordered-products-list">
              {items.map((item, index) => {
                const name = getItemName(item);
                const price = getItemPrice(item);
                const quantity = getItemQuantity(item);
                const itemSubtotal = getItemSubtotal(item);

                return (
                  <div
                    className="ordered-product"
                    key={item._id || index}
                  >
                    <div className="ordered-product-image">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={name}
                        />
                      ) : (
                        <Package size={27} />
                      )}
                    </div>

                    <div className="ordered-product-info">
                      <h4>{name}</h4>
                      <p>Quantity: {quantity}</p>
                      <p>
                        ₹{price.toLocaleString("en-IN")} each
                      </p>
                    </div>

                    <strong>
                      ₹{itemSubtotal.toLocaleString("en-IN")}
                    </strong>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-products">
              No product information available.
            </p>
          )}

          {/* PRICE DETAILS */}

          <div className="order-price-details">
            <div>
              <span>Subtotal</span>
              <strong>
                ₹{subtotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Delivery</span>
              <strong>₹0</strong>
            </div>

            <div className="order-grand-total">
              <span>Total Amount</span>
              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        </motion.div>

        {/* CUSTOMER INFORMATION */}

        <div className="order-customer-details">

          <motion.div
            className="customer-details-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="details-section-heading">
              <div>
                <h2>Customer Details</h2>
                <p>Customer contact information</p>
              </div>

              <User size={24} />
            </div>

            <div className="customer-details-profile">
              <div className="customer-details-avatar">
                {String(customerName).charAt(0).toUpperCase() || "G"}
              </div>

              <h3>{customerName}</h3>
              <span>Customer</span>
            </div>

            <div className="customer-contact-info">
              <div>
                <span>Email</span>
                <strong>{customerEmail}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{customerPhone}</strong>
              </div>
            </div>
          </motion.div>

          {/* DELIVERY ADDRESS */}

          <motion.div
            className="delivery-address-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="details-section-heading">
              <div>
                <h2>Delivery Address</h2>
                <p>Shipping information</p>
              </div>

              <MapPin size={24} />
            </div>

            <div className="address-content">
              <MapPin size={23} />
              <p>{address}</p>
            </div>
          </motion.div>

          {/* PAYMENT INFORMATION */}

          <motion.div
            className="customer-details-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="details-section-heading">
              <div>
                <h2>Payment Information</h2>
                <p>Payment details</p>
              </div>

              <IndianRupee size={24} />
            </div>

            <div className="customer-contact-info">
              <div>
                <span>Payment Method</span>
                <strong>{order.paymentMethod || "N/A"}</strong>
              </div>

              <div>
                <span>Payment Status</span>
                <strong>{order.paymentStatus || "Pending"}</strong>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
