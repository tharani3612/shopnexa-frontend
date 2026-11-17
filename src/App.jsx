
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// =====================================
// CUSTOMER COMPONENTS
// =====================================

import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

// =====================================
// CUSTOMER PAGES
// =====================================

import Home from "./pages/customer/Home/Home.jsx";
import Products from "./pages/customer/Products/Products.jsx";
import ProductDetails from "./pages/customer/ProductDetails/ProductDetails.jsx";
import Cart from "./pages/customer/Cart/Cart.jsx";
import Login from "./pages/customer/Login/Login.jsx";
import Register from "./pages/customer/Register/Register.jsx";
import Checkout from "./pages/customer/Checkout/Checkout.jsx";
import OrderSuccess from "./pages/customer/OrderSuccess/OrderSuccess.jsx";
import Orders from "./pages/customer/Orders/Orders.jsx";

// =====================================
// CUSTOMER ORDER DETAILS
// =====================================

import CustomerOrderDetails from "./pages/customer/Orders/OrderDetails.jsx";

// =====================================
// CUSTOMER INFORMATION PAGES
// =====================================

import Contact from "./pages/customer/Contact/Contact.jsx";
import FAQ from "./pages/customer/FAQ/FAQ.jsx";
import Privacy from "./pages/customer/Privacy/Privacy.jsx";
import Terms from "./pages/customer/Terms/Terms.jsx";
import RefundPolicy from "./pages/customer/RefundPolicy/RefundPolicy.jsx";

// =====================================
// ADMIN PAGES
// =====================================

import AdminLogin from "./pages/admin/AdminLogin/AdminLogin.jsx";
import Dashboard from "./pages/admin/Dashboard/Dashboard.jsx";
import AdminProducts from "./pages/admin/Products/Products.jsx";
import AddProduct from "./pages/admin/AddProduct/AddProduct.jsx";
import EditProduct from "./pages/admin/EditProduct/EditProduct.jsx";
import Categories from "./pages/admin/Categories/Categories.jsx";
import AdminOrders from "./pages/admin/Orders/Orders.jsx";

// =====================================
// ADMIN ORDER DETAILS
// =====================================

import AdminOrderDetails from "./pages/admin/OrderDetails/OrderDetails.jsx";

// =====================================
// ADMIN CUSTOMERS & SETTINGS
// =====================================

import Customers from "./pages/admin/Customers/Customers.jsx";
import Reports from "./pages/admin/Reports/Reports.jsx";
import Settings from "./pages/admin/Settings/Settings.jsx";

// =====================================
// ADMIN PROFILE & PASSWORD
// =====================================

import Profile from "./pages/admin/Profile/Profile.jsx";
import ChangePassword from "./pages/admin/ChangePassword/ChangePassword.jsx";

// =====================================
// ADMIN LAYOUT
// =====================================

import AdminLayout from "./pages/admin/AdminLayout/AdminLayout.jsx";

// =====================================
// 404 PAGE
// =====================================

function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: "80px 20px",
      }}
    >
      <h1>404 - Page Not Found</h1>

      <p>
        The page you are looking for does not exist.
      </p>
    </div>
  );
}

// =====================================
// APPLICATION LAYOUT
// =====================================

function AppLayout() {
  const location = useLocation();

  // Check Admin Page
  const isAdminPage =
    location.pathname.startsWith("/admin");

  // Customer Authentication Pages
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
  ].includes(location.pathname);

  // Hide Customer Navbar and Footer
  const hideLayout = isAdminPage || isAuthPage;

  return (
    <>
      {/* CUSTOMER NAVBAR */}

      {!hideLayout && <Navbar />}

      <Routes>

        {/* =====================================
            CUSTOMER ROUTES
        ===================================== */}

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={<Products />}
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* ORDER SUCCESS */}
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        {/* CUSTOMER ORDERS */}
        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* CUSTOMER ORDER DETAILS */}
        <Route
          path="/orders/:orderId"
          element={<CustomerOrderDetails />}
        />

        {/* =====================================
            CUSTOMER INFORMATION ROUTES
        ===================================== */}

        {/* CONTACT */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* FAQ */}
        <Route
          path="/faq"
          element={<FAQ />}
        />

        {/* PRIVACY POLICY */}
        <Route
          path="/privacy"
          element={<Privacy />}
        />

        {/* TERMS & CONDITIONS */}
        <Route
          path="/terms"
          element={<Terms />}
        />

        {/* REFUND POLICY */}
        <Route
          path="/refund-policy"
          element={<RefundPolicy />}
        />

        {/* =====================================
            ADMIN LOGIN
        ===================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =====================================
            ADMIN ROUTES
        ===================================== */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          {/* DEFAULT ADMIN ROUTE */}
          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          {/* DASHBOARD */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* ADMIN PRODUCTS */}
          <Route
            path="products"
            element={<AdminProducts />}
          />

          {/* ADD PRODUCT */}
          <Route
            path="products/add"
            element={<AddProduct />}
          />

          {/* EDIT PRODUCT */}
          <Route
            path="products/edit/:id"
            element={<EditProduct />}
          />

          {/* CATEGORIES */}
          <Route
            path="categories"
            element={<Categories />}
          />

          {/* ADMIN ORDERS */}
          <Route
            path="orders"
            element={<AdminOrders />}
          />

          {/* ADMIN ORDER DETAILS */}
          <Route
            path="orders/:id"
            element={<AdminOrderDetails />}
          />

          {/* CUSTOMERS */}
          <Route
            path="customers"
            element={<Customers />}
          />

          {/* REPORTS */}
          <Route
            path="reports"
            element={<Reports />}
          />

          {/* ACCOUNT SETTINGS */}
          <Route
            path="settings"
            element={<Settings />}
          />

          {/* MY PROFILE */}
          <Route
            path="profile"
            element={<Profile />}
          />

          {/* CHANGE PASSWORD */}
          <Route
            path="change-password"
            element={<ChangePassword />}
          />

        </Route>

        {/* =====================================
            404 PAGE
        ===================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      {/* CUSTOMER FOOTER */}

      {!hideLayout && <Footer />}
    </>
  );
}

// =====================================
// MAIN APP
// =====================================

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
