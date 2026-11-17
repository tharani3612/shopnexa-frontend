
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Get product ID from different possible backend response formats
  const getProductId = (item) => {
    return (
      item.product?._id ||
      item.productId?._id ||
      item.productId ||
      item._id
    );
  };

  // Normalize backend cart response
  const normalizeCart = (data) => {
    const items =
      data?.cart?.items ||
      data?.cart?.products ||
      data?.cartItems ||
      data?.items ||
      data?.cart ||
      data?.products ||
      [];

    if (!Array.isArray(items)) return [];

    return items
      .map((item) => {
        const product = item.product || item.productId || item;

        return {
          id: String(getProductId(item) || ""),
          name: product.name || item.name || "Product",
          image: product.image || item.image || "",
          category: product.category || item.category || "General",
          price: Number(product.price ?? item.price ?? 0),
          quantity: Number(item.quantity || 1),
          stock: Number(product.stock ?? item.stock ?? 0),
        };
      })
      .filter((item) => item.id);
  };

  // Fetch cart from MongoDB
  const fetchCart = useCallback(async () => {
    try {
      setError("");

      const response = await API.get("/customer/cart");

      if (response.data.success === false) {
        throw new Error(
          response.data.message || "Unable to fetch cart"
        );
      }

      setCartItems(normalizeCart(response.data));
    } catch (err) {
      console.error("Fetch cart error:", err);

      if (err.response?.status === 401) {
        setError("Please login to view your cart.");
      } else {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load your cart."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Update quantity in backend
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      setUpdatingId(productId);
      setError("");

      await API.put("/customer/cart/update", {
        productId,
        quantity,
      });

      await fetchCart();

      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Update cart error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to update quantity."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Remove product from backend
  const removeItem = async (productId) => {
    try {
      setUpdatingId(productId);
      setError("");

      await API.delete(
        `/customer/cart/remove/${productId}`
      );

      await fetchCart();

      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Remove cart item error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to remove product."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Clear complete cart
  const clearCart = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmClear) return;

    try {
      setError("");

      await API.delete("/customer/cart/clear");

      setCartItems([]);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Clear cart error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to clear cart."
      );
    }
  };

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/checkout");
  };

  // Loading state
  if (loading) {
    return (
      <main className="cart-page">
        <div className="cart-loading">
          <div className="cart-spinner"></div>
          <p>Loading your shopping bag...</p>
        </div>
      </main>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛍️</div>

          <h2>Your bag is empty!</h2>

          <p>
            Add something you love to your shopping bag.
          </p>

          {error && (
            <p className="cart-error">{error}</p>
          )}

          <Link to="/products" className="shop-now-btn">
            CONTINUE SHOPPING
          </Link>

          <button
            className="cart-retry-btn"
            onClick={fetchCart}
          >
            Refresh Cart
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">

      {/* Heading */}
      <div className="cart-heading">
        <div>
          <p className="cart-eyebrow">
            SHOPNEXA SHOPPING BAG
          </p>

          <h1>My Bag ({totalItems} items)</h1>
        </div>

        <Link
          to="/products"
          className="continue-shopping"
        >
          Continue Shopping →
        </Link>
      </div>

      {error && (
        <div className="cart-error">
          {error}
        </div>
      )}

      <div className="cart-layout">

        {/* Cart Products */}
        <section className="cart-items">

          {cartItems.map((item) => (
            <article
              className="cart-item"
              key={item.id}
            >
              <img
                className="cart-product-image"
                src={item.image || "/images/no-image.png"}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/300x300?text=No+Image";
                }}
              />

              <div className="cart-product-info">
                <h3>{item.name}</h3>

                <p className="cart-product-category">
                  {item.category}
                </p>

                <p className="cart-product-price">
                  {formatPrice(item.price)}
                </p>

                <div className="quantity-control">
                  <span>Qty:</span>

                  <button
                    type="button"
                    disabled={updatingId === item.id}
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    disabled={
                      updatingId === item.id ||
                      (item.stock > 0 &&
                        item.quantity >= item.stock)
                    }
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="remove-item-btn"
                  disabled={updatingId === item.id}
                  onClick={() => removeItem(item.id)}
                >
                  {updatingId === item.id
                    ? "Updating..."
                    : "Remove"}
                </button>
              </div>

              <div className="cart-item-total">
                {formatPrice(
                  item.price * item.quantity
                )}
              </div>
            </article>
          ))}

          <button
            type="button"
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>

        </section>

        {/* Price Summary */}
        <aside className="cart-summary">
          <h2>Price Details</h2>

          <div className="summary-row">
            <span>Total MRP</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span className="free-delivery">
              FREE
            </span>
          </div>

          <div className="summary-row">
            <span>Platform Fee</span>
            <span>₹0</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row summary-total">
            <span>Total Amount</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <button
            type="button"
            className="place-order-btn"
            onClick={handlePlaceOrder}
          >
            PLACE ORDER →
          </button>

          <p className="secure-checkout">
            🔒 Safe and secure shopping
          </p>
        </aside>

      </div>
    </main>
  );
}

export default Cart;
