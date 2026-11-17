
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api";
import "./Navbar.css";

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    package: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="M3 8v9l9 5 9-5V8" />
        <path d="M12 13v9" />
      </>
    ),
    cart: (
      <>
        <circle cx="9" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2 3h2l3.2 12.2a2 2 0 0 0 2 1.5h9.5a2 2 0 0 0 1.9-1.5L22 8H5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </>
    ),
    chevron: <path d="m7 10 5 5 5-5" />,
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    tag: (
      <>
        <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
        <circle cx="7.5" cy="7.5" r="1" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function Navbar() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check customer login status
  const updateAuthState = useCallback(() => {
    const token =
      localStorage.getItem("customerToken") ||
      sessionStorage.getItem("customerToken");

    setIsLoggedIn(Boolean(token));
  }, []);

  // Get total quantity from backend cart
  const updateCartCount = useCallback(async () => {
    const token =
      localStorage.getItem("customerToken") ||
      sessionStorage.getItem("customerToken");

    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const response = await API.get("/customer/cart");
      const data = response.data;

      const items =
        data?.cart?.items ||
        data?.cart?.products ||
        data?.cartItems ||
        data?.items ||
        (Array.isArray(data?.cart) ? data.cart : null) ||
        data?.products ||
        [];

      if (!Array.isArray(items)) {
        console.warn("Unexpected cart response:", data);
        setCartCount(0);
        return;
      }

      const count = items.reduce((sum, item) => {
        return sum + Math.max(0, Number(item.quantity) || 1);
      }, 0);

      setCartCount(count);
    } catch (error) {
      console.error("Navbar cart count error:", error);

      if (error.response?.status === 401) {
        setCartCount(0);
      }
    }
  }, []);

  // Initial authentication and event listeners
  useEffect(() => {
    updateAuthState();
    updateCartCount();

    const handleAuthUpdate = () => {
      updateAuthState();
      updateCartCount();
    };

    const handleStorageUpdate = () => {
      updateAuthState();
      updateCartCount();
    };

    window.addEventListener("auth-updated", handleAuthUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("auth-updated", handleAuthUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, [updateAuthState, updateCartCount]);

  // Refresh when route changes
  useEffect(() => {
    updateAuthState();
    updateCartCount();
  }, [location.pathname, updateAuthState, updateCartCount]);

  // Keep search and category synced with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSearch(params.get("search") || "");
    setCategory(params.get("category") || "");
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  // Customer logout
  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    sessionStorage.removeItem("customerToken");

    localStorage.removeItem("shopnexa_user");
    sessionStorage.removeItem("shopnexa_user");

    localStorage.removeItem("shopnexa_demo_user");
    sessionStorage.removeItem("shopnexa_demo_user");

    setIsLoggedIn(false);
    setCartCount(0);
    setMenuOpen(false);

    window.dispatchEvent(new Event("auth-updated"));
    window.dispatchEvent(new Event("cart-updated"));

    navigate("/", { replace: true });
  };

  // Navigate using current search and category
  const applyFilters = (searchValue, categoryValue) => {
    const params = new URLSearchParams();
    const query = searchValue.trim();

    if (query) params.set("search", query);

    if (categoryValue && categoryValue !== "all") {
      params.set("category", categoryValue);
    }

    const queryString = params.toString();

    navigate(
      queryString ? `/products?${queryString}` : "/products"
    );
  };

  const handleSearch = (event) => {
    event.preventDefault();
    applyFilters(search, category);
    setMenuOpen(false);
  };

  const handleLiveSearch = (value) => {
    setSearch(value);
    applyFilters(value, category);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    applyFilters(search, value);
  };

  const goToProducts = (selectedCategory = "") => {
    setCategory(selectedCategory);
    setSearch("");
    applyFilters("", selectedCategory);
    setMenuOpen(false);
  };

  const isProducts = location.pathname === "/products";

  const activeCategory = new URLSearchParams(
    location.search
  ).get("category");

  return (
    <header className="shop-navbar">
      <div className="navbar-main">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="shop-navigation"
        >
          <Icon name={menuOpen ? "close" : "menu"} size={23} />
        </button>

        <Link to="/" className="shop-logo">
          <span className="logo-icon">S</span>
          <span className="logo-wordmark">
            Shop<span className="logo-highlight">Nexa</span>
            <small>SMART SHOPPING, BETTER LIVING</small>
          </span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <label className="search-category">
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(event) =>
                handleCategoryChange(event.target.value)
              }
            >
              <option value="">All Categories</option>
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
            </select>
            <Icon name="chevron" size={14} />
          </label>

          <input
            type="search"
            placeholder="Search products, brands and more..."
            aria-label="Search products"
            value={search}
            onChange={(event) =>
              handleLiveSearch(event.target.value)
            }
          />

          <button type="submit" className="search-btn" aria-label="Search">
            <Icon name="search" size={20} />
          </button>
        </form>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <button
              type="button"
              className="nav-action logout-action"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <span className="action-icon">
                <Icon name="logout" size={23} />
              </span>
              <span className="action-text">
                <small>Customer account</small>
                <strong>Logout</strong>
              </span>
            </button>
          ) : (
            <Link to="/login" className="nav-action">
              <span className="action-icon">
                <Icon name="user" size={23} />
              </span>
              <span className="action-text">
                <small>Welcome</small>
                <strong>Sign In</strong>
              </span>
            </Link>
          )}

          <Link to="/orders" className="nav-action orders-action">
            <span className="action-icon">
              <Icon name="package" size={23} />
            </span>
            <span className="action-text">
              <small>Track your</small>
              <strong>Orders</strong>
            </span>
          </Link>

          <Link
            to="/cart"
            className="nav-cart"
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <span className="cart-icon">
              <Icon name="cart" size={24} />
              <span className="cart-count">{cartCount}</span>
            </span>
            <span className="cart-label">Cart</span>
          </Link>
        </div>
      </div>

      <nav
        id="shop-navigation"
        className={`navbar-bottom ${menuOpen ? "menu-open" : ""}`}
        aria-label="Main navigation"
      >
        <button
          type="button"
          className={`all-categories ${
            isProducts && !activeCategory ? "active" : ""
          }`}
          onClick={() => goToProducts("")}
        >
          <Icon name="menu" size={17} />
          <span>All Categories</span>
        </button>

        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/products" onClick={() => setMenuOpen(false)}>
          Shop All
        </Link>

        <button
          type="button"
          className={`nav-category-button ${
            activeCategory === "Electronics" ? "active" : ""
          }`}
          onClick={() => goToProducts("Electronics")}
        >
          Electronics
        </button>

        <button
          type="button"
          className={`nav-category-button ${
            activeCategory === "Fashion" ? "active" : ""
          }`}
          onClick={() => goToProducts("Fashion")}
        >
          Fashion
        </button>

        <button
          type="button"
          className={`nav-category-button ${
            activeCategory === "Accessories" ? "active" : ""
          }`}
          onClick={() => goToProducts("Accessories")}
        >
          Accessories
        </button>

        <Link to="/orders" onClick={() => setMenuOpen(false)}>
          My Orders
        </Link>

        <button
          type="button"
          className="nav-offer"
          onClick={() => goToProducts("")}
        >
          <Icon name="tag" size={16} />
          <span>Special Offers</span>
          <Icon name="arrow" size={14} />
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
