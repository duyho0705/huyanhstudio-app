import { useState, useEffect, useRef } from "react";
import { FiSearch, FiSend, FiUser, FiMessageSquare, FiClock } from "react-icons/fi";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axiosClient from "../../../api/axiosClient";
import { motion, AnimatePresence } from "framer-motion";

const ChatManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const scrollRef = useRef(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";
    const WS_URL = `${API_BASE_URL}/ws`;

    useEffect(() => {
        fetchUsers();
        connectWebSocket();
        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchHistory(selectedUser);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchUsers = async () => {
        try {
            const res = await axiosClient.get(`/api/chat/users`);
            setUsers((res.data || res).filter(u => u !== 'admin'));
        } catch (err) {
            console.error("Error fetching chat users:", err);
        }
    };

    const fetchHistory = async (userId) => {
        try {
            const res = await axiosClient.get(`/api/chat/history`, {
                params: { userId1: 'admin', userId2: userId }
            });
            setMessages(res.data || res);
        } catch (err) {
            console.error("Error fetching chat history:", err);
        }
    };

    const connectWebSocket = () => {
        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            onConnect: () => {
                console.log("Connected to WebSocket (Admin)");
                client.subscribe(`/user/admin/queue/messages`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    // If the message is from the currently selected user, add it to messages
                    // We might need to refresh user list if it's a new user
                    setMessages((prev) => {
                        // Check if the message belongs to the current conversation
                        if (newMessage.senderId === selectedUser || newMessage.receiverId === selectedUser) {
                            return [...prev, newMessage];
                        }
                        return prev;
                    });
                    fetchUsers(); // Refresh list to show new activity
                });
            },
        });
        client.activate();
        setStompClient(client);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !stompClient || !selectedUser) return;

        const chatMessage = {
            senderId: 'admin',
            receiverId: selectedUser,
            content: inputValue,
        };

        stompClient.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(chatMessage),
        });

        setMessages((prev) => [...prev, { ...chatMessage, timestamp: new Date().toISOString() }]);
        setInputValue("");
    };

    const filteredUsers = users.filter(u => u.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm">
            {/* User List Sidebar */}
            <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
                <div className="p-6 border-b border-slate-100 bg-white">
                    <h2 className="text-[18px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <FiMessageSquare className="text-blue-500" /> Tin nhắn
                    </h2>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm italic">
                            Chưa có cuộc hội thoại nào
                        </div>
                    ) : (
                        filteredUsers.map((u) => (
                            <button
                                key={u}
                                onClick={() => setSelectedUser(u)}
                                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                                    selectedUser === u 
                                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                                    : "hover:bg-white text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                                    selectedUser === u ? "bg-white/20" : "bg-blue-500/10 text-blue-500"
                                }`}>
                                    <FiUser size={18} />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="font-bold text-[14px] truncate">{u}</p>
                                    <p className={`text-[11px] truncate ${selectedUser === u ? "text-white/70" : "text-slate-400"}`}>
                                        Nhấn để xem tin nhắn
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-50">
                                    <FiUser size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-[15px]">{selectedUser}</h3>
                                    <div className="flex items-center gap-1.5 text-[12px] text-green-500 font-medium">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Đang trực tuyến
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex flex-col ${msg.senderId === 'admin' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                        <div
                                            className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                                                msg.senderId === 'admin'
                                                    ? 'bg-blue-500 text-white rounded-tr-none'
                                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400 font-medium px-1">
                                            <FiClock size={10} />
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-5 border-t border-slate-100 flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Nhập tin nhắn trả lời..."
                                className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3 text-[14px] font-medium outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="p-4 bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95"
                            >
                                <FiSend size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <FiMessageSquare size={40} />
                        </div>
                        <p className="font-bold text-lg text-slate-400">Chọn một cuộc hội thoại để bắt đầu</p>
                        <p className="text-sm">Hãy hồi đáp khách hàng một cách nhanh nhất!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatManagement;
