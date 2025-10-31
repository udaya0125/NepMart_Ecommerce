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
    isMobileOpen,
    onMobileToggle,
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
                className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 w-[85%] md:w-[30%] lg:w-[18%] bg-white/95 backdrop-blur-md border-r border-gray-200/50 ${
                    isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Header with logo and close button */}
                <div className="flex h-16 items-center justify-between p-4 border-b border-gray-200 relative">
                    <div className="flex items-center gap-2 flex-1 pr-10">
                        <img
                            src="logo.jpg"
                            alt="Logo"
                            className="h-12 w-[5rem] rounded-lg"
                        />
                    </div> 
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
                                <span className="font-medium flex-1 text-left">
                                    Dashboard
                                </span>
                            </Link>
                        </div>

                        
                        <div className="relative group">
                            <Link
                                href="/customer-home"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Home"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
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
                                <span className="font-medium flex-1 text-left">
                                    Home
                                </span>
                            </Link>
                        </div>           

                        {/* Products */}
                        <div className="relative group">
                            <Link
                                href="/customer-products"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Products"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <Package
                                    size={20}
                                    className={`flex-shrink-0 ${
                                        activeItem === "Products"
                                            ? "text-blue-400"
                                            : ""
                                    }`}
                                />
                                <span className="font-medium flex-1 text-left">
                                    Products
                                </span>
                            </Link>
                        </div>

                        {/* Cart */}
                        <div className="relative group">
                            <Link
                                href="/product-cart"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Cart"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <BookOpen
                                    size={20}
                                    className={`flex-shrink-0 ${
                                        activeItem === "Cart"
                                            ? "text-blue-400"
                                            : ""
                                    }`}
                                />
                                <span className="font-medium flex-1 text-left">
                                    Cart
                                </span>
                            </Link>
                        </div>

                        {/* Settings */}
                        <div className="relative group">
                            <Link
                                href="/customer-setting"
                                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                    activeItem === "Settings"
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <Settings
                                    size={20}
                                    className={`flex-shrink-0 ${
                                        activeItem === "Settings"
                                            ? "text-blue-400"
                                            : ""
                                    }`}
                                />
                                <span className="font-medium flex-1 text-left">
                                    Settings
                                </span>
                            </Link>
                        </div>
                                            
                    </div>                  
                </div>
            </div>
        </div>
    );
};

export default CustomerSideBar;