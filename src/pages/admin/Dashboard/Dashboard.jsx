import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Search,
  Bell,
  ShoppingBag,
  Package,
  Users,
  IndianRupee,
  TrendingUp,
  Eye,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  UserRound,
  Settings,
  LockKeyhole,
  LogOut,
  CheckCheck,
  Trash2,
  X,
} from "lucide-react";

import "./Dashboard.css";

// ========================================
// DASHBOARD CHART COLORS
// ========================================

const STATUS_COLORS = {
  Placed: "#f5a623",
  Confirmed: "#4385f5",
  Shipped: "#8b5cf6",
  Delivered: "#16c784",
  Cancelled: "#f04468",
};

// ========================================
// ANIMATIONS
// ========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

// ========================================
// ANIMATED NUMBER
// ========================================

function AnimatedNumber({ value, prefix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();
    let frame;

    const animate = (time) => {
      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <>
      {prefix}
      {count.toLocaleString("en-IN")}
    </>
  );
}

// ========================================
// NOTIFICATIONS
// ========================================

const NOTIFICATION_KEY = "shopnexa_notifications";

const defaultNotifications = [
  {
    id: "demo-order-7902",
    title: "New order received",
    message: "Order #SN7902 is waiting for processing.",
    type: "order",
    time: "Demo notification",
    link: "/admin/orders/7902",
    read: false,
  },
  {
    id: "demo-order-7903",
    title: "Order is processing",
    message: "Order #SN7903 is being processed.",
    type: "order",
    time: "Demo notification",
    link: "/admin/orders/7903",
    read: false,
  },
  {
    id: "demo-stock",
    title: "Check product stock",
    message: "Review your inventory.",
    type: "stock",
    time: "Demo notification",
    link: "/admin/products",
    read: true,
  },
];

function readStoredNotifications() {
  try {
    const stored = localStorage.getItem(NOTIFICATION_KEY);

    if (stored === null) {
      return defaultNotifications;
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : defaultNotifications;
  } catch {
    return defaultNotifications;
  }
}

// ========================================
// ADMIN PROFILE
// ========================================

function readAdminProfile() {
  try {
    const raw = localStorage.getItem("admin");

    if (!raw) {
      return { name: "Admin", email: "" };
    }

    const parsed = JSON.parse(raw);

    if (typeof parsed === "string") {
      return { name: parsed, email: "" };
    }

    return {
      name:
        parsed?.name ||
        parsed?.fullName ||
        parsed?.username ||
        "Admin",
      email: parsed?.email || "",
    };
  } catch {
    return { name: "Admin", email: "" };
  }
}

// ========================================
// MAIN DASHBOARD
// ========================================

function Dashboard() {
  const navigate = useNavigate();

  // ======================================
  // LIVE DASHBOARD DATA
  // ======================================

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  // ======================================
  // FETCH DASHBOARD API
  // ======================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setDashboardError("");

        const adminToken = localStorage.getItem("adminToken");

        if (!adminToken) {
          navigate("/admin/login", { replace: true });
          return;
        }

        const response = await fetch(
          "https://shopnexa-backend-wjk6.onrender.com/api/admin/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (
            response.status === 401 ||
            response.status === 403
          ) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");

            navigate("/admin/login", {
              replace: true,
            });
          }

          throw new Error(
            result.message ||
              "Unable to load dashboard data."
          );
        }

        if (!result.success) {
          throw new Error(
            result.message || "Dashboard request failed."
          );
        }

        setDashboardData(result);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Dashboard API Error:", error);

          setDashboardError(
            error.message ||
              "Unable to connect to the server."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => controller.abort();
  }, [navigate]);

  // ======================================
  // SEARCH STATE
  // ======================================

  const [searchTerm, setSearchTerm] = useState("");

  const [dateRange, setDateRange] =
    useState("Last 12 Months");

  // ======================================
  // NOTIFICATION STATE
  // ======================================

  const [notifications, setNotifications] =
    useState(readStoredNotifications);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  // ======================================
  // PROFILE STATE
  // ======================================

  const [profileOpen, setProfileOpen] =
    useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const adminProfile = readAdminProfile();

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  // ======================================
  // SEARCH FUNCTION
  // ======================================

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // ======================================
  // API STATISTICS
  // ======================================

  const statsFromApi = dashboardData?.stats || {};

  const stats = [
    {
      title: "Total Revenue",
      value: String(statsFromApi.totalRevenue || 0),
      icon: IndianRupee,
      color: "pink",
      prefix: "₹",
    },
    {
      title: "Total Orders",
      value: String(statsFromApi.totalOrders || 0),
      icon: ShoppingBag,
      color: "blue",
      prefix: "",
    },
    {
      title: "Total Products",
      value: String(statsFromApi.totalProducts || 0),
      icon: Package,
      color: "green",
      prefix: "",
    },
    {
      title: "Total Customers",
      value: String(statsFromApi.totalCustomers || 0),
      icon: Users,
      color: "orange",
      prefix: "",
    },
  ];

  // ======================================
  // MONTHLY SALES DATA
  // ======================================

  const monthlySales = Array.isArray(
    dashboardData?.monthlySales
  )
    ? dashboardData.monthlySales
    : [];

  const salesData = monthlySales.map((item) => ({
    month: item.month,
    sales: Number(item.revenue ?? item.sales ?? 0),
  }));

  // ======================================
  // MONTHLY ORDERS DATA
  // ======================================

  const monthlyOrders = monthlySales.map((item) => ({
    month: item.month,
    orders: Number(item.orders || 0),
  }));

  // ======================================
  // ORDER STATUS DATA
  // ======================================

  const rawOrderStatuses =
    dashboardData?.orderStatus || [];

  const statusRows = Array.isArray(rawOrderStatuses)
    ? rawOrderStatuses
    : Object.entries(rawOrderStatuses).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

  const totalStatusOrders = statusRows.reduce(
    (sum, item) =>
      sum + Number(item.value ?? item.count ?? 0),
    0
  );

  const orderStatusData = statusRows.map((item) => {
    const name =
      item.name ||
      item._id ||
      item.status ||
      "Unknown";

    const count = Number(
      item.value ?? item.count ?? 0
    );

    return {
      name,
      count,
      value: totalStatusOrders
        ? Math.round(
            (count / totalStatusOrders) * 100
          )
        : 0,
      color: STATUS_COLORS[name] || "#9993a0",
    };
  });

  // ======================================
  // RECENT ORDERS FROM API
  // ======================================

  const recentOrders = (
    Array.isArray(dashboardData?.recentOrders)
      ? dashboardData.recentOrders
      : []
  ).map((order) => {
    const items = Array.isArray(order.items)
      ? order.items
      : [];

    const productNames = items
      .map(
        (item) =>
          item.name ||
          item.product?.name ||
          "Product"
      )
      .filter(Boolean);

    return {
      id: order._id || order.id,

      displayId:
        order.orderId ||
        `#SN${String(
          order._id || order.id || ""
        )
          .slice(-8)
          .toUpperCase()}`,

      customer:
        order.customer ||
        order.user?.name ||
        order.shippingAddress?.fullName ||
        "Customer",

      product: productNames.length
        ? productNames.join(", ")
        : "—",

      amount: `₹${Number(
        order.totalPrice || 0
      ).toLocaleString("en-IN")}`,

      status:
        order.orderStatus ||
        order.status ||
        "Placed",
    };
  });

  // ======================================
  // FILTER RECENT ORDERS
  // ======================================

  const filteredOrders = recentOrders.filter(
    (order) => {
      const query = searchTerm.trim().toLowerCase();

      if (!query) return true;

      return [
        order.displayId,
        order.customer,
        order.product,
        order.amount,
        order.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    }
  );

  // ======================================
  // CURRENT MONTH REVENUE
  // ======================================

  const currentMonthRevenue = salesData.length
    ? salesData[salesData.length - 1].sales
    : 0;

  // ======================================
  // SAVE NOTIFICATIONS
  // ======================================

  useEffect(() => {
    try {
      localStorage.setItem(
        NOTIFICATION_KEY,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error(
        "Unable to save notifications:",
        error
      );
    }
  }, [notifications]);

  // ======================================
  // CLOSE DROPDOWNS
  // ======================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // ======================================
  // NOTIFICATION ACTIONS
  // ======================================

  const markNotificationRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  // ======================================
  // LOGOUT
  // ======================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("shopnexa_admin_user");
    localStorage.removeItem("admin");

    sessionStorage.removeItem("adminToken");

    navigate("/admin/login", {
      replace: true,
    });
  };

  // ======================================
  // JSX
  // ======================================

  return (
    <motion.div
      className="shop-dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* LOADING MESSAGE */}

      {loading && (
        <div className="dashboard-api-message">
          Loading dashboard data...
        </div>
      )}

      {/* API ERROR */}

      {!loading && dashboardError && (
        <div
          className="dashboard-api-message dashboard-api-error"
          role="alert"
        >
          {dashboardError}

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* HEADER */}

      <motion.header
        className="dashboard-topbar"
        variants={cardVariants}
      >
        <div className="dashboard-page-title">
          <h1>Dashboard</h1>

          <p>
            Welcome back! Here's what's happening
            with your store.
          </p>
        </div>

        <div className="dashboard-top-actions">
          {/* SEARCH BAR */}

          <div className="dashboard-search">
            <Search size={17} />

            <input
              type="search"
              placeholder="Search orders, customers, products..."
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Search recent orders"
            />

            {searchTerm.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* NOTIFICATIONS */}

          <div
            className="dashboard-menu-wrap"
            ref={notificationRef}
          >
            <button
              type="button"
              className="dashboard-notification"
              aria-label="Notifications"
              aria-expanded={notificationOpen}
              onClick={() => {
                setNotificationOpen((open) => !open);
                setProfileOpen(false);
              }}
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="dashboard-dropdown notification-dropdown">
                <div className="dropdown-heading">
                  <div>
                    <h3>Notifications</h3>

                    <p>
                      {unreadCount} unread notification
                      {unreadCount === 1 ? "" : "s"}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="dropdown-icon-btn"
                    onClick={() =>
                      setNotificationOpen(false)
                    }
                    aria-label="Close notifications"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">
                      <Bell size={22} />

                      <strong>
                        You're all caught up
                      </strong>

                      <span>
                        No notifications available.
                      </span>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className={`notification-item ${
                          item.read
                            ? "is-read"
                            : "is-unread"
                        }`}
                        onClick={() => {
                          markNotificationRead(item.id);
                          setNotificationOpen(false);

                          if (item.link) {
                            navigate(item.link);
                          }
                        }}
                      >
                        <span
                          className={`notification-item-icon ${
                            item.type === "stock"
                              ? "stock"
                              : "order"
                          }`}
                        >
                          {item.type === "stock" ? (
                            <Package size={17} />
                          ) : (
                            <ShoppingBag size={17} />
                          )}
                        </span>

                        <span className="notification-item-copy">
                          <strong>{item.title}</strong>

                          <span>{item.message}</span>

                          <small>{item.time}</small>
                        </span>

                        {!item.read && (
                          <span className="notification-unread-dot" />
                        )}
                      </button>
                    ))
                  )}
                </div>

                <div className="notification-footer">
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifications([])}
                  >
                    <Trash2 size={14} />
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ADMIN PROFILE */}

          <div
            className="dashboard-menu-wrap"
            ref={profileRef}
          >
            <button
              type="button"
              className="dashboard-profile-trigger"
              aria-label="Admin profile menu"
              aria-expanded={profileOpen}
              onClick={() => {
                setProfileOpen((open) => !open);
                setNotificationOpen(false);
              }}
            >
              <span className="dashboard-top-avatar">
                {(adminProfile.name || "A")
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </span>

              <ChevronDown size={14} />
            </button>

            {profileOpen && (
              <div className="dashboard-dropdown profile-dropdown">
                <div className="profile-dropdown-user">
                  <span className="dashboard-top-avatar">
                    {(adminProfile.name || "A")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span>
                    <strong>{adminProfile.name}</strong>

                    <small>
                      {adminProfile.email || "Administrator"}
                    </small>
                  </span>
                </div>

                <div className="profile-dropdown-links">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/profile");
                    }}
                  >
                    <UserRound size={16} />
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/settings");
                    }}
                  >
                    <Settings size={16} />
                    Account Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/change-password");
                    }}
                  >
                    <LockKeyhole size={16} />
                    Change Password
                  </button>
                </div>

                <button
                  type="button"
                  className="profile-logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* OVERVIEW */}

      <motion.div
        className="dashboard-section-heading"
        variants={cardVariants}
      >
        <div>
          <h2>Overview</h2>
          <p>Monitor your store performance.</p>
        </div>

        <div className="dashboard-date-filter">
          <CalendarDays size={16} />

          <select
            value={dateRange}
            onChange={(event) =>
              setDateRange(event.target.value)
            }
          >
            <option>Last 12 Months</option>
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
          </select>
        </div>
      </motion.div>

      {/* STATISTICS */}

      <motion.div
        className="dashboard-stats-grid"
        variants={containerVariants}
      >
        {stats.map((item) => {
          const Icon = item.icon;

          const numericValue =
            Number(item.value) || 0;

          const prefix = item.prefix || "";

          return (
            <motion.div
              className="dashboard-stat-card"
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="stat-card-top">
                <div className={`stat-icon ${item.color}`}>
                  <Icon size={21} />
                </div>

                <span className="stat-change">
                  <TrendingUp size={13} />
                  Live data
                </span>
              </div>

              <p className="stat-title">
                {item.title}
              </p>

              <h2>
                <AnimatedNumber
                  value={numericValue}
                  prefix={prefix}
                />
              </h2>

              <span className="stat-subtitle">
                Updated from your store database
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* SALES AND ORDER CHARTS */}

      <div className="dashboard-charts-grid">
        {/* SALES OVERVIEW */}

        <motion.section
          className="dashboard-panel sales-panel"
          variants={cardVariants}
        >
          <div className="panel-header">
            <div>
              <h3>Sales Overview</h3>
              <p>Your sales performance over time</p>
            </div>

            <span className="panel-label">
              Revenue
            </span>
          </div>

          <div className="sales-summary">
            <h2>
              ₹
              <AnimatedNumber
                value={currentMonthRevenue}
              />
            </h2>

            <span>
              <TrendingUp size={14} />
              Latest month revenue
            </span>
          </div>

          <div className="chart-container sales-chart">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={salesData}
                margin={{
                  top: 15,
                  right: 10,
                  left: -15,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#ff2670"
                      stopOpacity={0.22}
                    />

                    <stop
                      offset="95%"
                      stopColor="#ff2670"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0edf1"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#9993a0",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#9993a0",
                    fontSize: 11,
                  }}
                  tickFormatter={(value) =>
                    `${value / 1000}k`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#ff2670"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* ORDER SUMMARY */}

        <motion.section
          className="dashboard-panel order-summary-panel"
          variants={cardVariants}
        >
          <div className="panel-header">
            <div>
              <h3>Order Summary</h3>
              <p>Current order status</p>
            </div>
          </div>

          <div className="donut-chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {orderStatusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    "Orders",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center-text">
              <h2>
                <AnimatedNumber
                  value={Number(
                    statsFromApi.totalOrders || 0
                  )}
                />
              </h2>

              <span>Total Orders</span>
            </div>
          </div>

          <div className="order-status-list">
            {orderStatusData.map((item) => (
              <div
                className="order-status-item"
                key={item.name}
              >
                <div>
                  <span
                    className="status-dot"
                    style={{
                      background: item.color,
                    }}
                  />

                  <span>{item.name}</span>
                </div>

                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* MONTHLY ORDERS */}

      <motion.section
        className="dashboard-panel monthly-sales-panel"
        variants={cardVariants}
      >
        <div className="panel-header">
          <div>
            <h3>Monthly Orders</h3>
            <p>
              Monthly order count from your database
            </p>
          </div>

          <span className="panel-label">
            Last 12 months
          </span>
        </div>

        <div className="chart-container bar-chart-container">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={monthlyOrders}
              margin={{
                top: 15,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0edf1"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#9993a0",
                  fontSize: 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#9993a0",
                  fontSize: 11,
                }}
              />

              <Tooltip />

              <Bar
                dataKey="orders"
                fill="#ff4380"
                radius={[7, 7, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* RECENT ORDERS */}

      <motion.section
        className="dashboard-panel recent-orders-panel"
        variants={cardVariants}
      >
        <div className="panel-header recent-orders-heading">
          <div>
            <h3>Recent Orders</h3>

            <p>
              {searchTerm.trim()
                ? `${filteredOrders.length} matching order(s) found`
                : "Latest customer orders from your store"}
            </p>
          </div>

          <button
            type="button"
            className="view-all-btn"
            onClick={() => navigate("/admin/orders")}
          >
            View All
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="recent-orders-table-wrapper">
          <table className="recent-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.displayId}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.03,
                    }}
                  >
                    <td className="order-id">
                      {order.displayId}
                    </td>

                    <td>{order.customer}</td>

                    <td>{order.product}</td>

                    <td className="order-amount">
                      {order.amount}
                    </td>

                    <td>
                      <span
                        className={`order-status-badge ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="order-view-btn"
                        title="View order"
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order.id}`
                          )
                        }
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="empty-orders"
                  >
                    {searchTerm.trim()
                      ? `No orders found for "${searchTerm}".`
                      : "No orders available yet."}

                    {searchTerm.trim() && (
                      <button
                        type="button"
                        onClick={clearSearch}
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* FOOTER */}

      <motion.footer
        className="dashboard-footer"
        variants={cardVariants}
      >
        <span className="admin-footer-line" />

        <p className="admin-copyright">
          © 2026 ShopNexa. All rights reserved.
        </p>
      </motion.footer>
    </motion.div>
  );
}

export default Dashboard;