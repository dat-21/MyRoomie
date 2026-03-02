import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Search, Smile, Phone, MoreVertical } from "lucide-react";
import { conversations as initialConversations } from "../data/mockData";
import type { Conversation, ChatMessage } from "../data/mockData";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialConversationId?: string;
}

export default function ChatPanel({ isOpen, onClose, initialConversationId }: Props) {
    const [convos, setConvos] = useState<Conversation[]>(initialConversations);
    const [activeId, setActiveId] = useState<string>(initialConversationId || convos[0]?.id || "");
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConvo = convos.find((c) => c.id === activeId);

    useEffect(() => {
        if (initialConversationId) setActiveId(initialConversationId);
    }, [initialConversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConvo?.messages.length]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const handleSend = () => {
        if (!newMessage.trim() || !activeConvo) return;
        const msg: ChatMessage = {
            id: `m_${Date.now()}`,
            senderId: "current",
            text: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            read: false,
        };
        setConvos((prev) =>
            prev.map((c) =>
                c.id === activeId
                    ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, lastMessageTime: msg.timestamp }
                    : c
            )
        );
        setNewMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const filteredConvos = searchQuery
        ? convos.filter((c) => c.participantName.toLowerCase().includes(searchQuery.toLowerCase()))
        : convos;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-white shadow-2xl z-[95] flex"
                    >
                        {/* Left - Conversation List */}
                        <div className="w-72 border-r border-gray-100 flex flex-col bg-bg/50">
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-text font-[family-name:var(--font-family-heading)]">Messages</h3>
                                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer border-0 bg-transparent">
                                        <X size={18} className="text-text-muted" />
                                    </button>
                                </div>
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-gray-100 text-sm focus:outline-none focus:border-primary/40"
                                    />
                                </div>
                            </div>

                            {/* Conversation Items */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-2 space-y-0.5">
                                    <div className="px-3 py-2 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Active Chats</div>
                                    {filteredConvos.map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => setActiveId(c.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer border-0 ${activeId === c.id ? "bg-primary/10" : "hover:bg-gray-50 bg-transparent"
                                                }`}
                                        >
                                            <div className="relative flex-shrink-0">
                                                <img src={c.participantAvatar} alt={c.participantName} className="w-11 h-11 rounded-full bg-primary/10" />
                                                {c.online && (
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm font-semibold truncate ${activeId === c.id ? "text-primary" : "text-text"}`}>
                                                        {c.participantName}
                                                    </span>
                                                    <span className={`text-[10px] flex-shrink-0 ${c.unreadCount > 0 ? "text-primary font-semibold" : "text-text-muted"}`}>
                                                        {c.lastMessageTime}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-text-muted truncate mt-0.5">{c.lastMessage}</p>
                                            </div>
                                            {c.unreadCount > 0 && (
                                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[10px] text-white font-bold">{c.unreadCount}</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* User */}
                            <div className="p-3 border-t border-gray-100 flex items-center gap-3">
                                <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=CurrentUser" alt="You" className="w-9 h-9 rounded-full bg-primary/10" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-text">Alex Chen</div>
                                    <div className="text-[10px] text-text-muted">My Account</div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Chat Area */}
                        <div className="flex-1 flex flex-col">
                            {activeConvo ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src={activeConvo.participantAvatar} alt={activeConvo.participantName} className="w-10 h-10 rounded-full bg-primary/10" />
                                                {activeConvo.online && (
                                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-text">{activeConvo.participantName}</h4>
                                                <p className="text-xs text-text-muted">
                                                    {activeConvo.participantOccupation} · {activeConvo.online ? <span className="text-secondary">Online now</span> : "Offline"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer border-0 bg-transparent">
                                                <Search size={16} className="text-text-muted" />
                                            </button>
                                            <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer border-0 bg-transparent">
                                                <Phone size={16} className="text-text-muted" />
                                            </button>
                                            <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors cursor-pointer border-0">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>

                                    {/* Safety Tip */}
                                    <div className="px-6 py-2 bg-yellow-50 text-xs text-yellow-700 text-center border-b border-yellow-100">
                                        ⚠️ Safety Tip: Do not share financial information or agree to meet in private places immediately.
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                                        {/* Date separator */}
                                        <div className="text-center">
                                            <span className="text-xs text-text-muted bg-bg px-3 py-1 rounded-full">
                                                {activeConvo.messages[0]?.timestamp.includes("Oct") || activeConvo.messages[0]?.timestamp.includes("Yesterday")
                                                    ? activeConvo.lastMessageTime
                                                    : "Today"}
                                            </span>
                                        </div>

                                        {/* Match notification */}
                                        <div className="text-center py-2">
                                            <span className="text-xs text-text-muted">
                                                ✨ You matched with {activeConvo.participantName}! Start a conversation.
                                            </span>
                                        </div>

                                        {activeConvo.messages.map((msg) => {
                                            const isMe = msg.senderId === "current";
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                    <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}>
                                                        {!isMe && (
                                                            <img src={activeConvo.participantAvatar} alt="" className="w-7 h-7 rounded-full bg-primary/10 flex-shrink-0" />
                                                        )}
                                                        <div>
                                                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe
                                                                ? "bg-gradient-to-r from-secondary to-secondary-light text-white rounded-br-md"
                                                                : "bg-bg text-text rounded-bl-md"
                                                                }`}>
                                                                {msg.text}
                                                            </div>
                                                            <div className={`text-[10px] text-text-muted mt-1 ${isMe ? "text-right" : "text-left"}`}>
                                                                {msg.timestamp}
                                                                {isMe && msg.read && " · Read"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <div className="px-6 py-4 border-t border-gray-100">
                                        <div className="flex items-end gap-3">
                                            <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer border-0 bg-transparent flex-shrink-0 mb-0.5">
                                                <Smile size={20} className="text-text-muted" />
                                            </button>
                                            <div className="flex-1 relative">
                                                <textarea
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Type a message..."
                                                    rows={1}
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm text-text resize-none focus:outline-none focus:border-primary/40 bg-bg/50"
                                                    style={{ maxHeight: "120px" }}
                                                />
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleSend}
                                                disabled={!newMessage.trim()}
                                                className={`px-5 py-2.5 rounded-2xl font-medium text-sm flex items-center gap-2 cursor-pointer border-0 transition-all mb-0.5 ${newMessage.trim()
                                                    ? "bg-gradient-to-r from-secondary to-secondary-light text-white shadow-md shadow-secondary/25"
                                                    : "bg-gray-100 text-text-muted cursor-not-allowed"
                                                    }`}
                                            >
                                                Send <Send size={14} />
                                            </motion.button>
                                        </div>
                                        <p className="text-[10px] text-text-muted text-center mt-2">Press Enter to send, Shift + Enter for new line</p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-text-muted">Select a conversation to start chatting</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
