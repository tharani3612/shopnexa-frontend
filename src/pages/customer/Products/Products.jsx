import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Heart,
  Package,
  ArrowUpRight,
  RefreshCw,
  X,
  Check,
  ImageOff,
  AlertCircle,
} from "lucide-react";

import API from "../../../services/api";
import "./Products.css";

const categories = [
  "All",
  "Fashion",
  "Footwear",
  "Electronics",
  "Accessories",
];

function getSavedWishlist() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("shopnexa_wishlist") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState(() => {
    const requested = searchParams.get("category") || "";

    return (
      categories.find(
        (item) => item.toLowerCase() === requested.toLowerCase()
      ) || "All"
    );
  });

  const [search, setSearch] = useState(
    () => searchParams.get("search") || ""
  );

  const [sort, setSort] = useState("featured");

  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const [addingProduct, setAddingProduct] = useState("");

  const [wishlist, setWishlist] = useState(getSavedWishlist);

  const [imageErrors, setImageErrors] = useState([]);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/customer/products");

      const fetchedProducts = response.data?.products;

      setProducts(
        Array.isArray(fetchedProducts) ? fetchedProducts : []
      );

      setImageErrors([]);
    } catch (err) {
      console.error("Products Fetch Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Synchronize category and search with URL
  useEffect(() => {
    const requestedCategory =
      searchParams.get("category") || "";

    const requestedSearch =
      searchParams.get("search") || "";

    const matchedCategory = categories.find(
      (item) =>
        item.toLowerCase() === requestedCategory.toLowerCase()
    );

    setCategory(matchedCategory || "All");
    setSearch(requestedSearch);
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" ||
        (product.category || "").trim().toLowerCase() ===
          category.toLowerCase();

      const searchText = [
        product.name,
        product.category,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        search.trim().toLowerCase()
      );

      return matchesCategory && matchesSearch;
    });

    if (sort === "low") {
      result = [...result].sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    } else if (sort === "high") {
      result = [...result].sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    } else if (sort === "name") {
      result = [...result].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    }

    return result;
  }, [products, category, search, sort]);

  // Change category and synchronize URL
  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);

    const params = {};

    if (selectedCategory !== "All") {
      params.category = selectedCategory;
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    setSearchParams(params, { replace: true });
  };

  // Search products
  const handleSearchChange = (value) => {
    setSearch(value);

    const params = {};

    if (category !== "All") {
      params.category = category;
    }

    if (value.trim()) {
      params.search = value.trim();
    }

    setSearchParams(params, { replace: true });
  };

  // Add product to cart
  const addToCart = async (product) => {
    if (!product?._id) {
      setNoticeType("error");
      setNotice("Invalid product. Please try again.");
      return;
    }

    const token =
      localStorage.getItem("customerToken") ||
      sessionStorage.getItem("customerToken");

    if (!token) {
      setNoticeType("error");
      setNotice("Please login to add products to cart.");
      return;
    }

    if (addingProduct) return;

    setAddingProduct(product._id);
    setNotice("");

    try {
      await API.post("/customer/cart/add", {
        productId: product._id,
        quantity: 1,
      });

      window.dispatchEvent(new Event("cart-updated"));

      setNoticeType("success");
      setNotice(`${product.name} added to your cart!`);
    } catch (err) {
      console.error("Add To Cart Error:", err);

      setNoticeType("error");
      setNotice(
        err.response?.data?.message ||
          "Unable to add product to cart."
      );
    } finally {
      setAddingProduct("");
    }
  };

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    const updatedWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(updatedWishlist);

    try {
      localStorage.setItem(
        "shopnexa_wishlist",
        JSON.stringify(updatedWishlist)
      );

      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error("Wishlist Storage Error:", err);

      setNoticeType("error");
      setNotice("Unable to update wishlist.");
    }
  };

  // Format price
  const formatPrice = (price) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) return "Price unavailable";

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Clear all filters
  const clearFilters = () => {
    setCategory("All");
    setSearch("");
    setSort("featured");
    setNotice("");
    setSearchParams({}, { replace: true });
  };

  // Handle image loading errors
  const handleImageError = (productId) => {
    setImageErrors((previous) =>
      previous.includes(productId)
        ? previous
        : [...previous, productId]
    );
  };

  // Stock validation
  const getStockInfo = (product) => {
    const hasStockInfo =
      product.stock !== undefined &&
      product.stock !== null &&
      product.stock !== "" &&
      Number.isFinite(Number(product.stock));

    const stock = hasStockInfo
      ? Number(product.stock)
      : null;

    return {
      stock,
      isOutOfStock: stock !== null && stock <= 0,
      hasStockInfo,
    };
  };

  return (
    <main className="products-page">

      {/* Product Toolbar - Page Header Removed */}
      <section className="products-toolbar">

        <div className="products-toolbar-left">

          <div className="products-result-count">
            <span>{filteredProducts.length}</span> Products
          </div>

          <div className="products-sort">
            <SlidersHorizontal size={16} />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

        </div>

        <div className="products-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search products"
          />

          {search && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

      </section>

      {/* Category Filters */}
      <section className="products-categories">

        <div className="products-category-list">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={
                category === item
                  ? "products-category active"
                  : "products-category"
              }
              onClick={() => handleCategoryChange(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        {(category !== "All" ||
          search ||
          sort !== "featured") && (
          <button
            type="button"
            className="products-clear-filter"
            onClick={clearFilters}
          >
            <RefreshCw size={14} />
            Clear Filters
          </button>
        )}

      </section>

      {/* Notification */}
      {notice && (
        <div
          className={`products-notice ${noticeType}`}
          role="status"
          aria-live="polite"
        >
          {noticeType === "success" ? (
            <Check size={17} />
          ) : (
            <AlertCircle size={17} />
          )}

          <span>{notice}</span>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Products Content */}
      <section className="products-content">

        {loading ? (
          <div className="products-loading">
            <div className="products-loader"></div>
            <p>Finding your favourites...</p>
          </div>
        ) : error ? (
          <div className="products-error">
            <Package size={38} />

            <h3>Something went wrong</h3>

            <p>{error}</p>

            <button type="button" onClick={fetchProducts}>
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-empty">

            <div className="products-empty-icon">
              <Search size={32} />
            </div>

            <h3>No products found</h3>

            <p>
              We couldn't find any products matching your search.
              Try another keyword or category.
            </p>

            <button type="button" onClick={clearFilters}>
              Explore All Products
            </button>

          </div>
        ) : (
          <div className="products-grid">

            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product._id);

              const {
                stock,
                isOutOfStock,
                hasStockInfo,
              } = getStockInfo(product);

              const hasImage =
                product.image &&
                !imageErrors.includes(product._id);

              return (
                <article
                  className="product-card"
                  key={product._id}
                >

                  {/* Product Image */}
                  <div className="product-card-image">

                    <Link
                      to={`/products/${product._id}`}
                      className="product-image-link"
                      aria-label={`View ${product.name}`}
                    >
                      {hasImage ? (
                        <img
                          src={product.image}
                          alt={product.name || "Product"}
                          loading="lazy"
                          onError={() =>
                            handleImageError(product._id)
                          }
                        />
                      ) : (
                        <div className="product-image-placeholder">
                          <ImageOff size={34} />
                          <span>Image unavailable</span>
                        </div>
                      )}
                    </Link>

                    <span className="product-category-tag">
                      {product.category || "General"}
                    </span>

                    {/* Wishlist */}
                    <button
                      type="button"
                      className={
                        isWishlisted
                          ? "product-wishlist active"
                          : "product-wishlist"
                      }
                      onClick={() => toggleWishlist(product._id)}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      aria-pressed={isWishlisted}
                    >
                      <Heart
                        size={18}
                        fill={
                          isWishlisted
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    {/* Out of Stock */}
                    {isOutOfStock && (
                      <span className="product-stock-badge">
                        Out of Stock
                      </span>
                    )}

                    {/* Quick View */}
                    <Link
                      to={`/products/${product._id}`}
                      className="product-quick-view"
                    >
                      Quick View
                      <ArrowUpRight size={15} />
                    </Link>

                  </div>

                  {/* Product Details */}
                  <div className="product-card-details">

                    <span className="product-card-category">
                      {product.category || "General"}
                    </span>

                    <Link
                      to={`/products/${product._id}`}
                      className="product-card-name"
                    >
                      {product.name || "Unnamed Product"}
                    </Link>

                    <div className="product-card-bottom">

                      <div className="product-card-price">
                        {formatPrice(product.price)}
                      </div>

                      {hasStockInfo && (
                        <span
                          className={
                            isOutOfStock
                              ? "product-stock unavailable"
                              : "product-stock available"
                          }
                        >
                          {isOutOfStock
                            ? "Unavailable"
                            : `${stock} available`}
                        </span>
                      )}

                    </div>

                    {/* Add To Cart */}
                    <button
                      type="button"
                      className="product-add-cart"
                      disabled={
                        isOutOfStock ||
                        addingProduct === product._id
                      }
                      onClick={() => addToCart(product)}
                    >
                      {addingProduct === product._id ? (
                        "Adding..."
                      ) : isOutOfStock ? (
                        "Out of Stock"
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          Add to Cart
                        </>
                      )}
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>

      {/* Bottom Information */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="products-bottom-info">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}

    </main>
  );
}

export default Products;