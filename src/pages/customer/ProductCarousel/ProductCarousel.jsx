
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import products from "../../data/products";
import "./ProductCarousel.css";

function ProductCarousel() {
  const sliderRef = useRef(null);
  const [notice, setNotice] = useState("");

  // Automatic horizontal product movement
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const timer = setInterval(() => {
      if (
        slider.matches(":hover") ||
        slider.matches(":focus-within")
      ) {
        return;
      }

      const maxScroll =
        slider.scrollWidth - slider.clientWidth;

      if (maxScroll <= 0) return;

      if (slider.scrollLeft >= maxScroll - 5) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({
          left: 270,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const moveSlider = (direction) => {
    sliderRef.current?.scrollBy({
      left: direction * 270,
      behavior: "smooth",
    });
  };

  const addToCart = (product) => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("shopnexa_cart") || "[]"
      );

      const cart = Array.isArray(savedCart) ? savedCart : [];

      const existing = cart.find(
        (item) => Number(item.id) === Number(product.id)
      );

      const updatedCart = existing
        ? cart.map((item) =>
            Number(item.id) === Number(product.id)
              ? {
                  ...item,
                  quantity: Math.max(
                    1,
                    Number(item.quantity) || 1
                  ) + 1,
                }
              : item
          )
        : [...cart, { ...product, quantity: 1 }];

      localStorage.setItem(
        "shopnexa_cart",
        JSON.stringify(updatedCart)
      );

      window.dispatchEvent(new Event("cart-updated"));
      setNotice(`${product.name} added to cart!`);

      window.setTimeout(() => setNotice(""), 2500);
    } catch (error) {
      console.error("Add to cart error:", error);
      setNotice("Could not add product. Please try again.");
    }
  };

  return (
    <section className="sn-carousel">
      <div className="sn-carousel-heading">
        <div>
          <span className="sn-carousel-eyebrow">
            JUST FOR YOU
          </span>

          <h2>Trending Products</h2>

          <p>Discover something you'll love.</p>
        </div>

        <div className="sn-carousel-navigation">
          <button
            type="button"
            onClick={() => moveSlider(-1)}
            aria-label="Previous products"
          >
            &#8592;
          </button>

          <button
            type="button"
            onClick={() => moveSlider(1)}
            aria-label="Next products"
          >
            &#8594;
          </button>
        </div>
      </div>

      {notice && (
        <p className="sn-carousel-notice" role="status">
          {notice}
        </p>
      )}

      <div
        className="sn-carousel-track"
        ref={sliderRef}
        aria-label="Trending products"
      >
        {products.map((product) => {
          const discount =
            product.originalPrice > product.price
              ? Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )
              : 0;

          return (
            <article
              className="sn-carousel-card"
              key={product.id}
            >
              <Link
                to={`/products/${product.id}`}
                className="sn-carousel-image"
                aria-label={`View ${product.name}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />

                {product.badge && (
                  <span className="sn-carousel-badge">
                    {product.badge}
                  </span>
                )}

                {discount > 0 && (
                  <span className="sn-carousel-discount">
                    {discount}% OFF
                  </span>
                )}
              </Link>

              <div className="sn-carousel-info">
                <span className="sn-carousel-category">
                  {product.category}
                </span>

                <Link
                  to={`/products/${product.id}`}
                  className="sn-carousel-name"
                >
                  {product.name}
                </Link>

                <p className="sn-carousel-rating">
                  <span>★</span> {product.rating} / 5
                </p>

                <div className="sn-carousel-price">
                  <strong>
                    ₹{product.price.toLocaleString("en-IN")}
                  </strong>

                  {product.originalPrice > product.price && (
                    <del>
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </del>
                  )}
                </div>

                <button
                  type="button"
                  className="sn-carousel-add"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="sn-carousel-footer">
        <Link to="/products">
          Explore All Products <span>→</span>
        </Link>
      </div>
    </section>
  );
}

export default ProductCarousel;
