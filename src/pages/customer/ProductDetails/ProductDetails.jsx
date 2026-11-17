
import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

import API from "../../../services/api";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH PRODUCT FROM MONGODB
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const response = await API.get(
          `/customer/products/${id}`
        );

        const fetchedProduct =
          response.data.product || response.data;

        if (!fetchedProduct || !fetchedProduct._id) {
          setError("Product not found.");
          return;
        }

        setProduct(fetchedProduct);
      } catch (err) {
        console.error("Product Details Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load product details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ADD TO CART
  async function addToCart(goToCheckout = false) {
    try {
      const token =
        localStorage.getItem("customerToken") ||
        sessionStorage.getItem("customerToken");

      if (!token) {
        navigate("/login");
        return;
      }

      await API.post("/customer/cart/add", {
        productId: product._id,
        quantity,
      });

      window.dispatchEvent(new Event("cart-updated"));

      if (goToCheckout) {
        navigate("/checkout");
      } else {
        setNotice("Product added to cart successfully!");
      }
    } catch (err) {
      console.error("Add To Cart Error:", err);

      setNotice(
        err.response?.data?.message ||
          "Unable to add product to cart."
      );
    }
  }

  // LOADING
  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <h1>Loading Product...</h1>
          <p>Please wait.</p>
        </div>
      </main>
    );
  }

  // ERROR / PRODUCT NOT FOUND
  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <h1>Product Not Found</h1>

          <p>
            {error ||
              "This product may have been removed or does not exist."}
          </p>

          <Link to="/products">Browse Products</Link>
        </div>
      </main>
    );
  }

  // PRODUCT VALUES
  const price = Number(product.price || 0);

  const originalPrice = Number(
    product.originalPrice ||
      product.original_price ||
      product.price ||
      0
  );

  const rating = Number(product.rating || 0);

  const stock = Number(product.stock || 0);

  const discount =
    originalPrice > price && originalPrice > 0
      ? Math.round(
          ((originalPrice - price) / originalPrice) * 100
        )
      : 0;

  const formatPrice = (value) =>
    Number(value).toLocaleString("en-IN");

  return (
    <main className="product-details-page">

      {/* BREADCRUMB */}
      <nav className="product-details-breadcrumb">
        <Link to="/">Home</Link>

        <span> / </span>

        <Link to="/products">Products</Link>

        <span> / </span>

        <span>{product.name}</span>
      </nav>

      {/* PRODUCT DETAILS */}
      <section className="product-details-layout">

        {/* PRODUCT IMAGE */}
        <div className="product-details-image">

          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          {discount > 0 && (
            <span>{discount}% OFF</span>
          )}

        </div>

        {/* PRODUCT INFORMATION */}
        <div className="product-details-info">

          <p className="product-details-category">
            {product.category || "General"}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-rating">
            ★ {rating} / 5
          </p>

          {/* PRICE */}
          <div className="product-details-price">

            <strong>
              ₹{formatPrice(price)}
            </strong>

            {originalPrice > price && (
              <>
                <del>
                  ₹{formatPrice(originalPrice)}
                </del>

                <span>{discount}% OFF</span>
              </>
            )}

          </div>

          {/* DESCRIPTION */}
          <p className="product-details-description">
            {product.description ||
              "Discover this amazing product from ShopNexa."}
          </p>

          {/* STOCK */}
          <p className="product-details-stock">
            {stock > 0
              ? `In Stock: ${stock}`
              : "Out of Stock"}
          </p>

          {/* QUANTITY */}
          <div className="product-details-quantity">

            <span>Quantity</span>

            <button
              type="button"
              onClick={() =>
                setQuantity((current) =>
                  Math.max(1, current - 1)
                )
              }
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() =>
                setQuantity((current) =>
                  Math.min(
                    stock,
                    current + 1
                  )
                )
              }
              disabled={quantity >= stock}
              aria-label="Increase quantity"
            >
              +
            </button>

          </div>

          {/* TOTAL */}
          <p className="product-details-total">
            Total: ₹{formatPrice(price * quantity)}
          </p>

          {/* NOTICE */}
          {notice && (
            <p
              className="product-details-notice"
              role="status"
            >
              {notice}
            </p>
          )}

          {/* ACTION BUTTONS */}
          <div className="product-details-actions">

            <button
              type="button"
              onClick={() => addToCart(false)}
              disabled={stock < 1}
            >
              Add to Cart
            </button>

            <button
              type="button"
              onClick={() => addToCart(true)}
              disabled={stock < 1}
            >
              Buy Now
            </button>

          </div>

          {/* BENEFITS */}
          <div className="product-details-benefits">
            <p>✓ Quality products</p>
            <p>✓ Secure checkout</p>
            <p>✓ Easy shopping</p>
          </div>

          <Link
            to="/products"
            className="back-to-products"
          >
            ← Continue Shopping
          </Link>

        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
