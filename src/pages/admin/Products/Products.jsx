
import { useMemo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Package,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Boxes,
} from "lucide-react";

import "./Products.css";

const API_URL = "https://shopnexa-backend-wjk6.onrender.com/api/admin/products";
const CATEGORY_API = "https://shopnexa-backend-wjk6.onrender.com/api/admin/categories";

// PAGE ANIMATION
const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      staggerChildren: 0.09,
    },
  },
};

// ITEM ANIMATION
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// ANIMATED NUMBER
function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 900;
    const startTime = performance.now();
    let frame;

    const animate = (time) => {
      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(value * easedProgress));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{count.toLocaleString("en-IN")}</>;
}

// PRODUCTS PAGE
function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // =====================================
  // FETCH PRODUCTS FROM MONGODB
  // =====================================
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin session not found. Please login again."
        );
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch products."
        );
      }

      setProducts(data.products || []);
    } catch (err) {
      console.error("Fetch Products Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================
  // FETCH CATEGORIES FROM MONGODB
  // =====================================
  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin session not found. Please login again."
        );
      }

      const response = await fetch(CATEGORY_API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch categories."
        );
      }

      const activeCategories = (data.categories || []).filter(
        (item) => item.status === "Active"
      );

      setCategories(activeCategories);
    } catch (err) {
      console.error("Fetch Categories Error:", err);
    }
  }, []);

  // =====================================
  // LOAD PRODUCTS AND CATEGORIES
  // =====================================
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // =====================================
  // CATEGORY FILTER OPTIONS
  // =====================================
  const categoryOptions = useMemo(() => {
    const categoryNames = new Set(
      categories.map((item) => item.name)
    );

    // Include old product categories too,
    // so existing products can still be filtered.
    products.forEach((product) => {
      const productCategory =
        typeof product.category === "object"
          ? product.category?.name
          : product.category;

      if (productCategory) {
        categoryNames.add(productCategory);
      }
    });

    return ["All", ...Array.from(categoryNames).sort()];
  }, [categories, products]);

  // =====================================
  // PRODUCT COUNTS
  // =====================================
  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) =>
      product.isActive !== false &&
      Number(product.stock) > 0
  ).length;

  const outOfStock = products.filter(
    (product) => Number(product.stock) <= 0
  ).length;

  // =====================================
  // SEARCH AND CATEGORY FILTER
  // =====================================
  const filteredProducts = products.filter((product) => {
    const searchValue = search.toLowerCase().trim();

    const productCategory =
      typeof product.category === "object"
        ? product.category?.name || "Uncategorized"
        : product.category || "Uncategorized";

    const productName =
      product.name || product.title || "";

    const matchesSearch =
      productName.toLowerCase().includes(searchValue) ||
      productCategory.toLowerCase().includes(searchValue);

    const matchesCategory =
      category === "All" ||
      productCategory === category;

    return matchesSearch && matchesCategory;
  });

  // =====================================
  // DELETE PRODUCT FROM MONGODB
  // =====================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin session not found. Please login again."
        );
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete product."
        );
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== id
        )
      );

      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Delete Product Error:", err);

      alert(
        err.message || "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // STATISTICS
  // =====================================
  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      description: "Products in your store",
      icon: Package,
      color: "pink",
    },
    {
      title: "Active Products",
      value: activeProducts,
      description: "Available for customers",
      icon: CheckCircle2,
      color: "green",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      description: "Products need restocking",
      icon: AlertTriangle,
      color: "orange",
    },
  ];

  // =====================================
  // RENDER
  // =====================================
  return (
    <motion.div
      className="admin-products"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* PAGE HEADER */}
      <motion.div
        className="products-header"
        variants={itemVariants}
      >
        <div className="products-heading">
          <motion.div
            className="products-heading-icon"
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ duration: 0.25 }}
          >
            <Boxes size={21} />
          </motion.div>

          <div>
            <h1>Products</h1>
            <p>Manage your store products</p>
          </div>
        </div>

        <motion.div
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            to="/admin/products/add"
            className="add-product-btn"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* STATISTICS */}
      <motion.div
        className="products-stats"
        variants={itemVariants}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              className="product-stat-card"
              key={stat.title}
              variants={itemVariants}
              whileHover={{
                y: -6,
                scale: 1.015,
                transition: { duration: 0.22 },
              }}
            >
              <div className="product-stat-top">
                <motion.div
                  className={`product-stat-icon ${stat.color}`}
                  whileHover={{ rotate: -8, scale: 1.12 }}
                  transition={{ duration: 0.25 }}
                >
                  <Icon size={21} />
                </motion.div>

                <span className="product-stat-number">
                  <AnimatedNumber value={stat.value} />
                </span>
              </div>

              <h3>{stat.title}</h3>
              <p>{stat.description}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* PRODUCTS TABLE CONTAINER */}
      <motion.div
        className="products-container"
        variants={itemVariants}
      >
        {/* TOOLBAR */}
        <div className="products-toolbar">
          <div className="products-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <AnimatePresence>
              {search && (
                <motion.button
                  className="clear-search-btn"
                  onClick={() => setSearch("")}
                  type="button"
                  aria-label="Clear search"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                >
                  ×
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* DYNAMIC CATEGORY FILTER */}
          <div className="products-filter-box">
            <SlidersHorizontal size={17} />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {categoryOptions.map((item) => (
                <option value={item} key={item}>
                  {item === "All"
                    ? "All Categories"
                    : item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE INFO */}
        <div className="products-table-heading">
          <div>
            <h2>All Products</h2>

            <p>
              Showing {filteredProducts.length} of{" "}
              {totalProducts} products
            </p>
          </div>

          <motion.span
            className="products-count-badge"
            key={filteredProducts.length}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {filteredProducts.length} Products
          </motion.span>
        </div>

        {/* PRODUCTS TABLE */}
        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="no-products">
                      <h3>Loading products...</h3>
                      <p>
                        Please wait while we fetch your products.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6">
                    <div className="no-products">
                      <h3>Unable to load products</h3>
                      <p>{error}</p>

                      <button
                        type="button"
                        onClick={fetchProducts}
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => {
                      const id = product._id;

                      const name =
                        product.name ||
                        product.title ||
                        "Unnamed Product";

                      const productCategory =
                        typeof product.category === "object"
                          ? product.category?.name ||
                            "Uncategorized"
                          : product.category ||
                            "Uncategorized";

                      const price = Number(product.price) || 0;
                      const stock = Number(product.stock) || 0;

                      const isActive =
                        product.isActive !== false &&
                        stock > 0;

                      return (
                        <motion.tr
                          key={id}
                          layout
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{
                            duration: 0.28,
                            delay: index * 0.045,
                            layout: { duration: 0.25 },
                          }}
                        >
                          <td>
                            <div className="product-name-cell">
                              <motion.div
                                className="product-placeholder"
                                whileHover={{
                                  scale: 1.1,
                                  rotate: 5,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <Package size={19} />
                              </motion.div>

                              <div>
                                <strong>{name}</strong>

                                <span>
                                  SKU:{" "}
                                  {product.sku ||
                                    `SN-${String(id)
                                      .slice(-6)
                                      .toUpperCase()}`}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="product-category">
                              {productCategory}
                            </span>
                          </td>

                          <td className="product-price">
                            ₹{price.toLocaleString("en-IN")}
                          </td>

                          <td>
                            <span
                              className={
                                stock === 0
                                  ? "product-stock zero"
                                  : "product-stock"
                              }
                            >
                              {stock} units
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                isActive
                                  ? "product-status active"
                                  : "product-status out"
                              }
                            >
                              <span className="status-indicator"></span>

                              {isActive
                                ? "Active"
                                : "Out of Stock"}
                            </span>
                          </td>

                          <td>
                            <div className="product-actions">
                              {/* EDIT BUTTON */}
                              <motion.div
                                whileHover={{
                                  y: -2,
                                  scale: 1.08,
                                }}
                                whileTap={{ scale: 0.94 }}
                              >
                                <Link
                                  to={`/admin/products/edit/${id}`}
                                  className="product-action-btn edit"
                                  title="Edit product"
                                  aria-label={`Edit ${name}`}
                                >
                                  <Pencil size={15} />
                                </Link>
                              </motion.div>

                              {/* DELETE BUTTON */}
                              <motion.button
                                type="button"
                                className="product-action-btn delete"
                                title="Delete product"
                                aria-label={`Delete ${name}`}
                                disabled={deletingId === id}
                                onClick={() => handleDelete(id)}
                                whileHover={{
                                  y: -2,
                                  scale: 1.08,
                                }}
                                whileTap={{ scale: 0.94 }}
                              >
                                <Trash2 size={15} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td colSpan="6">
                        <div className="no-products">
                          <motion.div
                            className="no-products-icon"
                            initial={{
                              scale: 0.7,
                              opacity: 0,
                            }}
                            animate={{
                              scale: 1,
                              opacity: 1,
                            }}
                            transition={{ duration: 0.35 }}
                          >
                            <Package size={28} />
                          </motion.div>

                          <h3>No products found</h3>

                          <p>
                            Try changing your search or category
                            filter.
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setSearch("");
                              setCategory("All");
                            }}
                          >
                            Clear Filters
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FOOTER */}
      <motion.div
        className="products-footer"
        variants={itemVariants}
      >
        <span>© 2026 ShopNexa. All rights reserved.</span>
        <span>Product Management</span>
      </motion.div>
    </motion.div>
  );
}
export default Products;
