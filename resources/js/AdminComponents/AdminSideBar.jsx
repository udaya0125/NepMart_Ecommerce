import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Home,
    FolderTree,
    Users,
    FileText,
    Package,
    BookOpen,
    MessageSquareQuote,
    Activity,
    LogOut,
    X,
    Menu,
    ChevronDown,
    ChevronRight,
    Layers,
    ShoppingCart,
    Settings,
} from "lucide-react";

const AdminSideBar = ({
    isCollapsed,
    isMobileOpen,
    onMobileToggle,
    user,
    toggleSidebar,
}) => {
    const { url, props } = usePage();
    const [activeItem, setActiveItem] = useState("");
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [isContentHovered, setIsContentHovered] = useState(false);

    // Get authenticated user from props
    const authUser = props.auth?.user || user;

    useEffect(() => {
        const path = url.split("/")[1] || "dashboard";
        const activeMap = {
            dashboard: "Dashboard",
            home: "Home",
            categories: "Category",
            sub_category: "Sub Category",
            "user-management": "Users",
            content: "Content",
            "content-posts": "Posts",
            "content-pages": "Pages",
            "content-media": "Media",
            products: "Products",
            blogs: "Blog",
            testimonials: "Testimonials",
            "activity-log": "Activity Logs",
            'order-products': "Order Products",
            "admin-setting": "Setting",
        };

        setActiveItem(activeMap[path] || "Dashboard");

        // Auto-expand content dropdown if on content-related pages
        if (path.startsWith("content")) {
            setIsContentOpen(true);
        }
    }, [url]);

    const toggleContentDropdown = () => {
        setIsContentOpen(!isContentOpen);
    };

    const handleContentMouseEnter = () => {
        if (isCollapsed) {
            setIsContentHovered(true);
        }
    };

    const handleContentMouseLeave = () => {
        if (isCollapsed) {
            setIsContentHovered(false);
        }
    };

    const isContentActive =
        activeItem === "Posts" ||
        activeItem === "Pages" ||
        activeItem === "Media";

    // Check The Role of the User
    const isSuperAdmin = authUser?.role === "super admin";
    const isAdmin = authUser?.role === "admin";
    const isCustomer = authUser?.role === "customer";

    return (
        <div>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <div
                className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${
                    isCollapsed ? "w-[5%]" : "w-[85%] md:w-[30%] lg:w-[18%]"
                } bg-white/95 backdrop-blur-md border-r border-gray-200/50 ${
                    isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Header with logo and close button */}
                <div className="flex h-16 items-center justify-between p-4 border-b border-gray-200 relative">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 flex-1 pr-10">
                            <img
                                src="logo/logo.png"
                                alt="Logo"
                                className="h-12 w-[5rem] rounded-lg object-contain"
                            />
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg lg:block hidden transition-all duration-200 hover:scale-105 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={20} />
                    </button>

                    <button
                        onClick={onMobileToggle}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 h-[calc(100%-4rem)] flex flex-col overflow-y-auto">
                    <div className="flex-1 space-y-2">
                        {/* Super Admin Only Routes */}
                        {isSuperAdmin && (
                            <>
                                {/* Dashboard - Now only for super admin */}
                                <div className="relative group">
                                    <Link
                                        href="/dashboard"
                                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                            activeItem === "Dashboard"
                                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                        } ${
                                            isCollapsed ? "justify-center" : ""
                                        }`}
                                    >
                                        <Home
                                            size={20}
                                            className={`flex-shrink-0 ${
                                                activeItem === "Dashboard"
                                                    ? "text-blue-400"
                                                    : ""
                                            }`}
                                        />
                                        {!isCollapsed && (
                                            <span className="font-medium flex-1 text-left">
                                                Dashboard
                                            </span>
                                        )}
                                    </Link>

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                            <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                                <span className="text-sm font-medium">
                                                    Dashboard
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Home */}
                                <div className="relative group">
                                    <Link
                                        href="/home"
                                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                            activeItem === "Home"
                                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                        } ${
                                            isCollapsed ? "justify-center" : ""
                                        }`}
                                    >
                                        <Home
                                            size={20}
                                            className={`flex-shrink-0 ${
                                                activeItem === "Home"
                                                    ? "text-blue-400"
                                                    : ""
                                            }`}
                                        />
                                        {!isCollapsed && (
                                            <span className="font-medium flex-1 text-left">
                                                Home
                                            </span>
                                        )}
                                    </Link>

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                            <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                                <span className="text-sm font-medium">
                                                    Home
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Users */}
                                <div className="relative group">
                                    <Link
                                        href="/user-management"
                                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                            activeItem === "Users"
                                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                        } ${
                                            isCollapsed ? "justify-center" : ""
                                        }`}
                                    >
                                        <Users
                                            size={20}
                                            className={`flex-shrink-0 ${
                                                activeItem === "Users"
                                                    ? "text-blue-400"
                                                    : ""
                                            }`}
                                        />
                                        {!isCollapsed && (
                                            <span className="font-medium flex-1 text-left">
                                                Users
                                            </span>
                                        )}
                                    </Link>

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                            <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                                <span className="text-sm font-medium">
                                                    Users
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Testimonials */}
                                <div className="relative group">
                                    <Link
                                        href="/testimonials"
                                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                            activeItem === "Testimonials"
                                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                        } ${
                                            isCollapsed ? "justify-center" : ""
                                        }`}
                                    >
                                        <MessageSquareQuote
                                            size={20}
                                            className={`flex-shrink-0 ${
                                                activeItem === "Testimonials"
                                                    ? "text-blue-400"
                                                    : ""
                                            }`}
                                        />
                                        {!isCollapsed && (
                                            <span className="font-medium flex-1 text-left">
                                                Testimonials
                                            </span>
                                        )}
                                    </Link>

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                            <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                                <span className="text-sm font-medium">
                                                    Testimonials
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Order Products */}
                                <div className="relative group">
                                    <Link
                                        href="/order-products"
                                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                            activeItem === "Order Products"
                                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                        } ${
                                            isCollapsed ? "justify-center" : ""
                                        }`}
                                    >
                                        <Home
                                            size={20}
                                            className={`flex-shrink-0 ${
                                                activeItem === "Order Products"
                                                    ? "text-blue-400"
                                                    : ""
                                            }`}
                                        />
                                        {!isCollapsed && (
                                            <span className="font-medium flex-1 text-left">
                                                Order Products
                                            </span>
                                        )}
                                    </Link>

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                            <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                                <span className="text-sm font-medium">
                                                    Order Products
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Activity Logs */}
                                <div className="relative group">
                                    <Link
                                        href="/activity-log"
                                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                            activeItem === "Activity Logs"
                                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                        } ${
                                            isCollapsed ? "justify-center" : ""
                                        }`}
                                    >
                                        <Activity
                                            size={20}
                                            className={`flex-shrink-0 ${
                                                activeItem === "Activity Logs"
                                                    ? "text-blue-400"
                                                    : ""
                                            }`}
                                        />
                                        {!isCollapsed && (
                                            <span className="font-medium flex-1 text-left">
                                                Activity Logs
                                            </span>
                                        )}
                                    </Link>

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                            <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                                <span className="text-sm font-medium">
                                                    Activity Logs
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {isAdmin && (
                            <>
                                {/* Admin Dashboard */}

                                <div className="relative group">
                                    <Link
                                        href="/admin-dashboard"
                                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                            activeItem === "Dashboard"
                                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                        } ${
                                            isCollapsed ? "justify-center" : ""
                                        }`}
                                    >
                                        <Home
                                            size={20}
                                            className={`flex-shrink-0 ${
                                                activeItem === "Dashboard"
                                                    ? "text-blue-400"
                                                    : ""
                                            }`}
                                        />
                                        {!isCollapsed && (
                                            <span className="font-medium flex-1 text-left">
                                                Dashboard
                                            </span>
                                        )}
                                    </Link>

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                            <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                                <span className="text-sm font-medium">
                                                    Dashboard
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Category */}
                        <div className="relative group">
                            <Link
                                href="/categories"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Category"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <FolderTree
                                    size={20}
                                    className={`flex-shrink-0 ${
                                        activeItem === "Category"
                                            ? "text-blue-400"
                                            : ""
                                    }`}
                                />
                                {!isCollapsed && (
                                    <span className="font-medium flex-1 text-left">
                                        Category
                                    </span>
                                )}
                            </Link>

                            {isCollapsed && (
                                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                    <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                        <span className="text-sm font-medium">
                                            Category
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sub Category */}
                        <div className="relative group">
                            <Link
                                href="/sub_category"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Sub Category"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <Layers
                                    size={20}
                                    className={`flex-shrink-0 ${
                                        activeItem === "Sub Category"
                                            ? "text-blue-400"
                                            : ""
                                    }`}
                                />
                                {!isCollapsed && (
                                    <span className="font-medium flex-1 text-left">
                                        Sub Category
                                    </span>
                                )}
                            </Link>

                            {isCollapsed && (
                                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                    <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                        <span className="text-sm font-medium">
                                            Sub Category
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Products */}
                        <div className="relative group">
                            <Link
                                href="/products"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Products"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <Package
                                    size={20}
                                    className={`flex-shrink-0 ${
                                        activeItem === "Products"
                                            ? "text-blue-400"
                                            : ""
                                    }`}
                                />
                                {!isCollapsed && (
                                    <span className="font-medium flex-1 text-left">
                                        Products
                                    </span>
                                )}
                            </Link>

                            {isCollapsed && (
                                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                    <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                        <span className="text-sm font-medium">
                                            Products
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Blog */}
                        <div className="relative group">
                            <Link
                                href="/blogs"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Blog"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <BookOpen
                                    size={20}
                                    className={`flex-shrink-0 ${
                                        activeItem === "Blog"
                                            ? "text-blue-400"
                                            : ""
                                    }`}
                                />
                                {!isCollapsed && (
                                    <span className="font-medium flex-1 text-left">
                                        Blog
                                    </span>
                                )}
                            </Link>

                            {isCollapsed && (
                                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                    <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                        <span className="text-sm font-medium">
                                            Blog
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Setting */}
                        <div className="relative group">
                            <Link
                                href="/admin-setting"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Setting"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <Settings
                                    size={20}
                                    className={`flex-shrink-0 ${
                                        activeItem === "Setting"
                                            ? "text-blue-400"
                                            : ""
                                    }`}
                                />
                                {!isCollapsed && (
                                    <span className="font-medium flex-1 text-left">
                                        Setting
                                    </span>
                                )}
                            </Link>

                            {isCollapsed && (
                                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                    <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                        <span className="text-sm font-medium">
                                            Setting
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSideBar;
