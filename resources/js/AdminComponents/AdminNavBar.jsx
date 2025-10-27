import React, { useState, useRef, useEffect } from "react";
import {
    Bell,
    ChevronDown,
    UserCircle,
    Settings,
    Shield,
    LogOut,
    Menu,
    Mail,
    Clock,
    CheckCheck,
    Trash2,
} from "lucide-react";
import { usePage } from "@inertiajs/react";

const AdminNavBar = ({ onMenuToggle }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(false);
    const [messageList, setMessageList] = useState([
        {
            id: 1,
            sender: "John Doe",
            subject: "Project Update",
            preview: "The latest updates on the dashboard project...",
            time: "5 min ago",
            unread: true,
        },
        {
            id: 2,
            sender: "Sarah Wilson",
            subject: "Meeting Schedule",
            preview: "Tomorrow's meeting has been rescheduled...",
            time: "1 hour ago",
            unread: true,
        },
        {
            id: 3,
            sender: "Mike Johnson",
            subject: "Report Review",
            preview: "Please review the quarterly report...",
            time: "3 hours ago",
            unread: true,
        },
        {
            id: 4,
            sender: "Emily Brown",
            subject: "New Feature Request",
            preview: "We need to discuss the new feature...",
            time: "Yesterday",
            unread: false,
        },
        {
            id: 5,
            sender: "David Lee",
            subject: "Budget Approval",
            preview: "The budget proposal needs your approval...",
            time: "2 days ago",
            unread: true,
        },
    ]);

    const userMenuRef = useRef(null);
    const messageMenuRef = useRef(null);
    const user = usePage().props.auth.user;

    const unreadCount = messageList.filter((msg) => msg.unread).length;

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
        setIsMessageMenuOpen(false);
    };

    const toggleMessageMenu = () => {
        setIsMessageMenuOpen(!isMessageMenuOpen);
        setIsUserMenuOpen(false);
    };

     const handleLogout = () => {
        axios
            .post(route("logout"))
            .then((response) => {
                if (response.data.redirect) {
                    window.location.href = response.data.redirect;
                } else {
                    window.location.href = "/login";
                }
            })
            .catch((error) => {
                console.error("Logout error:", error);
                window.location.href = "/login";
            });
    };

    const markAsRead = (id) => {
        setMessageList((prev) =>
            prev.map((msg) =>
                msg.id === id ? { ...msg, unread: false } : msg
            )
        );
    };

    const markAllAsRead = () => {
        setMessageList((prev) =>
            prev.map((msg) => ({ ...msg, unread: false }))
        );
    };

    const deleteMessage = (id) => {
        setMessageList((prev) => prev.filter((msg) => msg.id !== id));
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
            }
            if (
                messageMenuRef.current &&
                !messageMenuRef.current.contains(event.target)
            ) {
                setIsMessageMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="fixed top-0 right-0 w-full lg:w-[97%] h-16 z-30 transition-all duration-300 bg-white/80 border-gray-200/50 backdrop-blur-xl border-b">
            <div className="h-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-full">
                    {/* Left side */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden p-2 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-3">
                        {/* Messages Dropdown */}
                        <div className="relative" ref={messageMenuRef}>
                            <button
                                onClick={toggleMessageMenu}
                                className="relative p-2.5 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                <Mail className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Messages Dropdown Menu */}
                            {isMessageMenuOpen && (
                                <div className="absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 bg-white/95 border-gray-200/50 animate-in slide-in-from-top-2 duration-200">
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-gray-200/50 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                Messages
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {unreadCount} unread messages
                                            </p>
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                                            >
                                                <CheckCheck className="w-3 h-3" />
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    {/* Messages List */}
                                    <div className="max-h-96 overflow-y-auto">
                                        {messageList.length > 0 ? (
                                            messageList.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group ${
                                                        message.unread
                                                            ? "bg-emerald-50/30"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div
                                                            className="flex-1 cursor-pointer"
                                                            onClick={() =>
                                                                markAsRead(
                                                                    message.id
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {
                                                                        message.sender
                                                                    }
                                                                </p>
                                                                {message.unread && (
                                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs font-medium text-gray-700 mb-1">
                                                                {
                                                                    message.subject
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                                {
                                                                    message.preview
                                                                }
                                                            </p>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Clock className="w-3 h-3 text-gray-400" />
                                                                <span className="text-xs text-gray-400">
                                                                    {
                                                                        message.time
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                deleteMessage(
                                                                    message.id
                                                                )
                                                            }
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center">
                                                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    No messages
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    {messageList.length > 0 && (
                                        <div className="px-4 py-3 border-t border-gray-200/50">
                                            <button className="w-full text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                                                View all messages
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={toggleUserMenu}
                                className="flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg overflow-hidden ">
                                    <img
                                        src={user.image || "user/user3.png"}
                                        alt="User"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-gray-900">
                                    {user.name}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        isUserMenuOpen ? "rotate-180" : ""
                                    } text-gray-400`}
                                />
                            </button>

                            {/* User Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 bg-white border-gray-200/50 animate-in slide-in-from-top-2 duration-200">
                                    {/* User Info Header */}
                                    <div className="px-4 py-4 border-b border-gray-200/50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                                                <img
                                                    src={
                                                        user.image ||
                                                        "user/user3.png"
                                                    }
                                                    alt="User"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {user.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <button className="flex items-center w-full px-4 py-3 text-sm transition-colors text-gray-700 hover:bg-gray-50 group">
                                            <UserCircle className="w-4 h-4 mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                            My Profile
                                        </button>

                                        <button className="flex items-center w-full px-4 py-3 text-sm transition-colors text-gray-700 hover:bg-gray-50 group">
                                            <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                            Account Settings
                                        </button>

                                        <button className="flex items-center w-full px-4 py-3 text-sm transition-colors text-gray-700 hover:bg-gray-50 group">
                                            <Shield className="w-4 h-4 mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                            Privacy & Security
                                        </button>
                                    </div>

                                    {/* Separator */}
                                    <div className="border-t my-2 border-gray-200/50"></div>

                                    {/* Logout */}
                                    <div className="py-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg mx-2 w-[calc(100%-1rem)]"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavBar;