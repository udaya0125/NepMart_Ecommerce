import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Home,
    Package,
    BookOpen,
    X,
    Menu,
    Settings,
} from "lucide-react";

const CustomerSideBar = ({
    isCollapsed,
    isMobileOpen,
    onMobileToggle,
    user,
    toggleSidebar,
}) => {
    const { url } = usePage();
    const [activeItem, setActiveItem] = useState("");
    const [isContentOpen, setIsContentOpen] = useState(false);

    useEffect(() => {
        const path = url.split("/")[1] || "dashboard";
        const activeMap = {
            dashboard: "Dashboard",
            "user-home": "Home",
            "user-products": "Products",
            cart: "Cart",
            setting: "Settings",
        };

        setActiveItem(activeMap[path] || "Dashboard");

        if (path.startsWith("content")) {
            setIsContentOpen(true);
        }
    }, [url]);


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
                                src="logo.jpg"
                                alt="Logo"
                                className="h-12 w-[5rem] rounded-lg"
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
                        {/* Dashboard */}


                         <div className="relative group">
                            <Link
                                href="/customer-dashboard"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Dashboard"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                } ${isCollapsed ? "justify-center" : ""}`}
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

                        
                        <div className="relative group">
                            <Link
                                href="/customer-home"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Home"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                } ${isCollapsed ? "justify-center" : ""}`}
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

                        {/* Products */}
                        <div className="relative group">
                            <Link
                                href="/customer-products"
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

                        {/* Cart */}
                        <div className="relative group">
                            <Link
                                href="/product-cart"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Cart"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <BookOpen
                                    size={20}
                                    className={`flex-shrink-0 ${
                                        activeItem === "Cart"
                                            ? "text-blue-400"
                                            : ""
                                    }`}
                                />
                                {!isCollapsed && (
                                    <span className="font-medium flex-1 text-left">
                                        Cart
                                    </span>
                                )}
                            </Link>

                            {isCollapsed && (
                                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                    <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                        <span className="text-sm font-medium">
                                            Cart
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <div className="relative group">
                            <Link
                                href="/customer-setting"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Settings"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <Settings
                                    size={20}
                                    className={`flex-shrink-0 ${
                                        activeItem === "Settings"
                                            ? "text-blue-400"
                                            : ""
                                    }`}
                                />
                                {!isCollapsed && (
                                    <span className="font-medium flex-1 text-left">
                                        Settings
                                    </span>
                                )}
                            </Link>

                            {isCollapsed && (
                                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                    <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap bg-gray-900 text-white">
                                        <span className="text-sm font-medium">
                                            Settings
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

export default CustomerSideBar;