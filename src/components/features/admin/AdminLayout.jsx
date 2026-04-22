import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { notification } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../api/firebase";

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

const pageTransition = {
  duration: 0.3,
  ease: "easeOut"
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8088";
    const WS_URL = `${API_BASE_URL}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      onConnect: () => {
        // Connected

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

    return () => client.deactivate();
  }, []);

  const isInitialChatLoad = useRef(true);
  const pathRef = useRef(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);

  // Global Chat Listener for Sound & Notification
  useEffect(() => {
    const q = query(collection(db, "chat_list"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitialChatLoad.current) {
        isInitialChatLoad.current = false;
        return; // Don't notify on initial load
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified' || change.type === 'added') {
          const data = change.doc.data();
          // Only trigger if it's unread (meaning it's from customer)
          if (data.unread === true) {
            const isChatOpen = pathRef.current.includes('/admin/chat') && document.visibilityState === 'visible';
            
            if (!isChatOpen) {
              // Play double-tone "Ba-Ding" (Messenger-like sound)
              try {
                const audio = new Audio("/messenger.mp3");
                audio.play().catch(() => {
                  // Fallback: Nếu không có file messenger.mp3 trong thư mục public, dùng âm thanh giả lập
                  const AudioContext = window.AudioContext || window.webkitAudioContext;
                  if (AudioContext) {
                      const ctx = new AudioContext();
                      
                      // Tone 1 (Ba - 698Hz)
                      const osc1 = ctx.createOscillator();
                      const gain1 = ctx.createGain();
                      osc1.connect(gain1);
                      gain1.connect(ctx.destination);
                      osc1.type = 'sine';
                      osc1.frequency.setValueAtTime(698.46, ctx.currentTime);
                      gain1.gain.setValueAtTime(0, ctx.currentTime);
                      gain1.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
                      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                      osc1.start(ctx.currentTime);
                      osc1.stop(ctx.currentTime + 0.15);

                      // Tone 2 (Ding - 880Hz)
                      const osc2 = ctx.createOscillator();
                      const gain2 = ctx.createGain();
                      osc2.connect(gain2);
                      gain2.connect(ctx.destination);
                      osc2.type = 'sine';
                      osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1);
                      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.1);
                      gain2.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.12);
                      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                      osc2.start(ctx.currentTime + 0.1);
                      osc2.stop(ctx.currentTime + 0.4);
                  }
                });
              } catch (e) {
                // Audio skipped
              }

              // Show popup notification
              notification.info({
                message: "Tin nhắn mới từ " + (data.userName || "Khách hàng"),
                description: data.lastMessage || "Đã gửi 1 tin đính kèm",
                placement: "topRight",
                duration: 5,
                className: "cursor-pointer",
                onClick: () => {
                  navigate("/admin/chat");
                }
              });
            }
          }
        }
      });
    });

    return () => unsubscribe();
  }, []); // Run once, using pathRef for location

  return (
    <div className="flex h-screen bg-[#f8fafc] relative antialiased overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[60px] -z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/5 rounded-full blur-[60px] -z-0 pointer-events-none"></div>

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

      <div className="flex-1 flex flex-col w-full lg:pl-[260px] h-screen transition-all duration-500 ease-in-out admin-area overflow-hidden">
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className={`flex-1 overflow-y-auto w-full max-w-full mx-auto relative scroll-smooth ${location.pathname.includes("/admin/chat") ? "p-0" : "p-3 sm:p-4 md:p-6 lg:p-6"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
