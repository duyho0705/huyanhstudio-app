import { useState, useEffect, useRef } from "react";
import {
    FiSend,
    FiUser,
    FiSearch,
    FiMessageCircle,
    FiArrowLeft,
    FiPlus,
    FiX,
    FiPaperclip,
    FiSettings,
    FiTrash2,
    FiEdit3,
    FiSave
} from "react-icons/fi";
import { db } from "../../../api/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, writeBatch } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../../../api/axiosClient";
import { useTranslation } from "react-i18next";
import { Modal } from "antd";

const ChatManagement = () => {
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    const prevSelectedUserRef = useRef(null);
    const prevMessagesLength = useRef(0);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [quickReplies, setQuickReplies] = useState(() => {
        const saved = localStorage.getItem('quick_replies');
        return saved ? JSON.parse(saved) : [
            "hastudio xin chào! Bạn đang quan tâm đến dịch vụ Thu âm hay Chụp ảnh ạ?",
            "Dạ, bạn cho mình xin SĐT để các bạn Sale bên mình tư vấn và gửi báo giá chi tiết nhé! 💖",
            "Bên mình làm việc từ 8:00 - 22:00 tất cả các ngày. Bạn muốn đặt lịch khung giờ nào ạ?",
            "Để setup đúng phong cách mong muốn, bạn gửi giúp mình vài ảnh mẫu minh họa nhé!",
            "Nếu cần hỗ trợ gấp, bạn có thể gọi qua Hotline ạ. Cảm ơn bạn đã tin chọn hastudio!"
        ];
    });

    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [newReplyText, setNewReplyText] = useState("");
    const [editingIdx, setEditingIdx] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        localStorage.setItem('quick_replies', JSON.stringify(quickReplies));
    }, [quickReplies]);

    const handleAddQuickReply = () => {
        if (!newReplyText.trim()) return;
        setQuickReplies([...quickReplies, newReplyText.trim()]);
        setNewReplyText("");
    };

    const handleDeleteQuickReply = (indexToDelete) => {
        setQuickReplies(quickReplies.filter((_, idx) => idx !== indexToDelete));
        if (editingIdx === indexToDelete) {
            setEditingIdx(null);
            setEditingText("");
        }
    };

    const handleStartEdit = (idx, text) => {
        setEditingIdx(idx);
        setEditingText(text);
    };

    const handleSaveEdit = (idx) => {
        if (!editingText.trim()) return;
        const updated = [...quickReplies];
        updated[idx] = editingText.trim();
        setQuickReplies(updated);
        setEditingIdx(null);
        setEditingText("");
    };

    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 1) return t('admin.chat.just_now');
        if (diffInMins < 60) return `${diffInMins} ${t('admin.chat.mins_ago')}`;
        if (diffInHours < 24) return `${diffInHours} ${t('admin.chat.hours_ago')}`;
        if (diffInDays === 1) return t('admin.chat.yesterday');
        return date.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const formatMessageTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();

        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

        const timeStr = date.toLocaleTimeString(i18n.language === 'en' ? 'en-US' : 'vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        if (isToday) return `${t('admin.chat.today')}, ${timeStr}`;
        if (isYesterday) return `${t('admin.chat.yesterday')}, ${timeStr}`;

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        if (i18n.language === 'en') {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${timeStr} ${monthNames[month - 1]} ${day}, ${year}`;
        }

        return `${timeStr} ${day} ${t('admin.chat.month')} ${month}, ${year}`;
    };

    // Helper to check if a URL is an image (by extension or Cloudinary pattern)
    const isImageUrl = (url) => {
        if (!url) return false;
        const lower = url.toLowerCase();
        return lower.match(/\.(jpg|jpeg|png|gif|webp|heic|bmp|svg)(\?.*)?$/) || lower.includes('/image/upload/');
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "settings", "chat_templates"), (snapshot) => {
            if (snapshot.exists()) {
                setQuickReplies(snapshot.data().templates || []);
            }
        });
        return () => unsubscribe();
    }, []);

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

            const unreadMessages = msgs.filter(m => m.senderId !== 'admin' && !m.isRead);
            if (unreadMessages.length > 0) {
                const batch = writeBatch(db);
                unreadMessages.forEach(m => {
                    const msgRef = doc(db, "chat_rooms", selectedUser, "messages", m.id);
                    batch.update(msgRef, { isRead: true });
                });

                const userRef = doc(db, "chat_list", selectedUser);
                batch.update(userRef, { unreadCount: 0, unread: false });
                batch.commit().catch(() => { });
            }
        });

        return () => unsubscribe();
    }, [selectedUser]);

    useEffect(() => {
        if (!scrollRef.current) return;

        const container = scrollRef.current;
        // Detect if user is scrolled near the bottom (within 150px)
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

        const isUserChanged = prevSelectedUserRef.current !== selectedUser;
        prevSelectedUserRef.current = selectedUser;

        const scrollToBottom = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        };

        if (isUserChanged) {
            // ALWAYS scroll to bottom on opening a conversation
            scrollToBottom();
            const timer = setTimeout(scrollToBottom, 100);
            prevMessagesLength.current = messages.length;
            return () => clearTimeout(timer);
        } else if (messages.length > prevMessagesLength.current) {
            // New message arrived
            const lastMsg = messages[messages.length - 1];
            const sentByAdmin = lastMsg?.senderId === 'admin';

            // Only scroll to bottom if user is near bottom, or if the admin sent the message themselves
            if (isNearBottom || sentByAdmin) {
                scrollToBottom();
                const timer = setTimeout(scrollToBottom, 100);
                prevMessagesLength.current = messages.length;
                return () => clearTimeout(timer);
            }
        }
        prevMessagesLength.current = messages.length;
    }, [messages, selectedUser]);

    const handleSelectUser = (userId) => {
        setSelectedUser(userId);
        setShowSidebar(false);
    };

    const handleBackToList = () => {
        setShowSidebar(true);
        setSelectedUser(null);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            alert("File too large! Max 10MB.");
            return;
        }
        setSelectedImage(file);
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl("file-placeholder");
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

        const messageToSend = inputValue.trim();
        const imageToUpload = selectedImage;

        setInputValue("");
        clearImagePreview();

        let imageUrl = null;
        let finalMessage = messageToSend;

        if (imageToUpload) {
            setUploadingImage(true);
            try {
                const formData = new FormData();
                formData.append('file', imageToUpload);

                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/';
                const uploadUrl = baseUrl.endsWith('/') ? `${baseUrl}media/upload` : `${baseUrl}/media/upload`;

                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(`Upload failed with status ${response.status}: ${errData.message || 'Unknown error'}`);
                }

                const result = await response.json();
                imageUrl = result.data;

                if (!imageUrl) {
                    throw new Error('Upload failed: No URL returned');
                }

                if (!finalMessage) {
                    if (imageToUpload.type.startsWith('image')) finalMessage = "Sent an image 📸";
                    else if (imageToUpload.type.startsWith('video')) finalMessage = "Sent a video 🎥";
                    else finalMessage = `Sent a file: ${imageToUpload.name} 📄`;
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                setUploadingImage(false);
                setInputValue(messageToSend);
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
            await Promise.all([
                addDoc(collection(db, "chat_rooms", selectedUser, "messages"), chatMessage),
                updateDoc(doc(db, "chat_list", selectedUser), {
                    lastMessage: finalMessage,
                    timestamp: serverTimestamp(),
                    unread: false
                })
            ]);
            setUploadingImage(false);
        } catch (err) {
            console.error("Error sending message:", err);
            setUploadingImage(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-80px)] w-full bg-white flex overflow-hidden relative">
            <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-[320px] lg:w-[380px] border-r border-slate-100 flex-col bg-slate-50/30 absolute md:relative inset-0 z-20 md:z-auto`}>
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-[18px] sm:text-[20px] font-bold text-slate-800 flex items-center gap-2">
                            <FiMessageCircle className="text-blue-500" /> {t('admin.chat.title')}
                        </h2>
                    </div>

                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('admin.chat.search_placeholder')}
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
                                className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all relative ${selectedUser === u.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : u.unread === true
                                        ? "bg-red-50/40 border border-red-100 hover:bg-red-50 text-slate-800 hover:shadow-md"
                                        : "hover:bg-white text-slate-600 hover:shadow-md"
                                    }`}
                            >
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm shrink-0 relative ${selectedUser === u.id ? "bg-white/20" : u.unread === true ? "bg-red-100 text-red-600" : "bg-blue-50"
                                    }`}>
                                    <FiUser size={18} className={selectedUser === u.id ? "text-white" : u.unread === true ? "text-red-500" : "text-blue-600"} />
                                    {u.isOnline === true ? (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-[0_0_6px_#22c55e]"></span>
                                    ) : (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-[14px] sm:text-[16px] truncate pr-2 ${selectedUser === u.id ? "font-semibold text-slate-800" : u.unread === true ? "font-semibold text-slate-900" : "font-medium text-slate-600"}`}>
                                            {u.userName || u.id}
                                        </p>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {u.unread === true && selectedUser !== u.id && (
                                                <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444] animate-pulse shrink-0"></span>
                                            )}
                                            {u.timestamp && (
                                                <span className={`text-[10px] sm:text-[11px] font-medium ${selectedUser === u.id ? 'text-white/80' : u.unread === true ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                                    {formatTime(u.timestamp?.toDate()?.toISOString())}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className={`text-[12px] sm:text-[13.5px] truncate ${selectedUser === u.id ? 'text-white/80' : u.unread === true ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                                        {u.lastMessage || t('admin.chat.no_messages')}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <FiSearch size={40} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">{t('admin.chat.no_users')}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-white min-w-0 absolute md:relative inset-0 z-10 md:z-auto`}>
                <AnimatePresence mode="wait">
                    {selectedUser ? (
                        <motion.div
                            key={selectedUser}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 flex flex-col min-w-0 h-full"
                        >
                            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button onClick={handleBackToList} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 md:hidden">
                                        <FiArrowLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FiUser size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-700 text-[15px] sm:text-[18px]">
                                            {users.find(u => u.id === selectedUser)?.userName || selectedUser}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {users.find(u => u.id === selectedUser)?.isOnline === true ? (
                                                <>
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_6px_#22c55e]"></span>
                                                    <span className="text-[13px] sm:text-[14px] text-slate-500 font-medium">{t('admin.chat.active')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                                                    <span className="text-[13px] sm:text-[14px] text-slate-400 font-medium">Ngoại tuyến</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50/30 scroll-smooth messenger-scrollbar">
                                {messages.map((msg, idx) => {
                                    const lastAdminMessageIdx = messages.slice().reverse().findIndex(m => m.senderId === 'admin');
                                    const actualLastAdminMessageIdx = lastAdminMessageIdx !== -1 ? messages.length - 1 - lastAdminMessageIdx : -1;

                                    const prevMsg = messages[idx - 1];
                                    const showTimeSeparator = !prevMsg ||
                                        (new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime() > 20 * 60 * 1000);

                                    return (
                                        <div key={msg.id || idx} className="flex flex-col gap-4 mb-4">
                                            {showTimeSeparator && (
                                                <div className="flex justify-center my-4">
                                                    <span className="text-[12px] font-medium text-slate-500 bg-slate-100/50 px-3 py-1 rounded-full">{formatMessageTime(msg.timestamp)}</span>
                                                </div>
                                            )}
                                            <div className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex flex-col ${msg.senderId === 'admin' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                                                    {/* Media attachment */}
                                                    {msg.imageUrl && (
                                                        <div className={`mb-2 max-w-[280px] rounded-2xl overflow-hidden shadow-md cursor-pointer ${msg.senderId === 'admin' ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                                                            <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                                                                {isImageUrl(msg.imageUrl) ? (
                                                                    <img src={msg.imageUrl} alt="" className="w-full h-auto" />
                                                                ) : (
                                                                    <div className={`p-4 flex items-center gap-3 min-w-[240px] ${msg.senderId === 'admin' ? 'bg-[#E9DCD6] text-slate-800' : 'bg-[#F0F0F0] text-slate-700'}`}>
                                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${msg.senderId === 'admin' ? 'bg-white/40' : 'bg-blue-50'}`}>
                                                                            <FiPaperclip size={20} className={msg.senderId === 'admin' ? 'text-slate-700' : 'text-blue-500'} />
                                                                        </div>
                                                                        <div className="flex-1 overflow-hidden">
                                                                            <p className="text-[13px] font-bold truncate">Tài liệu / Tệp tin</p>
                                                                            <p className="text-[11px] opacity-60">Nhấn để tải về</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {/* Text Content (hide system media captions) */}
                                                    {(!msg.imageUrl || (
                                                        !msg.content.includes("Đã gửi một hình ảnh") &&
                                                        !msg.content.includes("Đã gửi một video") &&
                                                        !msg.content.includes("Đã gửi một tệp") &&
                                                        !msg.content.includes("Sent an image") &&
                                                        !msg.content.includes("Sent a video") &&
                                                        !msg.content.includes("Sent a file")
                                                    )) && (
                                                            <div className={`rounded-2xl text-[14px] sm:text-[15px] shadow-sm px-4 py-2.5 sm:px-5 sm:py-3 ${msg.senderId === 'admin' ? 'bg-[#E9DCD6] text-slate-800 rounded-tr-none' : 'bg-[#F0F0F0] text-slate-700 rounded-tl-none'}`}>
                                                                <div className="break-words">{msg.content}</div>
                                                            </div>
                                                        )}

                                                    {idx === actualLastAdminMessageIdx && (
                                                        <div className="mt-1 px-1">
                                                            <span className="text-[12px] font-medium text-slate-500">{msg.isRead ? t('admin.chat.read') : t('admin.chat.sent')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="px-4 sm:px-6 py-2 bg-slate-50 flex items-center gap-3 border-t border-slate-100">
                                <button
                                    onClick={() => setIsManageModalOpen(true)}
                                    className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300/80 text-slate-600 flex items-center justify-center shrink-0 transition-all shadow-sm active:scale-95"
                                    title="Quản lý nhắn nhanh"
                                >
                                    <FiSettings size={15} />
                                </button>
                                <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                                    {quickReplies.map((reply, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setInputValue(reply)}
                                            className="whitespace-nowrap px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-[13px] font-medium text-slate-600 hover:bg-blue-50 transition-all shadow-sm shrink-0 active:scale-95"
                                        >
                                            {reply.length > 35 ? reply.substring(0, 35) + '...' : reply}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
                                {/* Image/File Preview */}
                                {previewUrl && (
                                    <div className="mb-3 relative inline-block">
                                        {previewUrl === "file-placeholder" ? (
                                            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                                                <FiPaperclip size={24} className="text-slate-400" />
                                            </div>
                                        ) : selectedImage?.type.startsWith("video/") ? (
                                            <video src={previewUrl} className="w-28 h-20 object-cover rounded-2xl border border-slate-200" />
                                        ) : (
                                            <img src={previewUrl} alt="preview" className="w-20 h-20 object-cover rounded-2xl border border-slate-200" />
                                        )}
                                        <button
                                            onClick={clearImagePreview}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <FiX size={12} />
                                        </button>
                                    </div>
                                )}

                                {/* Upload indicator */}
                                {uploadingImage && (
                                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg animate-pulse mb-2">
                                        <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-[11px] font-bold">{t('admin.chat.sending')}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 items-center">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm disabled:opacity-50"><FiPlus size={20} /></button>
                                    <input type="file" accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx" hidden ref={fileInputRef} onChange={handleImageSelect} />
                                    <div className="flex-1 bg-slate-100 rounded-full px-2 border border-slate-200/50">
                                        <input
                                            type="text"
                                            placeholder={uploadingImage ? t('admin.chat.sending') : t('admin.chat.placeholder')}
                                            className="w-full pl-3 pr-4 py-2.5 sm:py-3 bg-transparent border-none text-[16px] outline-none text-slate-800"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            disabled={uploadingImage}
                                        />
                                    </div>
                                    <button type="submit" disabled={uploadingImage || (!inputValue.trim() && !selectedImage)} className="text-blue-500 disabled:text-slate-300"><FiSend size={24} /></button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20 h-full">
                            <FiMessageCircle size={60} className="mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-slate-800">{t('admin.chat.select_convo')}</h3>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Replies Management Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 py-1">
                        <span className="text-[17px] sm:text-[20px] font-bold text-slate-800 flex items-center gap-2">
                            <FiSettings size={20} className="text-blue-500 animate-[spin_4s_linear_infinite]" />
                            Quản lý tin nhắn mẫu nhanh
                        </span>
                    </div>
                }
                open={isManageModalOpen}
                onCancel={() => setIsManageModalOpen(false)}
                footer={[
                    <button
                        key="close"
                        onClick={() => setIsManageModalOpen(false)}
                        className="h-10 sm:h-11 px-8 rounded-xl bg-slate-900 border-none font-medium text-white hover:bg-slate-800 transition-all shadow-md shadow-slate-200 text-[14px]"
                    >
                        Hoàn tất
                    </button>
                ]}
                width={720}
                centered
                className="premium-modal !max-w-[95vw]"
                destroyOnClose={true}
                styles={{ body: { padding: "16px 24px" } }}
            >
                <div className="space-y-6 pt-4 messenger-scrollbar max-h-[60vh] overflow-y-auto pr-2">
                    {/* Add New Form */}
                    <div className="space-y-2">
                        <label className="text-[13px] sm:text-[14px] font-medium text-slate-600">Thêm tin nhắn mẫu mới</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Nhập nội dung tin nhắn nhanh..."
                                value={newReplyText}
                                onChange={(e) => setNewReplyText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddQuickReply();
                                    }
                                }}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-[14px] text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all font-medium h-11"
                            />
                            <button
                                onClick={handleAddQuickReply}
                                disabled={!newReplyText.trim()}
                                className="px-5 h-11 bg-slate-900 text-white rounded-xl text-[14px] font-medium flex items-center gap-1.5 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-95 shadow-md shadow-slate-200 shrink-0"
                            >
                                <FiPlus size={16} />
                                Thêm
                            </button>
                        </div>
                    </div>

                    {/* List of Quick Replies */}
                    <div className="space-y-3">
                        <label className="text-[13px] sm:text-[14px] font-medium text-slate-600 flex justify-between items-center">
                            <span>Danh sách tin nhắn mẫu hiện tại ({quickReplies.length})</span>
                            <span className="text-[11px] text-slate-400 font-normal">Nhấp biểu tượng bút chì để chỉnh sửa nhanh.</span>
                        </label>

                        {quickReplies.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                <p className="text-sm text-slate-500 font-medium">Chưa có tin nhắn mẫu nào.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {quickReplies.map((reply, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-slate-50/50 border border-slate-150 rounded-2xl flex items-center justify-between gap-4 group hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                    >
                                        {editingIdx === idx ? (
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveEdit(idx);
                                                        if (e.key === 'Escape') setEditingIdx(null);
                                                    }}
                                                    className="flex-1 px-3 py-1.5 bg-white border border-blue-400 rounded-xl outline-none text-[14px] text-slate-800 focus:ring-1 focus:ring-blue-500 font-medium h-10"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleSaveEdit(idx)}
                                                    className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95"
                                                    title="Lưu"
                                                >
                                                    <FiSave size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingIdx(null)}
                                                    className="w-10 h-10 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95"
                                                    title="Hủy"
                                                >
                                                    <FiX size={15} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-[14px] text-slate-700 leading-relaxed break-words flex-1 pr-2 font-medium">
                                                    {reply}
                                                </p>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        onClick={() => handleStartEdit(idx, reply)}
                                                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                                                        title="Sửa"
                                                    >
                                                        <FiEdit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteQuickReply(idx)}
                                                        className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                                                        title="Xóa"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ChatManagement;
