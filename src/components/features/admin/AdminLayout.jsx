import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { notification } from "antd";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8088";
    const WS_URL = `${API_BASE_URL}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      onConnect: () => {
        console.log("Admin Global Notification Connected");
        
        // Listen for new bookings
        client.subscribe("/topic/bookings", (message) => {
          const booking = JSON.parse(message.body);
          notification.success({
            message: "🎉 CÓ LỊCH ĐẶT MỚI!",
            description: (
              <div>
                <p>Khách hàng: <strong>{booking.customerName}</strong></p>
                <p>Ngày thu: <strong>{booking.recordDate}</strong></p>
                <p className="text-xs text-slate-400 mt-2">Mã: {booking.bookingCode?.slice(-8).toUpperCase()}</p>
              </div>
            ),
            placement: "bottomRight",
            duration: 10,
          });
        });

        // Listen for chat messages (only notify if NOT on chat page)
        client.subscribe("/user/admin/queue/messages", (message) => {
          const data = JSON.parse(message.body);
          if (data.type === 'READ_RECEIPT') return;

          // If current page is NOT chat, show notification
          if (!window.location.pathname.includes("/admin/chat")) {
            notification.info({
              message: "💬 TIN NHẮN MỚI",
              description: `Bạn có tin nhắn mới từ khách hàng.`,
              placement: "bottomRight",
              duration: 5,
            });
          }
        });
      },
    });

    client.activate();

    return () => {
      if (client) client.deactivate();
    };
  }, []);

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

      <div className="flex-1 flex flex-col w-full lg:ml-[280px] transition-all duration-500 ease-in-out admin-area">
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 lg:p-6 overflow-y-auto w-full max-w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
