
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  ChartNoAxesColumn,
  Settings,
  LogOut,
  UserRound,
} from "lucide-react";

import "./AdminSidebar.css";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: Layers,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: ChartNoAxesColumn,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove admin authentication data if used
    localStorage.removeItem("adminToken");

    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">

      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-icon">S</div>

        <h2>
          Shop<span>Nexa</span>
        </h2>
      </div>

      {/* Main Menu */}
      <div className="admin-sidebar-menu">

        <p className="admin-menu-heading">MAIN MENU</p>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "admin-nav-link active"
                    : "admin-nav-link"
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

      </div>

      {/* Admin Profile - Common */}
      <div className="admin-sidebar-bottom">

        <div className="admin-user-info">
          <div className="admin-user-avatar">
            <UserRound size={18} />
          </div>

          <div className="admin-user-details">
            <h4>Admin User</h4>
            <span>Administrator</span>
          </div>
        </div>

        {/* Logout - Common */}
        <button
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default AdminSidebar;
