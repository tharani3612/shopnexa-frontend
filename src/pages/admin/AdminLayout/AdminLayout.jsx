
import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  FiGrid,
  FiBox,
  FiLayers,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiX,
  FiLock,
} from "react-icons/fi";

import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================
  // ADMIN MENU ITEMS
  // =====================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FiGrid />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <FiBox />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <FiLayers />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FiShoppingBag />,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: <FiUsers />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <FiBarChart2 />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <FiSettings />,
    },
  ];

  // =====================================
  // CLOSE MENUS WHEN ROUTE CHANGES
  // =====================================

  useEffect(() => {
    setShowAdminMenu(false);
    setSidebarOpen(false);
  }, [location.pathname]);

  // =====================================
  // ESCAPE KEY
  // =====================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowAdminMenu(false);
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // =====================================
  // ADMIN LOGOUT
  // =====================================

  const handleLogout = () => {
    setShowAdminMenu(false);
    setSidebarOpen(false);

    // Clear admin authentication data.
    // Keep these keys aligned with your admin login implementation.
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("admin");

    navigate("/admin/login", {
      replace: true,
    });
  };

  // =====================================
  // CLOSE ADMIN DROPDOWN
  // =====================================

  const closeAdminMenu = () => {
    setShowAdminMenu(false);
  };

  // =====================================
  // NAVIGATE TO ADMIN PAGE
  // =====================================

  const handleAdminNavigation = (path) => {
    closeAdminMenu();
    setSidebarOpen(false);
    navigate(path);
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="admin-layout">

      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {sidebarOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        {/* LOGO */}

        <div className="admin-logo">

          <div className="admin-logo-icon">
            S
          </div>

          <h2>
            Shop<span>Nexa</span>
          </h2>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>

        </div>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <div className="admin-menu-section">

          <p className="admin-menu-heading">
            MAIN MENU
          </p>

          <nav className="admin-navigation">

            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin/dashboard"}
                className={({ isActive }) =>
                  isActive
                    ? "admin-nav-link active"
                    : "admin-nav-link"
                }
                onClick={() => setSidebarOpen(false)}
              >

                <span className="admin-nav-icon">
                  {item.icon}
                </span>

                <span>{item.name}</span>

              </NavLink>
            ))}

          </nav>

        </div>

        {/* =====================================
            SIDEBAR BOTTOM
        ===================================== */}

        <div className="admin-sidebar-bottom">

          {/* =====================================
              ADMIN PROFILE
          ===================================== */}

          <div className="admin-profile-section">

            <button
              type="button"
              className="admin-profile-btn"
              onClick={() =>
                setShowAdminMenu((prev) => !prev)
              }
              aria-expanded={showAdminMenu}
              aria-label="Toggle admin profile menu"
            >

              <div className="admin-profile-avatar">
                <FiUser />
              </div>

              <div className="admin-profile-info">
                <h4>Admin User</h4>
                <p>Administrator</p>
              </div>

              <FiChevronDown
                className={`admin-profile-arrow ${
                  showAdminMenu ? "rotate" : ""
                }`}
              />

            </button>

            {/* =====================================
                ADMIN DROPDOWN
            ===================================== */}

            {showAdminMenu && (
              <div className="admin-dropdown">

                {/* DROPDOWN HEADER */}

                <div className="admin-dropdown-header">

                  <div className="admin-dropdown-avatar">
                    <FiUser />
                  </div>

                  <div className="admin-dropdown-user">
                    <h3>Admin User</h3>
                    <p>Administrator Account</p>
                  </div>

                  <button
                    type="button"
                    className="admin-dropdown-close"
                    onClick={closeAdminMenu}
                    aria-label="Close profile menu"
                  >
                    <FiX />
                  </button>

                </div>

                <div className="admin-dropdown-divider" />

                {/* MY PROFILE */}

                <button
                  type="button"
                  className="admin-dropdown-item"
                  onClick={() =>
                    handleAdminNavigation("/admin/profile")
                  }
                >
                  <FiUser />
                  <span>My Profile</span>
                </button>

                {/* ACCOUNT SETTINGS */}

                <button
                  type="button"
                  className="admin-dropdown-item"
                  onClick={() =>
                    handleAdminNavigation("/admin/settings")
                  }
                >
                  <FiSettings />
                  <span>Account Settings</span>
                </button>

                {/* CHANGE PASSWORD */}

                <button
                  type="button"
                  className="admin-dropdown-item"
                  onClick={() =>
                    handleAdminNavigation("/admin/change-password")
                  }
                >
                  <FiLock />
                  <span>Change Password</span>
                </button>

                <div className="admin-dropdown-divider" />

                {/* LOGOUT */}

                <button
                  type="button"
                  className="admin-dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>

              </div>
            )}

          </div>

          {/* =====================================
              SIDEBAR LOGOUT
          ===================================== */}

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="admin-main">

        {/* MOBILE HEADER */}

        <div className="admin-mobile-header">

          <button
            type="button"
            className="admin-mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FiGrid />
          </button>

          <h2>
            Shop<span>Nexa</span>
          </h2>

        </div>

        {/* PAGE CONTENT */}

        <div className="admin-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;
