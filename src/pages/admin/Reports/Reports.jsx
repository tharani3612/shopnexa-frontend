
import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  IndianRupee,
  ShoppingBag,
  Users,
  TrendingUp,
  Download,
  CalendarDays,
} from "lucide-react";

import "./Reports.css";

// ======================================
// HELPERS
// ======================================

const API_URL = "http://https://shopnexa-backend-wjk6.onrender.com/api/admin/reports";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

// Map backend order statuses to existing CSS classes
const getStatusClass = (status) => {
  if (status === "Delivered") return "completed";
  if (status === "Cancelled") return "cancelled";
  return "pending";
};

// ======================================
// ANIMATED VALUE
// ======================================

function AnimatedValue({ value, duration = 1200 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{displayValue.toLocaleString("en-IN")}</>;
}

// ======================================
// REPORTS COMPONENT
// ======================================

function Reports() {
  const [period, setPeriod] = useState("year");

  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
  });

  const [monthlySales, setMonthlySales] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================
  // FETCH REPORTS FROM MONGODB
  // ======================================

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin token not found. Please login again.");
      }

      const response = await fetch(
        `${API_URL}?period=${period}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch reports"
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "Unable to load reports"
        );
      }

      setStatsData({
        totalRevenue: data.stats?.totalRevenue || 0,
        totalOrders: data.stats?.totalOrders || 0,
        totalCustomers: data.stats?.totalCustomers || 0,
        averageOrderValue: data.stats?.averageOrderValue || 0,
      });

      setMonthlySales(data.monthlySales || []);
      setStatusData(data.statusData || []);
      setRecentSales(data.recentSales || []);

    } catch (err) {
      console.error("Reports Fetch Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever selected period changes
  useEffect(() => {
    fetchReports();
  }, [period]);

  // ======================================
  // CSV EXPORT
  // ======================================

  const handleExport = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Product",
      "Amount",
      "Status",
      "Order Date",
    ];

    const escapeCSV = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = recentSales.map((sale) => [
      sale.id,
      sale.customer,
      sale.product,
      sale.amount,
      sale.status,
      sale.createdAt
        ? new Date(sale.createdAt).toLocaleDateString("en-IN")
        : "",
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "shopnexa-reports.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ======================================
  // STATISTICS
  // ======================================

  const stats = [
    {
      title: "Total Revenue",
      value: statsData.totalRevenue,
      prefix: "₹",
      icon: IndianRupee,
      color: "purple",
      description: "Revenue for selected period",
    },
    {
      title: "Total Orders",
      value: statsData.totalOrders,
      prefix: "",
      icon: ShoppingBag,
      color: "blue",
      description: "Orders for selected period",
    },
    {
      title: "Total Customers",
      value: statsData.totalCustomers,
      prefix: "",
      icon: Users,
      color: "orange",
      description: "Registered customers",
    },
    {
      title: "Average Order Value",
      value: statsData.averageOrderValue,
      prefix: "₹",
      icon: TrendingUp,
      color: "green",
      description: "Average revenue per order",
    },
  ];

  const totalStatusOrders = statusData.reduce(
    (total, item) => total + item.value,
    0
  );

  // ======================================
  // UI
  // ======================================

  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>
            Track your store performance and business growth.
          </p>
        </div>

        <div className="reports-actions">

          <div className="period-select">
            <CalendarDays size={17} />

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="year">Last 12 Months</option>
              <option value="six">Last 6 Months</option>
              <option value="three">Last 3 Months</option>
            </select>
          </div>

          <button
            className="export-btn"
            onClick={handleExport}
            disabled={loading || recentSales.length === 0}
          >
            <Download size={17} />
            Export CSV
          </button>

        </div>
      </div>

      {/* ERROR MESSAGE */}

      {error && (
        <div
          style={{
            padding: "14px",
            marginBottom: "18px",
            background: "#ffe5e6",
            color: "#d64d55",
            borderRadius: "10px",
            fontSize: "13px",
          }}
        >
          {error}

          <button
            onClick={fetchReports}
            style={{
              marginLeft: "12px",
              border: "none",
              background: "transparent",
              color: "#d64d55",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <div className="stats-grid">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              className={`stat-card ${item.color}`}
              key={item.title}
              style={{
                animationDelay: `${index * 0.12}s`,
              }}
            >

              <div className="stat-top">

                <div className="stat-icon">
                  <Icon size={22} />
                </div>

                <span className="growth-badge">
                  <TrendingUp size={13} />
                  Live
                </span>

              </div>

              <p className="stat-title">
                {item.title}
              </p>

              <h2 className="stat-value">
                {item.prefix}
                <AnimatedValue value={item.value} />
              </h2>

              <p className="stat-description">
                {item.description}
              </p>

            </div>
          );
        })}

      </div>

      {/* CHARTS */}

      <div className="charts-grid">

        {/* MONTHLY SALES CHART */}

        <div className="chart-card sales-chart-card">

          <div className="chart-heading">

            <div>
              <h3>Sales Overview</h3>
              <p>Monthly revenue performance</p>
            </div>

            <span className="chart-indicator">
              <span className="indicator-dot"></span>
              Revenue
            </span>

          </div>

          <div className="sales-chart">

            <ResponsiveContainer width="100%" height={300}>

              <BarChart
                data={monthlySales}
                margin={{
                  top: 15,
                  right: 10,
                  left: 5,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#edf0f5"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  tickFormatter={(value) =>
                    `₹${value / 1000}k`
                  }
                />

                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  formatter={(value) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.08)",
                  }}
                />

                <Bar
                  dataKey="sales"
                  fill="#6366f1"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={38}
                  animationDuration={1500}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* ORDER STATUS PIE CHART */}

        <div className="chart-card category-chart-card">

          <div className="chart-heading">
            <div>
              <h3>Orders by Status</h3>
              <p>Order status distribution</p>
            </div>
          </div>

          <div className="pie-chart-wrapper">

            <ResponsiveContainer width="100%" height={220}>

              <PieChart>

                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={4}
                  animationDuration={1500}
                  animationBegin={200}
                >

                  {statusData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                      stroke="none"
                    />
                  ))}

                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `${value} Orders`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

            <div className="pie-center">
              <span>Total Orders</span>
              <strong>{totalStatusOrders}</strong>
            </div>

          </div>

          {/* STATUS LEGEND */}

          <div className="chart-legend">

            {statusData.map((item, index) => (

              <div
                className="legend-item"
                key={item.name}
                style={{
                  animationDelay: `${index * 0.12}s`,
                }}
              >

                <div className="legend-name">

                  <span
                    className="legend-color"
                    style={{
                      background: item.color,
                    }}
                  ></span>

                  {item.name}

                </div>

                <strong>{item.value}</strong>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* RECENT SALES TABLE */}

      <div className="reports-table-card">

        <div className="table-heading">

          <div>
            <h3>Recent Sales</h3>
            <p>Latest transactions from your store</p>
          </div>

          <span className="sales-count">
            {recentSales.length} Transactions
          </span>

        </div>

        <div className="table-responsive">

          <table className="reports-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    Loading reports...
                  </td>
                </tr>

              ) : recentSales.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No sales found for this period.
                  </td>
                </tr>

              ) : (

                recentSales.map((sale, index) => (

                  <tr
                    key={sale.id}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >

                    <td className="order-id">
                      #{sale.id.slice(-8).toUpperCase()}
                    </td>

                    <td>{sale.customer}</td>

                    <td>{sale.product}</td>

                    <td className="amount">
                      {formatCurrency(sale.amount)}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          sale.status
                        )}`}
                      >
                        {sale.status}
                      </span>
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Reports;
