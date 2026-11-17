
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../services/api";
import "./Orders.css";

const FILTERS = [
  "All",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const CANCELLABLE_STATUSES = [
  "placed",
  "order placed",
  "pending",
  "confirmed",
  "processing",
  "packed",
  "preparing",
];

const normalizeStatus = (status) => {
  return String(status || "Placed")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
};

const getOrderStatus = (order) => {
  return normalizeStatus(order?.orderStatus);
};

const getFilterGroup = (status) => {
  const normalized = normalizeStatus(status);

  if (
    [
      "placed",
      "order placed",
      "pending",
      "confirmed",
      "processing",
      "packed",
      "preparing",
    ].includes(normalized)
  ) {
    return "Processing";
  }

  if (
    ["shipped", "out for delivery", "dispatched"].includes(normalized)
  ) {
    return "Shipped";
  }

  if (normalized === "delivered") {
    return "Delivered";
  }

  if (["cancelled", "canceled"].includes(normalized)) {
    return "Cancelled";
  }

  return "Processing";
};

const getOrderId = (order) => {
  return String(order?._id || "");
};

const getOrderTotal = (order) => {
  return Number(order?.totalPrice || 0);
};

const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  // FETCH CUSTOMER ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/customer/orders/my-orders");

        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          setOrders([]);
          setError("Unable to fetch your orders.");
        }
      } catch (err) {
        console.error("Fetch orders error:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // CANCEL CUSTOMER ORDER
  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingOrderId(orderId);
      setActionMessage("");
      setActionError("");

      const response = await API.patch(
        `/customer/orders/${orderId}/cancel`
      );

      if (response.data.success) {
        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            getOrderId(order) === orderId
              ? response.data.order
              : order
          )
        );

        setActionMessage(
          "Your order has been cancelled successfully."
        );
      } else {
        setActionError(
          response.data.message || "Unable to cancel this order."
        );
      }
    } catch (err) {
      console.error("Cancel order error:", err);

      setActionError(
        err.response?.data?.message ||
        "Unable to cancel order. Please try again."
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  // FILTER AND SEARCH ORDERS
  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId = getOrderId(order).toLowerCase();
      const status = getOrderStatus(order);
      const filterGroup = getFilterGroup(status);

      const matchesSearch =
        !search ||
        orderId.includes(search) ||
        status.includes(search) ||
        (order.items || []).some((item) =>
          String(item.name || "").toLowerCase().includes(search)
        );

      const matchesFilter =
        activeFilter === "All" || filterGroup === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, activeFilter, searchTerm]);

  // TOTAL SPENT
  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => {
      return sum + getOrderTotal(order);
    }, 0);
  }, [orders]);

  const getStatusLabel = (status) => {
    return normalizeStatus(status)
      .split(" ")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  // LOADING
  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <p className="orders-empty">Loading your orders...</p>
        </div>
      </main>
    );
  }

  // ERROR
  if (error && orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-empty-state">
            <div className="orders-empty-icon">⚠️</div>
            <h2>Unable to Load Orders</h2>
            <p>{error}</p>

            <button
              className="orders-reset-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-container">

        {/* HEADER */}
        <div className="orders-header">
          <div>
            <p className="orders-eyebrow">
              YOUR SHOPNEXA ACCOUNT
            </p>

            <h1>My Orders</h1>

            <p className="orders-subtitle">
              Track your orders and check your purchase history.
            </p>
          </div>

          <Link to="/" className="orders-continue-btn">
            Continue Shopping
          </Link>
        </div>

        {/* ORDER STATISTICS */}
        <div className="orders-stats">

          <div className="orders-stat-card">
            <span className="orders-stat-label">
              Total Orders
            </span>
            <strong>{orders.length}</strong>
          </div>

          <div className="orders-stat-card">
            <span className="orders-stat-label">
              Processing
            </span>
            <strong>
              {
                orders.filter(
                  (order) =>
                    getFilterGroup(getOrderStatus(order)) === "Processing"
                ).length
              }
            </strong>
          </div>

          <div className="orders-stat-card">
            <span className="orders-stat-label">
              Delivered
            </span>
            <strong>
              {
                orders.filter(
                  (order) =>
                    getFilterGroup(getOrderStatus(order)) === "Delivered"
                ).length
              }
            </strong>
          </div>

          <div className="orders-stat-card">
            <span className="orders-stat-label">
              Total Spent
            </span>
            <strong>{formatPrice(totalSpent)}</strong>
          </div>

        </div>

        {/* ORDERS CONTENT */}
        <section className="orders-content">

          {/* SUCCESS MESSAGE */}
          {actionMessage && (
            <div className="orders-action-success" role="status">
              {actionMessage}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {actionError && (
            <div className="orders-action-error" role="alert">
              {actionError}
            </div>
          )}

          {/* FILTER TOOLBAR */}
          <div className="orders-toolbar">

            <div className="orders-filter-list">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`orders-filter-btn ${
                    activeFilter === filter ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                >
                  {filter}

                  {filter === "All" && (
                    <span className="orders-filter-count">
                      {orders.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <input
              type="search"
              className="orders-search"
              placeholder="Search order ID or product..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search orders"
            />

          </div>

          <div className="orders-results-info">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>

          {/* EMPTY ORDERS */}
          {orders.length === 0 ? (
            <div className="orders-empty-state">
              <div className="orders-empty-icon">🛍️</div>

              <h2>No orders yet</h2>

              <p>
                Your orders will appear here after you complete a purchase.
              </p>

              <Link to="/" className="orders-continue-btn">
                Start Shopping
              </Link>
            </div>

          ) : filteredOrders.length === 0 ? (

            /* NO MATCHING ORDERS */
            <div className="orders-empty-state">
              <div className="orders-empty-icon">🔎</div>

              <h2>No matching orders</h2>

              <p>
                No orders match this filter or search. Try another filter.
              </p>

              <button
                type="button"
                className="orders-reset-btn"
                onClick={() => {
                  setActiveFilter("All");
                  setSearchTerm("");
                }}
              >
                Clear Filters
              </button>
            </div>

          ) : (

            /* ORDER LIST */
            <div className="orders-list">

              {filteredOrders.map((order) => {
                const orderId = getOrderId(order);
                const status = getOrderStatus(order);
                const statusGroup = getFilterGroup(status);

                const items = Array.isArray(order.items)
                  ? order.items
                  : [];

                const totalQuantity = items.reduce(
                  (sum, item) =>
                    sum + Number(item.quantity || 0),
                  0
                );

                const canCancel =
                  CANCELLABLE_STATUSES.includes(status);

                return (
                  <article
                    className="orders-card"
                    key={orderId}
                  >

                    {/* CARD HEADER */}
                    <div className="orders-card-header">

                      <div>
                        <p className="orders-order-number">
                          ORDER #{orderId}
                        </p>

                        <p className="orders-order-date">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`orders-status orders-status-${statusGroup.toLowerCase()}`}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </span>

                    </div>

                    {/* CARD BODY */}
                    <div className="orders-card-body">

                      <div className="orders-products-preview">

                        {items.slice(0, 3).map((item, index) => (
                          <div
                            className="orders-product-preview"
                            key={`${item.product || item.name}-${index}`}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || "Product"}
                              />
                            ) : (
                              <div className="orders-product-placeholder">
                                🛍️
                              </div>
                            )}
                          </div>
                        ))}

                        <div className="orders-items-info">
                          <strong>
                            {totalQuantity}{" "}
                            {totalQuantity === 1 ? "item" : "items"}
                          </strong>

                          <span>
                            {items
                              .slice(0, 2)
                              .map((item) => item.name || "Product")
                              .join(", ")}

                            {items.length > 2 ? " and more" : ""}
                          </span>
                        </div>

                      </div>

                      <div className="orders-total">
                        <span>Order Total</span>
                        <strong>
                          {formatPrice(getOrderTotal(order))}
                        </strong>
                      </div>

                    </div>

                    {/* CARD FOOTER */}
                    <div className="orders-card-footer">

                      <span className="orders-payment-method">
                        Payment: {order.paymentMethod || "Not specified"}
                        {" | "}
                        {order.paymentStatus || "Pending"}
                      </span>

                      <div className="orders-card-actions">

                        {/* CANCEL ORDER BUTTON */}
                        {canCancel && (
                          <button
                            type="button"
                            className="orders-cancel-btn"
                            onClick={() => handleCancelOrder(orderId)}
                            disabled={cancellingOrderId === orderId}
                          >
                            {cancellingOrderId === orderId
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </button>
                        )}

                        {/* VIEW DETAILS */}
                        <Link
                          to={`/orders/${encodeURIComponent(orderId)}`}
                          state={{ order }}
                          className="orders-details-btn"
                        >
                          View Details →
                        </Link>

                      </div>
                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </section>
      </div>
    </main>
  );
}

export default Orders;
