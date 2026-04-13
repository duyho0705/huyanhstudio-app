import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

/**
 * Main layout for admin dashboard
 * Contains sidebar navigation and header
 */
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] relative overflow-x-hidden antialiased">
      {/* Decorative Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px] -z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/5 rounded-full blur-[120px] -z-0 pointer-events-none"></div>

      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[999] transition-all duration-500 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          } lg:hidden`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col w-full lg:ml-[280px] transition-all duration-500 ease-in-out">
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
