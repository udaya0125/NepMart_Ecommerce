import {
    ChevronDown,
    Heart,
    Menu,
    ShoppingCart,
    X,
    Package,
    Shirt,
    Watch,
    Sparkles,
    Grid3x3,
    Tag,
    TrendingUp,
    Star,
    Settings,
    LogOut,
    HelpCircle,
    ShoppingBag,
    LogIn,
    UserPlus,
    Home,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import axios from "axios";
import ShoppingCard from "@/MainComponents/ShoppingCard";

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const userDropdownRef = useRef(null);

    // Get auth data from Inertia page props
    const { auth } = usePage().props;
    const isLoggedIn = !!auth.user;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target)
            ) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleMobileLinkClick = () => {
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
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

    const handleUserAction = (action, href) => {
        setIsUserDropdownOpen(false);
        
        if (action === "logout") {
            handleLogout();
            return;
        }
        
        // Navigate using the href if provided
        if (href) {
            router.visit(href);
        }
    };

    const handleMouseEnter = (dropdown) => {
        setActiveDropdown(dropdown);
    };

    const handleMouseLeave = () => {
        setActiveDropdown(null);
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!auth.user?.name) return "U";
        return auth.user.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const dropdownData = {
        shop: [
            {
                name: "New Arrivals",
                icon: Sparkles,
                href: "/shop/new",
                badge: "Hot",
            },
            {
                name: "Best Sellers",
                icon: TrendingUp,
                href: "/shop/best-sellers",
            },
            {
                name: "Sale Items",
                icon: Tag,
                href: "/shop/sale",
                badge: "50% Off",
            },
            { name: "Featured", icon: Star, href: "/shop/featured" },
        ],
        category: [
            { name: "Men's Clothing", icon: Shirt, href: "/category/mens" },
            { name: "Women's Clothing", icon: Shirt, href: "/category/womens" },
            { name: "Accessories", icon: Watch, href: "/category/accessories" },
            { name: "All Categories", icon: Grid3x3, href: "/category" },
        ],
        products: [
            { name: "T-Shirts", icon: Shirt, href: "/products/tshirts" },
            { name: "Hoodies", icon: Package, href: "/products/hoodies" },
            { name: "Pants", icon: Package, href: "/products/pants" },
            { name: "View All", icon: Grid3x3, href: "/products" },
        ],
    };

    const userDropdownItems = [
        { name: "Dashboard", icon: Home, href: '/dashboard', action: "dashboard" },
        { name: "Settings", icon: Settings, href: '', action: "settings" },
        { name: "Help & Support", icon: HelpCircle, href: '/help', action: "help" },
        { name: "Logout", icon: LogOut, action: "logout", danger: true },
    ];

    return (
        <>
            {/* Navbar */}
            <div
                className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ease-in-out ${
                    isScrolled
                        ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
                        : "bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center flex-shrink-0">
                            <Link
                                href="/"
                                onClick={handleMobileLinkClick}
                                className="group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                                            isScrolled
                                                ? "text-gray-900"
                                                : "text-white"
                                        }`}
                                    >
                                        LOGO
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <nav
                            className={`hidden lg:flex items-center space-x-1 font-medium transition-colors duration-300 ${
                                isScrolled ? "text-gray-700" : "text-white"
                            }`}
                        >
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-lg hover:text-red-500 transition-all duration-200"
                                onClick={handleMobileLinkClick}
                            >
                                Home
                            </Link>

                            {/* Shop Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter("shop")}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="flex items-center gap-1 px-4 py-2 rounded-lg hover:text-red-500 transition-all duration-200">
                                    Shop
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform duration-300 ${
                                            activeDropdown === "shop"
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`absolute top-7 left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
                                        activeDropdown === "shop"
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-4 pointer-events-none"
                                    }`}
                                >
                                    <div className="py-3">
                                        {dropdownData.shop.map(
                                            (item, index) => {
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={item.href}
                                                        className="flex items-center justify-between gap-3 px-5 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
                                                                <Icon className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
                                                            </div>
                                                            <span className="font-medium text-sm">
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                        {item.badge && (
                                                            <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Category Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() =>
                                    handleMouseEnter("category")
                                }
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="flex items-center gap-1 px-4 py-2 rounded-lg hover:text-red-500 transition-all duration-200">
                                    Category
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform duration-300 ${
                                            activeDropdown === "category"
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`absolute top-7 left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
                                        activeDropdown === "category"
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-4 pointer-events-none"
                                    }`}
                                >
                                    <div className="py-3">
                                        {dropdownData.category.map(
                                            (item, index) => {
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={item.href}
                                                        className="flex items-center gap-3 px-5 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 group"
                                                    >
                                                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
                                                            <Icon className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
                                                        </div>
                                                        <span className="font-medium text-sm">
                                                            {item.name}
                                                        </span>
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Products Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() =>
                                    handleMouseEnter("products")
                                }
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="flex items-center gap-1 px-4 py-2 rounded-lg hover:text-red-500 transition-all duration-200">
                                    Products
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform duration-300 ${
                                            activeDropdown === "products"
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`absolute top-7 left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
                                        activeDropdown === "products"
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-4 pointer-events-none"
                                    }`}
                                >
                                    <div className="py-3">
                                        {dropdownData.products.map(
                                            (item, index) => {
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={item.href}
                                                        className="flex items-center gap-3 px-5 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 group"
                                                    >
                                                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
                                                            <Icon className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
                                                        </div>
                                                        <span className="font-medium text-sm">
                                                            {item.name}
                                                        </span>
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/blog"
                                className="px-4 py-2 rounded-lg hover:text-red-500 transition-all duration-200"
                                onClick={handleMobileLinkClick}
                            >
                                Blog
                            </Link>
                            <Link
                                href="/contact-us"
                                className="px-4 py-2 rounded-lg hover:text-red-500 transition-all duration-200"
                                onClick={handleMobileLinkClick}
                            >
                                Contact
                            </Link>
                        </nav>

                        {/* Right Icons */}
                        <div className="flex items-center gap-4">
                            {/* Heart Icon */}
                            <button
                                className={`hidden lg:flex p-2.5 rounded-xl transition-all duration-200 group ${
                                    isScrolled ? "text-gray-700" : "text-white"
                                }`}
                            >
                                <Heart className="h-5 w-5 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                            </button>

                            {/* Cart Icon with Badge */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className={`hidden lg:flex relative p-2.5 rounded-xl transition-all duration-200 group ${
                                    isScrolled ? "text-gray-700" : "text-white"
                                }`}
                            >
                                <ShoppingCart className="h-5 w-5 group-hover:text-red-500 transition-colors" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                    3
                                </span>
                            </button>

                            {/* Auth Section - Show Sign In/Sign Up OR User Dropdown */}
                            {isLoggedIn ? (
                                /* User Dropdown - Logged In */
                                <div
                                    className="hidden lg:block relative"
                                    ref={userDropdownRef}
                                >
                                    <button
                                        onClick={toggleUserDropdown}
                                        className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200 ${
                                            isScrolled
                                                ? "text-gray-700"
                                                : "text-white"
                                        }`}
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-semibold ring-2 ring-white shadow-lg">
                                            {getUserInitials()}
                                        </div>
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform duration-300 ${
                                                isUserDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {/* User Dropdown Menu */}
                                    <div
                                        className={`absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
                                            isUserDropdownOpen
                                                ? "opacity-100 visible translate-y-0"
                                                : "opacity-0 invisible -translate-y-4 pointer-events-none"
                                        }`}
                                    >
                                        {/* User Info Header */}
                                        <div className="px-5 py-4 bg-gradient-to-br from-red-50 to-pink-50 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                    {getUserInitials()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {auth.user?.name ||
                                                            "User"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {auth.user?.email || ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dropdown Items */}
                                        <div className="py-2">
                                            {userDropdownItems.map(
                                                (item, index) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() =>
                                                                handleUserAction(
                                                                    item.action,
                                                                    item.href
                                                                )
                                                            }
                                                            className={`flex items-center gap-3 w-full px-5 py-3.5 transition-all duration-200 group ${
                                                                item.danger
                                                                    ? "text-red-600 hover:bg-red-50"
                                                                    : "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600"
                                                            } ${
                                                                index === 0
                                                                    ? ""
                                                                    : "border-t border-gray-50"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`p-2 rounded-lg transition-colors ${
                                                                    item.danger
                                                                        ? "bg-red-50 group-hover:bg-red-100"
                                                                        : "bg-gray-100 group-hover:bg-red-100"
                                                                }`}
                                                            >
                                                                <Icon
                                                                    className={`h-4 w-4 transition-colors ${
                                                                        item.danger
                                                                            ? "text-red-600"
                                                                            : "text-gray-500 group-hover:text-red-600"
                                                                    }`}
                                                                />
                                                            </div>
                                                            <span className="font-medium text-sm">
                                                                {item.name}
                                                            </span>
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Sign In / Sign Up Buttons - Logged Out */
                                <div className="hidden lg:flex items-center gap-3">
                                    <Link
                                        href={route("login")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                            isScrolled
                                                ? "text-gray-700 hover:bg-gray-100"
                                                : "text-white hover:bg-white/10"
                                        }`}
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg shadow-red-500/30"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                className={`lg:hidden p-2.5 rounded-xl hover:bg-red-50 transition-all duration-200 ${
                                    isScrolled ? "text-gray-700" : "text-white"
                                }`}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label={
                                    isMenuOpen ? "Close menu" : "Open menu"
                                }
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Offcanvas Menu */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-500 ease-out lg:hidden shadow-2xl ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-br from-red-50 to-pink-50">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                                    {getUserInitials()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {auth.user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {auth.user?.email || ""}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route("login")}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="h-4 w-4" />
                                    Sign In
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Sign Up
                                </Link>
                            </div>
                        )}
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-white/80 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6 text-gray-700" />
                        </button>
                    </div>

                    {/* Mobile Nav Links */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4">
                        <div className="space-y-2">
                            <Link
                                href="/"
                                onClick={handleMobileLinkClick}
                                className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                onClick={handleMobileLinkClick}
                                className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
                            >
                                Shop
                            </Link>
                            <Link
                                href="/category"
                                onClick={handleMobileLinkClick}
                                className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
                            >
                                Category
                            </Link>
                            <Link
                                href="/products"
                                onClick={handleMobileLinkClick}
                                className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
                            >
                                Products
                            </Link>
                            <Link
                                href="/blog"
                                onClick={handleMobileLinkClick}
                                className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
                            >
                                Blog
                            </Link>
                            <Link
                                href="/contact-us"
                                onClick={handleMobileLinkClick}
                                className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
                            >
                                Contact
                            </Link>
                        </div>

                        {/* Mobile User Menu (only when logged in) */}
                        {isLoggedIn && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Account
                                </p>
                                <div className="space-y-1">
                                    {userDropdownItems.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    handleUserAction(item.action, item.href);
                                                    setIsMenuOpen(false);
                                                }}
                                                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                                                    item.danger
                                                        ? "text-red-600 hover:bg-red-50"
                                                        : "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600"
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {item.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-100 space-y-2">
                        <button 
                            onClick={() => {
                                setIsCartOpen(true);
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            View Cart (3)
                        </button>
                        <button className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                            <Heart className="h-5 w-5" />
                            Wishlist
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
            <ShoppingCard
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </>
    );
};

export default Navbar;

// import ShoppingCard from "@/MainComponents/ShoppingCard";
// import {
//     ChevronDown,
//     Heart,
//     Menu,
//     ShoppingCart,
//     User,
//     X,
//     Package,
//     Shirt,
//     Watch,
//     Sparkles,
//     Grid3x3,
//     Tag,
//     TrendingUp,
//     Star,
//     Settings,
//     LogOut,
//     HelpCircle,
//     ShoppingBag,
// } from "lucide-react";
// import React, { useState, useEffect, useRef } from "react";

// const Navbar = () => {
//     const [isCartOpen, setIsCartOpen] = useState(false);
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [activeDropdown, setActiveDropdown] = useState(null);
//     const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

//     const userDropdownRef = useRef(null);

//     useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 20);
//         };
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     useEffect(() => {
//         if (isMenuOpen) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "";
//         }
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [isMenuOpen]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 userDropdownRef.current &&
//                 !userDropdownRef.current.contains(event.target)
//             ) {
//                 setIsUserDropdownOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const handleMobileLinkClick = () => {
//         setIsMenuOpen(false);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     const toggleUserDropdown = () => {
//         setIsUserDropdownOpen(!isUserDropdownOpen);
//     };

//     const handleUserAction = (action) => {
//         setIsUserDropdownOpen(false);
//         switch (action) {
//             case "profile":
//                 console.log("Navigate to profile");
//                 break;
//             case "settings":
//                 console.log("Navigate to settings");
//                 break;
//             case "help":
//                 console.log("Navigate to help");
//                 break;
//             case "logout":
//                 console.log("Logging out...");
//                 break;
//             default:
//                 break;
//         }
//     };

//     const dropdownData = {
//         shop: [
//             {
//                 name: "New Arrivals",
//                 icon: Sparkles,
//                 href: "/shop/new",
//                 badge: "Hot",
//             },
//             {
//                 name: "Best Sellers",
//                 icon: TrendingUp,
//                 href: "/shop/best-sellers",
//             },
//             {
//                 name: "Sale Items",
//                 icon: Tag,
//                 href: "/shop/sale",
//                 badge: "50% Off",
//             },
//             { name: "Featured", icon: Star, href: "/shop/featured" },
//         ],
//         category: [
//             { name: "Men's Clothing", icon: Shirt, href: "/category/mens" },
//             { name: "Women's Clothing", icon: Shirt, href: "/category/womens" },
//             { name: "Accessories", icon: Watch, href: "/category/accessories" },
//             { name: "All Categories", icon: Grid3x3, href: "/category" },
//         ],
//         products: [
//             { name: "T-Shirts", icon: Shirt, href: "/products/tshirts" },
//             { name: "Hoodies", icon: Package, href: "/products/hoodies" },
//             { name: "Pants", icon: Package, href: "/products/pants" },
//             { name: "View All", icon: Grid3x3, href: "/products" },
//         ],
//     };

//     const userDropdownItems = [
//         { name: "My Profile", icon: User, action: "profile" },
//         { name: "Settings", icon: Settings, action: "settings" },
//         { name: "Help & Support", icon: HelpCircle, action: "help" },
//         { name: "Logout", icon: LogOut, action: "logout", danger: true },
//     ];

//     const handleMouseEnter = (dropdown) => {
//         setActiveDropdown(dropdown);
//     };

//     const handleMouseLeave = () => {
//         setActiveDropdown(null);
//     };

//     return (
//         <>
//             {/* Navbar */}
//             <div
//                 className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ease-in-out ${
//                     isScrolled
//                         ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
//                         : "bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm"
//                 }`}
//             >
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center h-20">
//                         {/* Logo */}
//                         <div className="flex items-center flex-shrink-0">
//                             <a
//                                 href="/"
//                                 onClick={handleMobileLinkClick}
//                                 className="group"
//                             >
//                                 <div className="flex items-center space-x-3">
//                                     <div
//                                         className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
//                                             isScrolled
//                                                 ? "text-gray-900"
//                                                 : "text-white"
//                                         }`}
//                                     >
//                                         LOGO
//                                     </div>
//                                 </div>
//                             </a>
//                         </div>

//                         {/* Desktop Menu */}
//                         <nav
//                             className={`hidden lg:flex items-center space-x-1 font-medium transition-colors duration-300 ${
//                                 isScrolled ? "text-gray-700" : "text-white"
//                             }`}
//                         >
//                             <a
//                                 href="/"
//                                 className="px-4 py-2 rounded-lg hover:text-red-500  transition-all duration-200"
//                                 onClick={handleMobileLinkClick}
//                             >
//                                 Home
//                             </a>

//                             {/* Shop Dropdown */}
//                             <div
//                                 className="relative"
//                                 onMouseEnter={() => handleMouseEnter("shop")}
//                                 onMouseLeave={handleMouseLeave}
//                             >
//                                 <button className="flex items-center gap-1 px-4 py-2  rounded-lg hover:text-red-500  transition-all duration-200">
//                                     Shop
//                                     <ChevronDown
//                                         className={`h-4 w-4 transition-transform duration-300 ${
//                                             activeDropdown === "shop"
//                                                 ? "rotate-180"
//                                                 : ""
//                                         }`}
//                                     />
//                                 </button>

//                                 <div
//                                     className={`absolute top-7 left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
//                                         activeDropdown === "shop"
//                                             ? "opacity-100 visible translate-y-0"
//                                             : "opacity-0 invisible -translate-y-4 pointer-events-none"
//                                     }`}
//                                 >
//                                     <div className="py-3">
//                                         {dropdownData.shop.map(
//                                             (item, index) => {
//                                                 const Icon = item.icon;
//                                                 return (
//                                                     <a
//                                                         key={index}
//                                                         href={item.href}
//                                                         className="flex items-center justify-between gap-3 px-5 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 group"
//                                                     >
//                                                         <div className="flex items-center gap-3">
//                                                             <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
//                                                                 <Icon className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
//                                                             </div>
//                                                             <span className="font-medium text-sm">
//                                                                 {item.name}
//                                                             </span>
//                                                         </div>
//                                                         {item.badge && (
//                                                             <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
//                                                                 {item.badge}
//                                                             </span>
//                                                         )}
//                                                     </a>
//                                                 );
//                                             }
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Category Dropdown */}
//                             <div
//                                 className="relative"
//                                 onMouseEnter={() =>
//                                     handleMouseEnter("category")
//                                 }
//                                 onMouseLeave={handleMouseLeave}
//                             >
//                                 <button className="flex items-center gap-1 px-4 py-2 rounded-lg hover:text-red-500  transition-all duration-200">
//                                     Category
//                                     <ChevronDown
//                                         className={`h-4 w-4 transition-transform duration-300 ${
//                                             activeDropdown === "category"
//                                                 ? "rotate-180"
//                                                 : ""
//                                         }`}
//                                     />
//                                 </button>

//                                 <div
//                                     className={`absolute top-7 left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
//                                         activeDropdown === "category"
//                                             ? "opacity-100 visible translate-y-0"
//                                             : "opacity-0 invisible -translate-y-4 pointer-events-none"
//                                     }`}
//                                 >
//                                     <div className="py-3">
//                                         {dropdownData.category.map(
//                                             (item, index) => {
//                                                 const Icon = item.icon;
//                                                 return (
//                                                     <a
//                                                         key={index}
//                                                         href={item.href}
//                                                         className="flex items-center gap-3 px-5 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 group"
//                                                     >
//                                                         <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
//                                                             <Icon className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
//                                                         </div>
//                                                         <span className="font-medium text-sm">
//                                                             {item.name}
//                                                         </span>
//                                                     </a>
//                                                 );
//                                             }
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Products Dropdown */}
//                             <div
//                                 className="relative"
//                                 onMouseEnter={() =>
//                                     handleMouseEnter("products")
//                                 }
//                                 onMouseLeave={handleMouseLeave}
//                             >
//                                 <button className="flex items-center gap-1 px-4 py-2 rounded-lg hover:text-red-500  transition-all duration-200">
//                                     Products
//                                     <ChevronDown
//                                         className={`h-4 w-4 transition-transform duration-300 ${
//                                             activeDropdown === "products"
//                                                 ? "rotate-180"
//                                                 : ""
//                                         }`}
//                                     />
//                                 </button>

//                                 <div
//                                     className={`absolute top-7 left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
//                                         activeDropdown === "products"
//                                             ? "opacity-100 visible translate-y-0"
//                                             : "opacity-0 invisible -translate-y-4 pointer-events-none"
//                                     }`}
//                                 >
//                                     <div className="py-3">
//                                         {dropdownData.products.map(
//                                             (item, index) => {
//                                                 const Icon = item.icon;
//                                                 return (
//                                                     <a
//                                                         key={index}
//                                                         href={item.href}
//                                                         className="flex items-center gap-3 px-5 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 group"
//                                                     >
//                                                         <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
//                                                             <Icon className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
//                                                         </div>
//                                                         <span className="font-medium text-sm">
//                                                             {item.name}
//                                                         </span>
//                                                     </a>
//                                                 );
//                                             }
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             <a
//                                 href="/blog"
//                                 className="px-4 py-2 rounded-lg hover:text-red-500  transition-all duration-200"
//                                 onClick={handleMobileLinkClick}
//                             >
//                                 Blog
//                             </a>
//                             <a
//                                 href="/contact-us"
//                                 className="px-4 py-2 rounded-lg hover:text-red-500  transition-all duration-200"
//                                 onClick={handleMobileLinkClick}
//                             >
//                                 Contact
//                             </a>
//                         </nav>

//                         {/* Right Icons */}
//                         <div className="flex items-center gap-4">
//                             {/* Heart Icon */}
//                             <button
//                                 className={`hidden lg:flex p-2.5 rounded-xl  transition-all duration-200 group ${
//                                     isScrolled ? "text-gray-700" : "text-white"
//                                 }`}
//                             >
//                                 <Heart className="h-5 w-5 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
//                             </button>

//                             {/* Cart Icon with Badge */}
//                             <button
//                                 onClick={() => setIsCartOpen(true)}
//                                 className={`hidden lg:flex relative p-2.5 rounded-xl transition-all duration-200 group ${
//                                     isScrolled ? "text-gray-700" : "text-white"
//                                 }`}
//                             >
//                                 <ShoppingCart
//                                     className="cursor-pointer hover:text-red-500 transition-colors"
//                                     onClick={() => setIsCartOpen(true)}
//                                 />
//                                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
//                                     3
//                                 </span>
//                             </button>

//                             {/* User Dropdown */}
//                             <div
//                                 className="hidden lg:block relative"
//                                 ref={userDropdownRef}
//                             >
//                                 <button
//                                     onClick={toggleUserDropdown}
//                                     className={`flex items-center gap-2 p-1.5 rounded-xl  transition-all duration-200 ${
//                                         isScrolled
//                                             ? "text-gray-700"
//                                             : "text-white"
//                                     }`}
//                                 >
//                                     <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-semibold ring-2 ring-white shadow-lg">
//                                         JD
//                                     </div>
//                                     <ChevronDown
//                                         className={`h-4 w-4 transition-transform duration-300 ${
//                                             isUserDropdownOpen
//                                                 ? "rotate-180"
//                                                 : ""
//                                         }`}
//                                     />
//                                 </button>

//                                 {/* User Dropdown Menu */}
//                                 <div
//                                     className={`absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
//                                         isUserDropdownOpen
//                                             ? "opacity-100 visible translate-y-0"
//                                             : "opacity-0 invisible -translate-y-4 pointer-events-none"
//                                     }`}
//                                 >
//                                     {/* User Info Header */}
//                                     <div className="px-5 py-4 bg-gradient-to-br from-red-50 to-pink-50 border-b border-gray-100">
//                                         <div className="flex items-center gap-3">
//                                             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
//                                                 JD
//                                             </div>
//                                             <div>
//                                                 <p className="font-semibold text-gray-900">
//                                                     John Doe
//                                                 </p>
//                                                 <p className="text-sm text-gray-500">
//                                                     john.doe@example.com
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Dropdown Items */}
//                                     <div className="py-2">
//                                         {userDropdownItems.map(
//                                             (item, index) => {
//                                                 const Icon = item.icon;
//                                                 return (
//                                                     <button
//                                                         key={index}
//                                                         onClick={() =>
//                                                             handleUserAction(
//                                                                 item.action
//                                                             )
//                                                         }
//                                                         className={`flex items-center gap-3 w-full px-5 py-3.5 transition-all duration-200 group ${
//                                                             item.danger
//                                                                 ? "text-red-600 hover:bg-red-50"
//                                                                 : "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600"
//                                                         } ${
//                                                             index === 0
//                                                                 ? ""
//                                                                 : "border-t border-gray-50"
//                                                         }`}
//                                                     >
//                                                         <div
//                                                             className={`p-2 rounded-lg transition-colors ${
//                                                                 item.danger
//                                                                     ? "bg-red-50 group-hover:bg-red-100"
//                                                                     : "bg-gray-100 group-hover:bg-red-100"
//                                                             }`}
//                                                         >
//                                                             <Icon
//                                                                 className={`h-4 w-4 transition-colors ${
//                                                                     item.danger
//                                                                         ? "text-red-600"
//                                                                         : "text-gray-500 group-hover:text-red-600"
//                                                                 }`}
//                                                             />
//                                                         </div>
//                                                         <span className="font-medium text-sm">
//                                                             {item.name}
//                                                         </span>
//                                                     </button>
//                                                 );
//                                             }
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Mobile Menu Toggle */}
//                             <button
//                                 className={`lg:hidden p-2.5 rounded-xl hover:bg-red-50 transition-all duration-200 ${
//                                     isScrolled ? "text-gray-700" : "text-white"
//                                 }`}
//                                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                                 aria-label={
//                                     isMenuOpen ? "Close menu" : "Open menu"
//                                 }
//                             >
//                                 {isMenuOpen ? (
//                                     <X className="h-6 w-6" />
//                                 ) : (
//                                     <Menu className="h-6 w-6" />
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile Offcanvas Menu */}
//             <div
//                 className={`fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-500 ease-out lg:hidden shadow-2xl ${
//                     isMenuOpen ? "translate-x-0" : "-translate-x-full"
//                 }`}
//             >
//                 <div className="flex flex-col h-full">
//                     {/* Header */}
//                     <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-br from-red-50 to-pink-50">
//                         <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
//                                 JD
//                             </div>
//                             <div>
//                                 <p className="font-semibold text-gray-900 text-sm">
//                                     John Doe
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                     john.doe@example.com
//                                 </p>
//                             </div>
//                         </div>
//                         <button
//                             onClick={() => setIsMenuOpen(false)}
//                             className="p-2 rounded-lg hover:bg-white/80 transition-colors"
//                             aria-label="Close menu"
//                         >
//                             <X className="h-6 w-6 text-gray-700" />
//                         </button>
//                     </div>

//                     {/* Mobile Nav Links */}
//                     <nav className="flex-1 overflow-y-auto py-6 px-4">
//                         <div className="space-y-2">
//                             <a
//                                 href="/"
//                                 onClick={handleMobileLinkClick}
//                                 className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
//                             >
//                                 Home
//                             </a>
//                             <a
//                                 href="/shop"
//                                 onClick={handleMobileLinkClick}
//                                 className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
//                             >
//                                 Shop
//                             </a>
//                             <a
//                                 href="/category"
//                                 onClick={handleMobileLinkClick}
//                                 className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
//                             >
//                                 Category
//                             </a>
//                             <a
//                                 href="/products"
//                                 onClick={handleMobileLinkClick}
//                                 className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
//                             >
//                                 Products
//                             </a>
//                             <a
//                                 href="/blog"
//                                 onClick={handleMobileLinkClick}
//                                 className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
//                             >
//                                 Blog
//                             </a>
//                             <a
//                                 href="/contact-us"
//                                 onClick={handleMobileLinkClick}
//                                 className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all"
//                             >
//                                 Contact
//                             </a>
//                         </div>
//                     </nav>

//                     {/* Footer Actions */}
//                     <div className="p-4 border-t border-gray-100 space-y-2">
//                         <button className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
//                             <ShoppingBag className="h-5 w-5" />
//                             View Cart (3)
//                         </button>
//                         <button className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
//                             <Heart className="h-5 w-5" />
//                             Wishlist
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Backdrop */}
//             {isMenuOpen && (
//                 <div
//                     className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
//                     onClick={() => setIsMenuOpen(false)}
//                     aria-hidden="true"
//                 />
//             )}

//             {/* Shopping Cart Drawer */}
//             <ShoppingCard
//                 isOpen={isCartOpen}
//                 onClose={() => setIsCartOpen(false)}
//             />
//         </>
//     );
// };

// export default Navbar;
