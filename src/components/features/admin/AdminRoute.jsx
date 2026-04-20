import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../api/AuthContext";

/**
 * Protected route component for admin-only access
 * Redirects non-admin users to home page
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 space-y-6 sm:space-y-10 animate-pulse">
        {/* Sidebar Skeleton Placeholder */}
        <div className="fixed left-0 top-0 h-full w-[260px] bg-white border-r border-slate-100 hidden lg:block"></div>
        
        <div className="lg:ml-[260px] space-y-8">
            {/* Header Skeleton */}
            <div className="h-16 sm:h-20 bg-white/70 rounded-3xl border border-slate-100 w-full"></div>
            
            {/* Page Header Skeleton */}
            <div className="flex justify-between items-end">
                <div className="space-y-3">
                    <div className="h-8 w-48 bg-slate-200 rounded-xl"></div>
                    <div className="h-4 w-32 bg-slate-100 rounded-lg"></div>
                </div>
            </div>

            {/* Content Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 sm:h-40 bg-white rounded-[32px] border border-slate-100 p-6 space-y-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                        <div className="h-6 w-20 bg-slate-200 rounded-lg"></div>
                    </div>
                ))}
            </div>

            {/* Large Content Skeleton */}
            <div className="h-80 sm:h-96 bg-white rounded-[40px] border border-slate-100"></div>
        </div>
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
