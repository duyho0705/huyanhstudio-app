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

  // Check if user is admin
  console.log("\n\n" + "=".repeat(70));
  console.log("🔐🔐🔐 ADMIN ROUTE CHECK 🔐🔐🔐");
  console.log("=".repeat(70));
  console.log("[DEBUG AdminRoute] User object:", user);
  console.log("[DEBUG AdminRoute] User JSON:", JSON.stringify(user, null, 2));
  console.log("[DEBUG AdminRoute] User.roles:", user?.roles);
  console.log(
    "[DEBUG AdminRoute] User keys:",
    user ? Object.keys(user) : "no user"
  );
  console.log("[DEBUG AdminRoute] typeof roles:", typeof user?.roles);
  console.log("[DEBUG AdminRoute] Array.isArray?", Array.isArray(user?.roles));

  // roles is an array, check if it includes "ROLE_ADMIN"
  const isAdmin =
    user && Array.isArray(user.roles) && user.roles.includes("ROLE_ADMIN");

  console.log("[DEBUG AdminRoute] user exists?", !!user);
  console.log(
    "[DEBUG AdminRoute] includes ROLE_ADMIN?",
    user?.roles?.includes?.("ROLE_ADMIN")
  );
  console.log("[DEBUG AdminRoute] ⭐ FINAL - Is admin?", isAdmin);
  console.log("=".repeat(70) + "\n\n");

  if (!isAdmin) {
    console.error("❌❌❌ ADMIN ACCESS DENIED - REDIRECTING HOME ❌❌❌");
    console.log("[DEBUG AdminRoute] Current roles:", user?.roles);
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  console.log("✅✅✅ ADMIN ACCESS GRANTED ✅✅✅\n\n");
  return children;
};

export default AdminRoute;
