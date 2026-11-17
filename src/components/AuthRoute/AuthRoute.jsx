import { Navigate, Outlet, useLocation } from "react-router-dom";

function AuthRoute({ role }) {
  const location = useLocation();

  if (role === "customer") {
    const customerToken =
      localStorage.getItem("customerToken") ||
      sessionStorage.getItem("customerToken");

    if (!customerToken) {
      return (
        <Navigate
          to="/login"
          replace
          state={{ from: location }}
        />
      );
    }
  }

  if (role === "admin") {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      return (
        <Navigate
          to="/admin/login"
          replace
          state={{ from: location }}
        />
      );
    }
  }

  return <Outlet />;
}

export default AuthRoute;