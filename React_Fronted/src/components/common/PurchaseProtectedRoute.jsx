import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PurchaseProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  // For purchase flow, we require registration first. Redirect to /register so
  // users create an account before proceeding. After registration they must login.
  if (!isAuthenticated) {
    return <Navigate to="/register" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default PurchaseProtectedRoute;
