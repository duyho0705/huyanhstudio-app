import { useState, useEffect, useRef } from "react";
import {
    FiSend,
    FiUser,
    FiSearch,
    FiClock,
    FiMoreVertical,
    FiMessageCircle,
    FiArrowLeft,
    FiImage,
    FiX,
    FiCheck,
    FiSettings,
    FiPlus,
    FiTrash2
} from "react-icons/fi";
import { db } from "../../../api/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, writeBatch } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";

const ChatManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const commonEmojis = ["😀", "😂", "🥰", "🙏", "👍", "😭", "✨", "🔥", "💯", "🎉", "📸", "🎥", "🎤", "🎧", "🎶", "🌟", "💌", "💖", "🎊", "👋", "✨", "🎵", "🥰", "🍀"];

    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [quickReplies, setQuickReplies] = useState([
        "hastudio xin chào! Bạn đang quan tâm đến dịch vụ Thu âm hay Chụp ảnh ạ?",
        "Dạ, bạn cho mình xin SĐT để các bạn Sale bên mình tư vấn và gửi báo giá chi tiết nhé! 💖",
        "Bên mình làm việc từ 8:00 - 22:00 tất cả các ngày. Bạn muốn đặt lịch khung giờ nào ạ?",
        "Để setup đúng phong cách mong muốn, bạn gửi giúp mình vài ảnh mẫu minh họa nhé!",
        "Nếu cần hỗ trợ gấp, bạn có thể gọi qua Hotline ạ. Cảm ơn bạn đã tin chọn hastudio!"
    ]);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);

    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 1) return "Vừa xong";
        if (diffInMins < 60) return `${diffInMins} phút trước`;
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        if (diffInDays === 1) return "Hôm qua";
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const formatMessageTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();

        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

        const timeStr = date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        if (isToday) return `hôm nay, ${timeStr}`;
        if (isYesterday) return `hôm qua, ${timeStr}`;

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${timeStr} ${day} tháng ${month}, ${year}`;
    };

    // 0. Listen to templates
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "settings", "chat_templates"), (snapshot) => {
            if (snapshot.exists()) {
                setQuickReplies(snapshot.data().templates || []);
            }
        });
        return () => unsubscribe();
    }, []);

    const updateTemplates = async (newTemplates) => {
        try {
            await updateDoc(doc(db, "settings", "chat_templates"), {
                templates: newTemplates
            });
        } catch (err) {
            console.error("Error updating templates:", err);
            // If doc doesn't exist, create it
            const { setDoc } = await import("firebase/firestore");
            await setDoc(doc(db, "settings", "chat_templates"), {
                templates: newTemplates
            });
        }
    };

    const handleAddTemplate = () => {
        if (!newTemplate.trim()) return;

        let updated;
        if (editingIndex !== null) {
            // Update existing
            updated = [...quickReplies];
            updated[editingIndex] = newTemplate.trim();
            setEditingIndex(null);
        } else {
            // Add new
            updated = [...quickReplies, newTemplate.trim()];
        }

        setQuickReplies(updated);
        updateTemplates(updated);
        setNewTemplate("");
    };

    const handleDeleteTemplate = (index) => {
        const updated = quickReplies.filter((_, i) => i !== index);
        setQuickReplies(updated);
        updateTemplates(updated);
        if (editingIndex === index) {
            setEditingIndex(null);
            setNewTemplate("");
        }
    };

    // 1. Listen to chat list (sidebar)
    useEffect(() => {
        const q = query(collection(db, "chat_list"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
        });
        return () => unsubscribe();
    }, []);

    // 2. Listen to messages for selected user
    useEffect(() => {
        if (!selectedUser) return;

        const q = query(
            collection(db, "chat_rooms", selectedUser, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString()
            }));
            setMessages(msgs);

            // Mark individual messages as read
            const unreadMessages = msgs.filter(m => m.senderId !== 'admin' && !m.isRead);
            if (unreadMessages.length > 0) {
                const batch = writeBatch(db);
                unreadMessages.forEach(m => {
                    const msgRef = doc(db, "chat_rooms", selectedUser, "messages", m.id);
                    batch.update(msgRef, { isRead: true });
                });

                // Reset unread count in main list
                const userRef = doc(db, "chat_list", selectedUser);
                batch.update(userRef, { unreadCount: 0, unread: false });

                batch.commit().catch(() => { });
            }
        });

        return () => unsubscribe();
    }, [selectedUser]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSelectUser = (userId) => {
        setSelectedUser(userId);
        setShowSidebar(false); // on mobile, hide sidebar when selecting a user
    };

    const handleBackToList = () => {
        setShowSidebar(true);
        setSelectedUser(null);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Giới hạn dung lượng 10MB theo config của Spring Boot
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            alert("Dung lượng tệp quá lớn! Vui lòng chọn tệp dưới 10MB.");
            return;
        }

        setSelectedImage(file);

        // Chỉ tạo object URL cho ảnh/video để preview, còn tệp khác hiện icon
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl("file-placeholder"); // Dùng một string đánh dấu để UI hiện icon
        }
    };

    const clearImagePreview = () => {
        if (previewUrl && previewUrl !== "file-placeholder") URL.revokeObjectURL(previewUrl);
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!inputValue.trim() && !selectedImage) || !selectedUser) return;

        let imageUrl = null;
        let finalMessage = inputValue.trim();

        if (selectedImage) {
            setUploadingImage(true);
            setUploadProgress(0);

            try {
                const formData = new FormData();
                formData.append('file', selectedImage);
                formData.append('userId', selectedUser);

                // Gửi qua Server Java của bạn (Không set Content-Type để axios tự xử lý boundary)
                const response = await axiosClient.post('/media/upload-chat', formData, {
                    headers: { 'Content-Type': undefined },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                });

                if (response.data && response.data.code === "UPLOAD_SUCCESS") {
                    imageUrl = response.data.data; // Server Java trả về link Supabase
                } else if (response.code === "UPLOAD_SUCCESS") {
                    imageUrl = response.data;
                } else {
                    throw new Error(response.message || "Lỗi từ Server");
                }

                if (!finalMessage) {
                    if (selectedImage.type.startsWith('image')) {
                        finalMessage = "Đã gửi một hình ảnh 📸";
                    } else if (selectedImage.type.startsWith('video')) {
                        finalMessage = "Đã gửi một video 🎥";
                    } else {
                        finalMessage = `Đã gửi tệp: ${selectedImage.name} 📄`;
                    }
                }
            } catch (error) {
                console.error("Error uploading via backend:", error);
                setUploadingImage(false);
                alert("Lỗi tải lên: " + (error.response?.data?.message || error.message));
                return;
            }
        }

        const chatMessage = {
            senderId: "admin",
            receiverId: selectedUser,
            content: finalMessage,
            timestamp: serverTimestamp(),
            ...(imageUrl && { imageUrl })
        };

        try {
            await addDoc(collection(db, "chat_rooms", selectedUser, "messages"), chatMessage);

            await updateDoc(doc(db, "chat_list", selectedUser), {
                lastMessage: finalMessage,
                timestamp: serverTimestamp(),
                unread: false
            });

            setInputValue("");
            clearImagePreview();
            setUploadingImage(false);
        } catch (err) {
            console.error("Error sending admin message:", err);
            setUploadingImage(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-80px)] w-full bg-white flex overflow-hidden relative">
            {/* Sidebar */}
            <div className={`
                ${showSidebar ? 'flex' : 'hidden'}
                md:flex
                w-full md:w-[320px] lg:w-[380px] 
                border-r border-slate-100 flex-col bg-slate-50/30
                absolute md:relative inset-0 z-20 md:z-auto
            `}>
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-[18px] sm:text-[20px] font-bold text-slate-800 flex items-center gap-2">
                            <FiMessageCircle className="text-blue-500" /> Tin nhắn
                        </h2>
                    </div>

                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-1">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                            <button
                                key={u.id}
                                onClick={() => handleSelectUser(u.id)}
                                className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all ${selectedUser === u.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "hover:bg-white text-slate-600 hover:shadow-md"
                                    }`}
                            >
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm shrink-0 ${selectedUser === u.id ? "bg-white/20" : "bg-blue-50"
                                    }`}>
                                    <FiUser size={18} className={selectedUser === u.id ? "text-white" : "text-blue-600"} />
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-[14px] sm:text-[15px] truncate pr-2">
                                            {u.userName || u.id}
                                        </p>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {u.timestamp && (
                                                <span className={`text-[10px] sm:text-[11px] font-medium ${selectedUser === u.id ? 'text-white/80' : 'text-slate-400'}`}>
                                                    {formatTime(u.timestamp?.toDate()?.toISOString())}
                                                </span>
                                            )}
                                            {u.unreadCount > 0 ? (
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                                                    {u.unreadCount > 99 ? '99+' : u.unreadCount}
                                                </span>
                                            ) : u.unread && (
                                                <span className="w-2.5 h-2.5 bg-red-500 rounded-full ring-4 ring-white"></span>
                                            )}
                                        </div>
                                    </div>
                                    <p className={`text-[12px] sm:text-[13px] truncate ${selectedUser === u.id ? 'text-white/80' : 'text-slate-400'}`}>
                                        {u.lastMessage || "Chưa có tin nhắn"}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <FiSearch size={40} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Không tìm thấy ai</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`
                ${!showSidebar ? 'flex' : 'hidden'}
                md:flex
                flex-1 flex-col bg-white min-w-0
                absolute md:relative inset-0 z-10 md:z-auto
            `}>
                <AnimatePresence mode="wait">
                    {selectedUser ? (
                        <motion.div
                            key={selectedUser}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex-1 flex flex-col min-w-0 h-full"
                        >
                            {/* Chat Header */}
                            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    {/* Back button for mobile */}
                                    <button
                                        onClick={handleBackToList}
                                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 md:hidden"
                                    >
                                        <FiArrowLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FiUser size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-[15px] sm:text-[17px]">
                                            {users.find(u => u.id === selectedUser)?.userName || selectedUser}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            <span className="text-[14px] sm:text-[14px] text-slate-600 font-medium">Đang hoạt động</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                                    <FiMoreVertical size={20} />
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 bg-slate-50/30">
                                {messages.map((msg, idx) => {
                                    const prevMsg = messages[idx - 1];
                                    const showTimeSeparator = !prevMsg ||
                                        (new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime() > 20 * 60 * 1000);

                                    const isStandaloneCard = msg.imageUrl && (
                                        msg.content === "Đã gửi một hình ảnh 📸" ||
                                        msg.content === "Đã gửi một video 🎥" ||
                                        msg.content.includes("Đã gửi tệp:") ||
                                        !msg.content
                                    );

                                    return (
                                        <div key={msg.id || idx} className="space-y-4">
                                            {showTimeSeparator && (
                                                <div className="flex justify-center mb-6 mt-2">
                                                    <span className="text-[12px] sm:text-[13px] font-medium text-slate-500">
                                                        {formatMessageTime(msg.timestamp)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex flex-col ${msg.senderId === 'admin' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                                                    <div
                                                        className={`rounded-2xl text-[14px] sm:text-[15px] leading-relaxed ${isStandaloneCard
                                                            ? ""
                                                            : `shadow-sm px-4 py-2.5 sm:px-5 sm:py-3 ${msg.senderId === 'admin'
                                                                ? 'bg-[#E9DCD6] text-slate-800 rounded-tr-none'
                                                                : 'bg-[#F0F0F0] text-slate-700 rounded-tl-none'
                                                            }`
                                                            }`}
                                                    >
                                                        {msg.imageUrl && (
                                                            <div className={`${!isStandaloneCard ? "mb-2" : ""} max-w-[280px] sm:max-w-[350px] rounded-2xl overflow-hidden cursor-pointer hover:opacity-95 transition-all shadow-md ring-1 ring-slate-100 bg-black/5`}>
                                                                <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer" className="block">
                                                                    {msg.imageUrl.toLowerCase().match(/\.(mp4|mov|webm|quicktime)$/) || msg.content.includes("video") ? (
                                                                        <video src={msg.imageUrl} className="w-full h-auto rounded-lg" />
                                                                    ) : msg.imageUrl.toLowerCase().match(/\.(printable|jpg|jpeg|png|gif|webp|heic)$/) || msg.content.includes("hình ảnh") ? (
                                                                        <img src={msg.imageUrl} alt="attachment" className="w-full h-auto object-cover rounded-lg" />
                                                                    ) : (
                                                                        <div className={`p-4 flex items-center gap-4 rounded-xl ${msg.senderId === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                                                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${msg.senderId === 'admin' ? 'bg-white/20' : 'bg-blue-50'}`}>
                                                                                <FiMessageCircle size={22} className={msg.senderId === 'admin' ? 'text-white' : 'text-blue-500'} />
                                                                            </div>
                                                                            <div className="flex-1 overflow-hidden text-left">
                                                                                <p className={`text-[13px] font-bold truncate ${msg.senderId === 'admin' ? 'text-white' : 'text-slate-700'}`}>
                                                                                    {msg.content.includes("Đã gửi tệp:")
                                                                                        ? msg.content.replace("Đã gửi tệp: ", "").replace(" 📄", "")
                                                                                        : "Tài liệu / Tệp"}
                                                                                </p>
                                                                                <p className={`text-[11px] font-medium truncate ${msg.senderId === 'admin' ? 'text-blue-100' : 'text-slate-400'}`}>Nhấn để xem/tải về</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </a>
                                                            </div>
                                                        )}
                                                        <div className="break-words">
                                                            {!isStandaloneCard && msg.content}
                                                        </div>
                                                    </div>

                                                    {/* Message Status for Admin Messages */}
                                                    {msg.senderId === 'admin' && idx === messages.length - 1 && (
                                                        <div className="mt-1 px-1">
                                                            <span className="text-[12px] sm:text-[13px] font-medium text-slate-500">
                                                                {msg.isRead ? "Đã xem" : "Đã gửi"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>



                            {/* Quick Replies */}
                            <div
                                className="px-4 sm:px-6 py-2.5 bg-slate-50 flex items-center gap-2 overflow-x-auto border-t border-slate-100 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                onWheel={(e) => {
                                    if (e.deltaY !== 0) {
                                        e.currentTarget.scrollLeft += e.deltaY;
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2 mr-2 shrink-0">
                                    <span className="text-[14px] font-medium text-slate-700">Tin mẫu</span>
                                    <button
                                        onClick={() => setIsTemplateModalOpen(true)}
                                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-blue-500 transition-colors"
                                        title="Chỉnh sửa tin mẫu"
                                    >
                                        <FiSettings size={16} />
                                    </button>
                                </div>
                                {quickReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInputValue(reply)}
                                        title={reply}
                                        className="whitespace-nowrap px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-[13px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm shrink-0"
                                    >
                                        {reply.length > 35 ? reply.substring(0, 35) + '...' : reply}
                                    </button>
                                ))}
                            </div>

                            {/* Modern Image Preview & Progress Bar (FB Style) */}
                            <AnimatePresence>
                                {previewUrl && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: 10, height: 0 }}
                                        className="px-4 py-3 bg-white border-t border-slate-100 flex items-center gap-4"
                                    >
                                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm group bg-slate-50 flex items-center justify-center">
                                            {selectedImage?.type.startsWith('video') ? (
                                                <video src={previewUrl} className="w-full h-full object-cover" />
                                            ) : selectedImage?.type.startsWith('image') ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center w-full h-full bg-blue-50 p-2 text-center overflow-hidden">
                                                    <FiMessageCircle className="text-blue-500" size={24} />
                                                    <span className="text-[9px] font-black text-blue-600 mt-1 truncate max-w-full">
                                                        {selectedImage?.name || "FILE"}
                                                    </span>
                                                </div>
                                            )}
                                            {!uploadingImage && (
                                                <button
                                                    type="button"
                                                    onClick={clearImagePreview}
                                                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors z-10"
                                                >
                                                    <FiX size={12} />
                                                </button>
                                            )}
                                        </div>

                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Input Area */}
                            <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 items-center">
                                    {/* Plus/Image Component Button */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
                                        title="Gửi hình ảnh/tệp"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                                    </button>

                                    <input
                                        type="file"
                                        accept="*"
                                        hidden
                                        ref={fileInputRef}
                                        onChange={handleImageSelect}
                                    />

                                    {/* Pill Shaped Input Wrap */}
                                    <div className="flex-1 relative flex items-center bg-slate-100 rounded-full px-2 shadow-inner border border-slate-200/50">
                                        <input
                                            type="text"
                                            placeholder={uploadingImage ? "Đang tải ảnh lên..." : "Để lại lời nhắn..."}
                                            className="w-full pl-3 pr-10 py-2.5 sm:py-3 bg-transparent border-none text-[14px] sm:text-[15px] focus:ring-0 outline-none placeholder:text-slate-500 text-slate-800"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            disabled={uploadingImage}
                                        />

                                        {/* Inside Input Emoji Picker button */}
                                        <div className="absolute right-1">
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                className="w-8 h-8 rounded-full hover:bg-slate-200/80 text-blue-500 font-bold flex items-center justify-center transition-all"
                                                title="Biểu tượng cảm xúc"
                                            >
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"></path><circle cx="9" cy="9" r="1.5" fill="white"></circle><circle cx="15" cy="9" r="1.5" fill="white"></circle></svg>
                                            </button>

                                            {showEmojiPicker && (
                                                <div className="absolute bottom-[calc(100%+12px)] right-0 origin-bottom-right bg-white border border-slate-100 shadow-2xl rounded-2xl p-3 w-[260px] sm:w-[280px] z-[100] animate-in fade-in zoom-in-95 duration-200">
                                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-50">
                                                        <span className="text-[13px] font-bold text-slate-600 ">Cảm xúc</span>
                                                        <button type="button" onClick={() => setShowEmojiPicker(false)} className="text-slate-400 hover:text-red-500"><FiX size={14} /></button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {commonEmojis.map((emoji, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => {
                                                                    setInputValue(prev => prev + emoji);
                                                                }}
                                                                className="w-8 h-8 flex items-center justify-center text-xl hover:bg-slate-100 rounded-lg transition-colors cursor-pointer hover:scale-110"
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={uploadingImage || (!inputValue.trim() && !selectedImage)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${uploadingImage || (!inputValue.trim() && !selectedImage)
                                            ? "text-slate-300 pointer-events-none"
                                            : "text-blue-500 hover:bg-blue-50 active:scale-95"
                                            }`}
                                    >
                                        {uploadingImage ? (
                                            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                                        ) : (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat-placeholder"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20 p-6 h-full"
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 animate-bounce">
                                <FiMessageCircle size={40} />
                            </div>
                            <h3 className="text-[18px] sm:text-[22px] font-bold text-slate-800 mb-2 text-center">Chọn một cuộc hội thoại</h3>
                            <p className="text-slate-400 max-w-[300px] text-center text-[14px] sm:text-[15px]">
                                Chọn một khách hàng từ danh sách bên trái để bắt đầu hỗ trợ họ ngay lập tức!
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Template Management Modal */}
            <AnimatePresence>
                {isTemplateModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsTemplateModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div>
                                    <h3 className="text-[18px] font-bold text-slate-800">Quản lý tin mẫu</h3>
                                </div>
                                <button
                                    onClick={() => setIsTemplateModalOpen(false)}
                                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {quickReplies.map((template, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setNewTemplate(template);
                                            setEditingIndex(idx);
                                        }}
                                        className={`group p-4 border rounded-2xl flex items-start gap-4 transition-all cursor-pointer ${editingIndex === idx
                                            ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20'
                                            : 'bg-slate-50 border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'
                                            }`}
                                        title="Nhấn để sửa tin này"
                                    >
                                        <div className={`flex-1 text-[14px] font-medium leading-relaxed ${editingIndex === idx ? 'text-blue-700' : 'text-slate-700'}`}>
                                            {template}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTemplate(idx);
                                            }}
                                            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {quickReplies.length === 0 && (
                                    <div className="text-center py-10 text-slate-400">
                                        <FiMessageCircle size={32} className="mx-auto mb-2 opacity-20" />
                                        <p className="text-[13px]">Chưa có tin mẫu nào</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                                <div className="flex gap-3">
                                    <textarea
                                        placeholder="Nhập nội dung tin mẫu mới..."
                                        className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-[14px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all shadow-sm"
                                        rows="2"
                                        value={newTemplate}
                                        onChange={(e) => setNewTemplate(e.target.value)}
                                    />
                                    <button
                                        onClick={handleAddTemplate}
                                        disabled={!newTemplate.trim()}
                                        className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg transition-all shrink-0 active:scale-95 ${editingIndex !== null
                                            ? 'bg-green-500 shadow-green-500/30 hover:bg-green-600'
                                            : 'bg-blue-500 shadow-blue-500/30 hover:bg-blue-600'
                                            } disabled:bg-slate-300 disabled:shadow-none`}
                                        title={editingIndex !== null ? "Lưu thay đổi" : "Thêm mới"}
                                    >
                                        {editingIndex !== null ? <FiCheck size={24} /> : <FiPlus size={24} />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatManagement;
