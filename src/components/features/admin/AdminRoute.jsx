import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../api/AuthContext";

/**
 * Protected route component for admin-only access
 * Redirects non-admin users to home page
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner"></div>
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  // roles is an array, check if it includes "ROLE_ADMIN"
  const isAdmin =
    user && Array.isArray(user.roles) && user.roles.includes("ROLE_ADMIN");

  if (!isAdmin) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
