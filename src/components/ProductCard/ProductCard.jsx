
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Products.css";

const productData = [
  {
    id: 1,
    name: "Classic Everyday Sneakers",
    category: "Footwear",
    price: 1299,
    originalPrice: 2499,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    badge: "BESTSELLER",
  },
  {
    id: 2,
    name: "Minimal Everyday Watch",
    category: "Accessories",
    price: 1599,
    originalPrice: 2999,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    badge: "TRENDING",
  },
  {
    id: 3,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 2199,
    originalPrice: 3999,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    badge: "HOT DEAL",
  },
  {
    id: 4,
    name: "Everyday Travel Backpack",
    category: "Accessories",
    price: 999,
    originalPrice: 1799,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    badge: "",
  },
  {
    id: 5,
    name: "Modern Casual Outfit",
    category: "Fashion",
    price: 1499,
    originalPrice: 2499,
    rating: 4.1,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
    badge: "NEW",
  },
  {
    id: 6,
    name: "Classic Sunglasses",
    category: "Accessories",
    price: 799,
    originalPrice: 1499,
    rating: 4.0,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    badge: "",
  },
  {
    id: 7,
    name: "Running Performance Shoes",
    category: "Footwear",
    price: 1899,
    originalPrice: 3299,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80",
    badge: "TOP RATED",
  },
  {
    id: 8,
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 1199,
    originalPrice: 1999,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=600&q=80",
    badge: "DEAL",
  },
];

const categories = [
  "All",
  "Fashion",
  "Footwear",
  "Electronics",
  "Accessories",
];

function Products() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(() => {
    const requested = searchParams.get("category") || "";
    const match = categories.find(
      (item) => item.toLowerCase() === requested.toLowerCase()
    );
    return match || "All";
  });
  const [search, setSearch] = useState(
    () => searchParams.get("search") || ""
  );
  const [sort, setSort] = useState("featured");
  const [notice, setNotice] = useState("");

  const filteredProducts = useMemo(() => {
    let result = productData.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch = `${product.name} ${product.category}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [category, search, sort]);

  function addToCart(product) {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("shopnexa_cart") || "[]"
      );

      const cart = Array.isArray(savedCart) ? savedCart : [];
      const existingProduct = cart.find((item) => item.id === product.id);

      let updatedCart;

      if (existingProduct) {
        updatedCart = cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
            : item
        );
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
      }

      localStorage.setItem("shopnexa_cart", JSON.stringify(updatedCart));
      setNotice(`${product.name} added to your cart!`);
    } catch {
      setNotice("Unable to update cart. Please try again.");
    }
  }

  return (
    <main className="products-page">
      <div className="products-breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <span>Shop All</span>
      </div>

      <section className="products-heading">
        <div>
          <p>YOUR NEXT FAVOURITE IS HERE</p>
          <h1>Discover Products</h1>
          <span>Explore everyday essentials and trending styles.</span>
        </div>

        <div className="products-heading-count">
          <strong>{filteredProducts.length}</strong>
          <span>products found</span>
        </div>
      </section>

      <div className="products-toolbar">
        <div className="products-categories">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="products-controls">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {notice && (
        <div className="products-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            ✕
          </button>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <section className="products-grid">
          {filteredProducts.map((product) => {
            const discount = Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            );

            return (
              <article className="product-card" key={product.id}>
                <a
                  className="product-card-image"
                  href={`/product/${product.id}`}
                  aria-label={`View ${product.name}`}
                >
                  <img src={product.image} alt={product.name} loading="lazy" />

                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}

                  <span className="product-discount">{discount}% OFF</span>
                </a>

                <div className="product-card-content">
                  <span className="product-category">{product.category}</span>
                  <h2>{product.name}</h2>

                  <div className="product-rating">
                    <span>★ {product.rating}</span>
                    <small>Customer rating</small>
                  </div>

                  <div className="product-prices">
                    <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                    <del>
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </del>
                    <span>{discount}% off</span>
                  </div>

                  <button
                    className="add-to-cart-btn"
                    type="button"
                    onClick={() => addToCart(product)}
                  >
                    + Add to Cart
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="products-empty">
          <span>⌕</span>
          <h2>No products found</h2>
          <p>Try another search or select a different category.</p>
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
      )}
    </main>
  );
}

export default Products;
