
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  // Cart states
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // Address state
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    house: "",
    area: "",
  });

  // Address type
  const [addressType, setAddressType] = useState("Home");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // =====================================
  // FETCH CART FROM BACKEND
  // =====================================

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/customer/cart");

      const items = response.data.items || [];

      setCartItems(items);
    } catch (err) {
      console.error("Cart fetch error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load your cart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // =====================================
  // HANDLE ADDRESS INPUT
  // =====================================

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // CART TOTALS
  // =====================================

  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => {
      const price = Number(item.product?.price || 0);
      const quantity = Number(item.quantity || 0);

      return total + price * quantity;
    },
    0
  );

  const deliveryCharge = 0;

  const totalPrice = subtotal + deliveryCharge;

  // =====================================
  // VALIDATE ADDRESS
  // =====================================

  const validateAddress = () => {
    if (
      !address.name.trim() ||
      !address.phone.trim() ||
      !address.pincode.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.house.trim() ||
      !address.area.trim()
    ) {
      setError("Please fill in all delivery address fields.");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(address.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }

    return true;
  };

  // =====================================
  // PLACE ORDER
  // =====================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (placingOrder) return;

    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!validateAddress()) {
      return;
    }

    // Online payment is not integrated yet
    if (paymentMethod === "ONLINE") {
      setError(
        "Online payment is coming soon. Please select Cash on Delivery."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      // Backend shipping address format
      const shippingAddress = {
        fullName: address.name.trim(),
        phone: address.phone.trim(),
        address: `${address.house.trim()}, ${address.area.trim()}`,
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
      };

      // Backend API request
      const response = await API.post(
        "/customer/orders/place",
        {
          shippingAddress,
          paymentMethod: "COD",
        }
      );

      if (!response.data.success || !response.data.order) {
        throw new Error(
          response.data.message || "Order placement failed."
        );
      }

      const order = response.data.order;

      // Refresh navbar cart count
      window.dispatchEvent(new Event("cart-updated"));

      // Navigate to order success page
      navigate("/order-success", {
        state: {
          order,
          addressType,
        },
      });

    } catch (err) {
      console.error("Place order error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =====================================
  // LOADING SCREEN
  // =====================================

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h2>Loading Checkout...</h2>
          <p>Please wait while we load your cart.</p>
        </div>
      </main>
    );
  }

  // =====================================
  // EMPTY CART
  // =====================================

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <div className="checkout-empty-icon">🛒</div>

          <h2>Your Cart is Empty</h2>

          <p>
            Add some products to your cart before proceeding
            to checkout.
          </p>

          {error && (
            <p className="checkout-error">{error}</p>
          )}

          <Link
            to="/products"
            className="checkout-primary-btn"
          >
            EXPLORE PRODUCTS
          </Link>
        </div>
      </main>
    );
  }

  // =====================================
  // MAIN CHECKOUT UI
  // =====================================

  return (
    <main className="checkout-page">

      {/* CHECKOUT HEADER */}

      <div className="checkout-header">
        <div>
          <p className="checkout-eyebrow">
            SHOPNEXA CHECKOUT
          </p>

          <h1>Complete Your Order</h1>

          <p className="checkout-subtitle">
            Add your delivery details and confirm your order.
          </p>
        </div>

        <div className="checkout-secure">
          🔒 Secure Checkout
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>

        <div className="checkout-layout">

          {/* LEFT SECTION */}

          <section className="checkout-address">

            {/* DELIVERY ADDRESS */}

            <div className="checkout-section-title">
              <span>1</span>
              <h2>Delivery Address</h2>
            </div>

            <div className="checkout-form-grid">

              <label className="checkout-full-width">
                Full Name *
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={address.name}
                  onChange={handleAddressChange}
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                Mobile Number *
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={address.phone}
                  onChange={handleAddressChange}
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                />
              </label>

              <label>
                Pincode *
                <input
                  type="text"
                  name="pincode"
                  placeholder="Enter pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  required
                />
              </label>

              <label className="checkout-full-width">
                House / Building / Street *
                <input
                  type="text"
                  name="house"
                  placeholder="House number, building name"
                  value={address.house}
                  onChange={handleAddressChange}
                  autoComplete="address-line1"
                  required
                />
              </label>

              <label className="checkout-full-width">
                Area / Locality *
                <input
                  type="text"
                  name="area"
                  placeholder="Enter your area or locality"
                  value={address.area}
                  onChange={handleAddressChange}
                  autoComplete="address-line2"
                  required
                />
              </label>

              <label>
                City *
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={address.city}
                  onChange={handleAddressChange}
                  autoComplete="address-level2"
                  required
                />
              </label>

              <label>
                State *
                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={address.state}
                  onChange={handleAddressChange}
                  autoComplete="address-level1"
                  required
                />
              </label>

            </div>

            {/* ADDRESS TYPE */}

            <div className="address-type">

              <p>Save Address As</p>

              {["Home", "Work", "Other"].map((type) => (
                <button
                  type="button"
                  key={type}
                  className={
                    addressType === type ? "type-active" : ""
                  }
                  onClick={() => setAddressType(type)}
                >
                  {type}
                </button>
              ))}

            </div>

            {/* PAYMENT METHOD */}

            <div className="checkout-section-title payment-heading">
              <span>2</span>
              <h2>Payment Method</h2>
            </div>

            <div className="payment-options">

              {/* COD */}

              <label
                className={`payment-option ${
                  paymentMethod === "COD"
                    ? "payment-selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />

                <span className="payment-option-icon">
                  💵
                </span>

                <span className="payment-option-details">
                  <strong>Cash on Delivery</strong>
                  <small>
                    Pay when your order is delivered.
                  </small>
                </span>

                {paymentMethod === "COD" && (
                  <span className="payment-check">✓</span>
                )}
              </label>

              {/* ONLINE PAYMENT */}

              <label className="payment-option payment-disabled">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  disabled
                />

                <span className="payment-option-icon">
                  📱
                </span>

                <span className="payment-option-details">
                  <strong>Online Payment</strong>
                  <small>
                    UPI / QR / Cards - Coming Soon
                  </small>
                </span>

                <span className="payment-check">
                  Soon
                </span>
              </label>

            </div>

            {/* ERROR MESSAGE */}

            {error && (
              <div className="checkout-error">
                ⚠️ {error}
              </div>
            )}

          </section>

          {/* RIGHT SECTION - ORDER SUMMARY */}

          <aside className="checkout-summary">

            <div className="summary-heading">
              <h2>Order Summary</h2>

              <span>{totalItems} Items</span>
            </div>

            {/* PRODUCT LIST */}

            <div className="checkout-products">

              {cartItems.map((item, index) => {
                const product = item.product || {};

                const quantity = Number(item.quantity || 0);
                const price = Number(product.price || 0);

                return (
                  <div
                    className="checkout-product"
                    key={product._id || index}
                  >

                    <div className="checkout-product-image">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name || "Product"}
                        />
                      ) : (
                        <span>No image</span>
                      )}
                    </div>

                    <div className="checkout-product-info">

                      <strong>
                        {product.name || "Product"}
                      </strong>

                      <span>
                        Qty: {quantity}
                      </span>

                      <b>
                        {`₹${(price * quantity).toLocaleString("en-IN")}`}
                      </b>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* PRICE DETAILS */}

            <div className="checkout-price-details">

              <div className="checkout-price-row">
                <span>Subtotal ({totalItems} items)</span>

                <strong>
                  ₹{subtotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="checkout-price-row">
                <span>Delivery Charges</span>

                <strong className="checkout-free">
                  FREE
                </strong>
              </div>

              <div className="checkout-price-row">
                <span>Discount</span>
                <strong>₹0</strong>
              </div>

            </div>

            {/* TOTAL */}

            <div className="checkout-total">

              <div>
                <strong>Total Amount</strong>
                <small>Inclusive of all charges</small>
              </div>

              <strong>
                ₹{totalPrice.toLocaleString("en-IN")}
              </strong>

            </div>

            {/* PLACE ORDER BUTTON */}

            <button
              type="submit"
              className="checkout-primary-btn"
              disabled={placingOrder || cartItems.length === 0}
            >
              {placingOrder
                ? "PLACING ORDER..."
                : `PLACE ORDER • ₹${totalPrice.toLocaleString("en-IN")}`}
            </button>

            <p className="checkout-terms">
              By placing your order, you agree to ShopNexa's
              Terms & Conditions.
            </p>

            <div className="checkout-trust">
              <span>🔒 Secure Checkout</span>
              <span>🚚 Safe Delivery</span>
              <span>✓ Easy Shopping</span>
            </div>

          </aside>

        </div>

      </form>

    </main>
  );
}

export default Checkout;
