
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ShoppingBag,
  Clock,
  Package,
  CheckCircle,
  Search,
  ArrowUpRight,
  ClipboardList,
  IndianRupee,
  Filter,
} from "lucide-react";

import "./Orders.css";

const API_URL = "http://https://shopnexa-backend-wjk6.onrender.com/api/admin/orders";

// ======================================
// HELPERS
// ======================================

const getCustomerName = (order) => {
  return (
    order?.shippingAddress?.fullName ||
    order?.user?.name ||
    order?.user?.fullName ||
    order?.user?.username ||
    "Guest"
  );
};

const getOrderId = (order) => {
  return String(order?._id || order?.orderId || "N/A");
};

const getOrderTotal = (order) => {
  return Number(order?.totalPrice ?? 0);
};

const getOrderDate = (order) => {
  const date = order?.createdAt || order?.date;

  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ======================================
// ADMIN ORDERS COMPONENT
// ======================================

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // ======================================
  // FETCH ORDERS FROM MONGODB
  // ======================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin session not found. Please login again.");
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);

    } catch (err) {
      console.error("Fetch Orders Error:", err);
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ======================================
  // UPDATE ORDER STATUS
  // ======================================

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin session not found. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderStatus: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update order status.");
      }

      // Update the order with backend response
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          getOrderId(order) === orderId
            ? data.order
            : order
        )
      );

      alert("Order status updated successfully!");

    } catch (err) {
      console.error("Update Order Error:", err);
      alert(err.message || "Unable to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ======================================
  // SEARCH AND FILTER
  // ======================================

  const filteredOrders = orders.filter((order) => {
    const customerName = getCustomerName(order);
    const orderId = getOrderId(order);

    const matchesSearch =
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (order.orderStatus || "Placed") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ======================================
  // STATISTICS
  // ======================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Placed"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.orderStatus === "Confirmed"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.orderStatus === "Delivered")
    .reduce((sum, order) => sum + getOrderTotal(order), 0);

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      className: "pink",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      className: "orange",
    },
    {
      title: "Confirmed",
      value: processingOrders,
      icon: Package,
      className: "purple",
    },
    {
      title: "Delivered",
      value: deliveredOrders,
      icon: CheckCircle,
      className: "green",
    },
  ];

  // ======================================
  // STATUS CSS CLASS
  // ======================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "delivered";

      case "Shipped":
        return "shipped";

      case "Confirmed":
        return "processing";

      case "Cancelled":
        return "cancelled";

      default:
        return "pending";
    }
  };

  // ======================================
  // UI
  // ======================================

  return (
    <div className="admin-orders">

      {/* PAGE HEADER */}

      <motion.div
        className="orders-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="orders-subtitle">
            SHOPNEXA ADMIN PANEL
          </span>

          <h1>Orders Management</h1>

          <p>
            Manage, track and update all customer orders.
          </p>
        </div>

        <div className="orders-header-icon">
          <ClipboardList size={30} />
        </div>
      </motion.div>

      {/* STATISTICS */}

      <div className="orders-stats">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              className="order-stat-card"
              key={stat.title}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`order-stat-icon ${stat.className}`}>
                <Icon size={23} />
              </div>

              <div>
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
              </div>

              <ArrowUpRight className="stat-arrow" size={20} />
            </motion.div>
          );
        })}
      </div>

      {/* REVENUE CARD */}

      <motion.div
        className="orders-revenue"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="revenue-icon">
          <IndianRupee size={25} />
        </div>

        <div>
          <p>Total Delivered Revenue</p>

          <h2>
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
        </div>
      </motion.div>

      {/* ORDERS TABLE SECTION */}

      <motion.div
        className="orders-table-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="orders-section-heading">
          <div>
            <h2>All Orders</h2>
            <p>View and manage customer orders</p>
          </div>

          <span className="orders-count">
            {filteredOrders.length} Orders
          </span>
        </div>

        {/* SEARCH AND FILTER */}

        <div className="orders-toolbar">

          <div className="orders-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="orders-filter">
            <Filter size={18} />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Placed">Placed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* ORDERS TABLE */}

        <div className="orders-table-wrapper">
          <table className="orders-table">

            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAYMENT</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                    <p>{error}</p>

                    <button onClick={fetchOrders}>
                      Retry
                    </button>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredOrders.map((order, index) => {
                    const customerName = getCustomerName(order);
                    const orderId = getOrderId(order);
                    const status = order.orderStatus || "Placed";
                    const total = getOrderTotal(order);

                    const initial =
                      customerName.trim().charAt(0).toUpperCase() || "G";

                    return (
                      <motion.tr
                        key={orderId}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        {/* ORDER ID */}

                        <td>
                          <span className="order-id">
                            #{orderId.slice(-8).toUpperCase()}
                          </span>
                        </td>

                        {/* CUSTOMER */}

                        <td>
                          <div className="order-customer">
                            <div className="customer-avatar">
                              {initial}
                            </div>

                            <div>
                              <h4>{customerName}</h4>

                              <p>
                                {order.user?.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DATE */}

                        <td>
                          <span className="order-date">
                            {getOrderDate(order)}
                          </span>
                        </td>

                        {/* TOTAL */}

                        <td>
                          <strong className="order-total">
                            ₹{total.toLocaleString("en-IN")}
                          </strong>
                        </td>

                        {/* PAYMENT */}

                        <td>
                          <span className="payment-method">
                            {order.paymentMethod || "N/A"}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          <select
                            className={`order-status-select ${getStatusClass(status)}`}
                            value={status}
                            disabled={updatingId === orderId}
                            onChange={(e) =>
                              handleStatusChange(
                                orderId,
                                e.target.value
                              )
                            }
                          >
                            <option value="Placed">Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          {updatingId === orderId && (
                            <small>Updating...</small>
                          )}
                        </td>

                        {/* ACTION */}

                        <td>
                          <Link
                            to={`/admin/orders/${orderId}`}
                            className="order-view-btn"
                            title="View order details"
                          >
                            View
                            <ArrowUpRight size={16} />
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>

          </table>

          {/* EMPTY STATE */}

          {!loading && !error && filteredOrders.length === 0 && (
            <div className="orders-empty">
              <div className="empty-icon">
                <ShoppingBag size={35} />
              </div>

              <h3>No Orders Found</h3>

              <p>
                No orders match your search or selected filter.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

export default AdminOrders;
