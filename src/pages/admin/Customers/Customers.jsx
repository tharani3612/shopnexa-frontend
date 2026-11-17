
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Eye,
  Users,
  UserCheck,
  UserX,
  IndianRupee,
  X,
  Mail,
  Phone,
  ShoppingBag,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

import "./Customers.css";

const API_URL = "http://https://shopnexa-backend-wjk6.onrender.com/api/admin/customers";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CUSTOMERS FROM MONGODB
  // ==========================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin token not found. Please login again.");
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch customers");
      }

      if (data.success) {
        setCustomers(data.customers || []);
      } else {
        throw new Error(data.message || "Unable to load customers");
      }
    } catch (err) {
      console.error("Customers Fetch Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ==========================================
  // FILTER CUSTOMERS
  // ==========================================

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        (customer.name || "").toLowerCase().includes(searchValue) ||
        (customer.email || "").toLowerCase().includes(searchValue) ||
        (customer.phone || "").includes(searchValue);

      const matchesStatus =
        filter === "All" || customer.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, filter]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inactive"
  ).length;

  const totalSpent = customers.reduce(
    (sum, customer) => sum + Number(customer.spent || 0),
    0
  );

  const totalOrders = customers.reduce(
    (sum, customer) => sum + Number(customer.orders || 0),
    0
  );

  // ==========================================
  // STATISTICS CARDS
  // ==========================================

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      color: "pink",
      description: "Registered customers",
    },
    {
      title: "Active Customers",
      value: activeCustomers,
      icon: UserCheck,
      color: "green",
      description: "Currently active",
    },
    {
      title: "Inactive Customers",
      value: inactiveCustomers,
      icon: UserX,
      color: "orange",
      description: "Currently inactive",
    },
    {
      title: "Total Spending",
      value: `₹${totalSpent.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "purple",
      description: "Combined customer spending",
    },
  ];

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setSelectedCustomer(null);
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="customers-page">
        <div className="customer-empty">
          <div className="customer-empty-icon">
            <Users size={35} />
          </div>
          <h3>Loading Customers...</h3>
          <p>Please wait while we fetch customer data.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <div className="customers-page">
        <div className="customer-empty">
          <div className="customer-empty-icon">
            <Users size={35} />
          </div>

          <h3>Unable to Load Customers</h3>
          <p>{error}</p>

          <button onClick={fetchCustomers}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-page">

      {/* Header */}
      <motion.div
        className="customers-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="customers-subtitle">
            SHOPNEXA ADMIN PANEL
          </span>

          <h1>Customers Management</h1>

          <p>
            Manage your registered customers and monitor their activity.
          </p>
        </div>

        <div className="customers-header-icon">
          <Users size={30} />
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="customer-stats">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              className="customer-stat-card"
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`customer-stat-icon ${stat.color}`}>
                <Icon size={24} />
              </div>

              <div className="customer-stat-info">
                <span>{stat.title}</span>

                <h2>{stat.value}</h2>

                <small>{stat.description}</small>
              </div>

              <ArrowUpRight
                className="customer-stat-arrow"
                size={19}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Customer Overview */}
      <motion.div
        className="customer-overview"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="overview-item">
          <div className="overview-icon">
            <ShoppingBag size={21} />
          </div>

          <div>
            <span>Total Orders</span>
            <h3>{totalOrders}</h3>
          </div>
        </div>

        <div className="overview-divider" />

        <div className="overview-item">
          <div className="overview-icon purple">
            <Wallet size={21} />
          </div>

          <div>
            <span>Average Customer Spending</span>

            <h3>
              {formatCurrency(
                totalCustomers > 0
                  ? totalSpent / totalCustomers
                  : 0
              )}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Customers Table */}
      <motion.div
        className="customers-table-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Toolbar */}
        <div className="customers-toolbar">

          <div className="customers-toolbar-title">
            <h2>All Customers</h2>

            <p>
              {filteredCustomers.length} customers found
            </p>
          </div>

          <div className="customers-controls">

            {/* Search */}
            <div className="customer-search">
              <Search size={20} />

              <input
                type="text"
                placeholder="Search name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  className="customer-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="customer-filter"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="customers-table-wrapper">
          <table className="customers-table">

            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>PHONE</th>
                <th>ORDERS</th>
                <th>TOTAL SPENT</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Customer */}
                    <td>
                      <div className="customer-name-cell">
                        <div className="customer-avatar">
                          {(customer.name || "G")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="customer-name-info">
                          <strong>{customer.name || "Guest"}</strong>
                          <span>{customer.email || "N/A"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td>
                      <span className="customer-phone">
                        {customer.phone || "N/A"}
                      </span>
                    </td>

                    {/* Orders */}
                    <td>
                      <span className="customer-order-count">
                        {customer.orders || 0}
                      </span>
                    </td>

                    {/* Spending */}
                    <td>
                      <strong className="customer-spent">
                        {formatCurrency(customer.spent)}
                      </strong>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`customer-status ${(customer.status || "Active").toLowerCase()}`}
                      >
                        <span className="status-dot" />
                        {customer.status || "Active"}
                      </span>
                    </td>

                    {/* Action */}
                    <td>
                      <button
                        className="customer-view-btn"
                        onClick={() => setSelectedCustomer(customer)}
                        title="View customer details"
                      >
                        <Eye size={18} />
                        <span>View</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>

          </table>

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <div className="customer-empty">
              <div className="customer-empty-icon">
                <Users size={35} />
              </div>

              <h3>No Customers Found</h3>

              <p>
                Try another search term or change your status filter.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            className="customer-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="customer-modal"
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="customer-modal-header">
                <div>
                  <span>CUSTOMER PROFILE</span>
                  <h2>Customer Details</h2>
                </div>

                <button
                  className="customer-modal-close"
                  onClick={closeModal}
                  aria-label="Close customer details"
                >
                  <X size={21} />
                </button>
              </div>

              {/* Profile */}
              <div className="customer-modal-profile">
                <div className="customer-modal-avatar">
                  {(selectedCustomer.name || "G")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <h3>{selectedCustomer.name || "Guest"}</h3>

                <p>{selectedCustomer.email || "N/A"}</p>

                <span
                  className={`customer-status ${(selectedCustomer.status || "Active").toLowerCase()}`}
                >
                  <span className="status-dot" />
                  {selectedCustomer.status || "Active"}
                </span>
              </div>

              {/* Details */}
              <div className="customer-modal-details">

                <div className="customer-detail-item">
                  <div className="detail-icon">
                    <Mail size={19} />
                  </div>

                  <div>
                    <span>Email Address</span>
                    <strong>{selectedCustomer.email || "N/A"}</strong>
                  </div>
                </div>

                <div className="customer-detail-item">
                  <div className="detail-icon">
                    <Phone size={19} />
                  </div>

                  <div>
                    <span>Phone Number</span>
                    <strong>{selectedCustomer.phone || "N/A"}</strong>
                  </div>
                </div>

                <div className="customer-detail-item">
                  <div className="detail-icon">
                    <ShoppingBag size={19} />
                  </div>

                  <div>
                    <span>Total Orders</span>
                    <strong>
                      {selectedCustomer.orders || 0} Orders
                    </strong>
                  </div>
                </div>

                <div className="customer-detail-item">
                  <div className="detail-icon">
                    <IndianRupee size={19} />
                  </div>

                  <div>
                    <span>Total Spending</span>

                    <strong>
                      {formatCurrency(selectedCustomer.spent)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="customer-modal-footer">
                <button onClick={closeModal}>
                  Close Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Customers;
