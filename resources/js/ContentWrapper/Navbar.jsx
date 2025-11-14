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
import { useCart } from "../Contexts/CartContext";

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const userDropdownRef = useRef(null);
    const { cart } = useCart();

    // Get auth data from Inertia page props
    const { auth } = usePage().props;
    const isLoggedIn = !!auth.user;
    const userRole = auth.user?.role;

    // Get user image URL
    const getUserImage = () => {
        if (!auth.user?.image) return null;

        const imagePath = auth.user.image.replace("storage/", "");
        return `/storage/${imagePath}`;
    };

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

    // Get dashboard route based on user role
    const getDashboardRoute = () => {
        switch (userRole) {
            case "super_admin":
                return "/dashboard";
            case "admin":
                return "/admin-dashboard";
            case "customer":
                return null;
            default:
                return "/dashboard";
        }
    };

    // Get settings route based on user role
    const getSettingsRoute = () => {
        switch (userRole) {
            case "super admin":
            case "admin":
                return "/admin-setting";
            case "customer":
                return "/customer-setting";
            // default:
            //     return "/settings";
        }
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
            { name: "Electronics", icon: Shirt, href: "/category/?category=1" },
            { name: "Clothing", icon: Shirt, href: "/category/?category=2" },
            { name: "Accessories", icon: Watch, href: "/category/?category=4" },
            { name: "All Categories", icon: Grid3x3, href: "/category" },
        ],
    };

    const products = [
        {
            id: 1,
            name: "MVMT Chrono Analog Black Dial Men Watch",
            price: 27,
            originalPrice: 28,
            discount: "-4%",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
            rating: 5,
            href: "/product/1",
            slug: "mvmt-chrono-analog-black-dial-men-watch",
        },
        {
            id: 2,
            name: "Nike Air Gold Pink V Series Shoes",
            price: 30,
            originalPrice: 31,
            discount: "-3%",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
            rating: 4,
            href: "/product/2",
            slug: "nike-air-gold-pink-v-series-shoes",
        },
        {
            id: 3,
            name: "Tommy Hilfiger Skinny Mid-Rise Jeans",
            price: 24,
            originalPrice: 25,
            discount: "-4%",
            image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=200&fit=crop",
            rating: 5,
            href: "/product/3",
            slug: "tommy-hilfiger-skinny-mid-rise-jeans",
        },
        {
            id: 4,
            name: "Ray-Ban RB4246 Clubround Sunglasses",
            price: 19,
            originalPrice: null,
            discount: null,
            image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop",
            rating: 4,
            href: "/product/4",
            slug: "ray-ban-rb4246-clubround-sunglasses",
        },
        {
            id: 5,
            name: "Faux Leather Casual Blue Wallet For Men",
            price: 20,
            originalPrice: 24,
            discount: "-5%",
            image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=200&fit=crop",
            rating: 4,
            href: "/product/5",
            slug: "faux-leather-casual-blue-wallet-for-men",
        },
        {
            id: 6,
            name: "Apple AirPods Pro with Wireless Charging",
            price: 45,
            originalPrice: 49,
            discount: "-8%",
            image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=200&h=200&fit=crop",
            rating: 5,
            href: "/product/6",
            slug: "apple-airpods-pro-with-wireless-charging",
        },
        // {
        //     id: 7,
        //     name: "Samsung Galaxy Watch 4 Classic",
        //     price: 38,
        //     originalPrice: 42,
        //     discount: "-10%",
        //     image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=200&h=200&fit=crop",
        //     rating: 4,
        //     href: "/product/7",
        //     slug: "samsung-galaxy-watch-4-classic",
        // },
        // {
        //     id: 8,
        //     name: "Adidas Ultraboost 21 Running Shoes",
        //     price: 35,
        //     originalPrice: 40,
        //     discount: "-13%",
        //     image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop",
        //     rating: 5,
        //     href: "/product/8",
        //     slug: "adidas-ultraboost-21-running-shoes",
        // },
    ];

    // User dropdown items based on role
    const getUserDropdownItems = () => {
        const dashboardRoute = getDashboardRoute();
        const settingsRoute = getSettingsRoute();

        const items = [];

        // Only add dashboard for super_admin and admin
        if (dashboardRoute) {
            items.push({
                name: "Dashboard",
                icon: Home,
                href: dashboardRoute,
                action: "dashboard",
            });
        }

        // Add settings for all roles
        items.push({
            name: "Settings",
            icon: Settings,
            href: settingsRoute,
            action: "settings",
        });

        // Add help & support for all roles
        items.push({
            name: "Help & Support",
            icon: HelpCircle,
            href: "/help-support",
            action: "help",
        });

        // Add logout for all roles
        items.push({
            name: "Logout",
            icon: LogOut,
            action: "logout",
            danger: true,
        });

        return items;
    };

    const userDropdownItems = getUserDropdownItems();
    const userImage = getUserImage();

    // Function to render star ratings
    const renderRating = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`h-3 w-3 ${
                    index < rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    return (
        <>
            {/* Navbar */}
            <div
                className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ease-in-out ${
                    isScrolled
                        ? "bg-[#EFE9E3] backdrop-blur-xl shadow-lg border-b border-gray-100"
                        : "bg-black/30 backdrop-blur-sm"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        {/* Logo */}
                        <div className="flex items-center flex-shrink-0">
                            <Link
                                href="/"
                                onClick={handleMobileLinkClick}
                                className="group"
                            >
                                <div className="flex items-center space-x-3">
                                    <img
                                        src="/logo/logo.png"
                                        alt="logo"
                                        className="w-full h-12 object-contain"
                                    />
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
                                    className={`absolute top-7 left-1/2 -translate-x-1/2 mt-3 w-[95rem] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
                                        activeDropdown === "products"
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-4 pointer-events-none"
                                    }`}
                                >
                                    <div className="p-6">
                                        {/* <div className="mb-4">
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                Featured Products
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Handpicked items for you
                                            </p>
                                        </div> */}

                                        {/* Grid Layout for Products */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                                            {products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="group relative bg-white rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-xl hover:shadow-red-50 transition-all duration-300 overflow-hidden"
                                                >
                                                    <Link
                                                        href={product.href}
                                                        className="block"
                                                    >
                                                        {/* Product Image with Hover Effects */}
                                                        <div className="relative overflow-hidden bg-gray-50">
                                                            <img
                                                                src={
                                                                    product.image
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                                            />

                                                            {/* Discount Badge */}
                                                            {product.discount && (
                                                                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                                    {
                                                                        product.discount
                                                                    }
                                                                </div>
                                                            )}

                                                            {/* Quick Action Overlay */}
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300" />
                                                        </div>

                                                        {/* Product Content */}
                                                        <div className="p-5">
                                                            {/* Rating */}
                                                            <div className="flex items-center gap-1 mb-3">
                                                                {renderRating(
                                                                    product.rating
                                                                )}
                                                                <span className="text-xs text-gray-500 ml-1">
                                                                    (
                                                                    {
                                                                        product.rating
                                                                    }
                                                                    )
                                                                </span>
                                                            </div>

                                                            {/* Product Name */}
                                                            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors mb-3 leading-tight">
                                                                {product.name}
                                                            </h3>

                                                            {/* Price Section */}
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-lg font-bold text-red-600">
                                                                        Rs.
                                                                        {
                                                                            product.price
                                                                        }
                                                                    </span>
                                                                    {product.originalPrice && (
                                                                        <span className="text-sm text-gray-500 line-through">
                                                                            Rs.
                                                                            {
                                                                                product.originalPrice
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            <Link
                                                href="/category"
                                                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                            >
                                                <Package className="h-4 w-4" />
                                                View All Products
                                            </Link>
                                        </div>
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
                            <Link
                                href={"/wishlist"}
                                className={`hidden lg:flex p-2.5 rounded-xl transition-all duration-200 group ${
                                    isScrolled ? "text-gray-700" : "text-white"
                                }`}
                            >
                                <Heart className="h-5 w-5 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                            </Link>

                            {/* Cart Icon with Badge */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className={`hidden lg:flex relative p-2.5 rounded-xl transition-all duration-200 group ${
                                    isScrolled ? "text-gray-700" : "text-white"
                                }`}
                            >
                                <ShoppingCart className="h-5 w-5 group-hover:text-red-500 transition-colors" />
                                {cart.totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                        {cart.totalItems > 99
                                            ? "99+"
                                            : cart.totalItems}
                                    </span>
                                )}
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
                                        <img
                                            src={
                                                auth.user?.image
                                                    ? `/storage/${auth.user.image}`
                                                    : "/user/user01.png"
                                            }
                                            alt={`${
                                                auth.user?.name || "User"
                                            } profile`}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
                                        />

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
                                                <img
                                                    src={
                                                        auth.user?.image
                                                            ? `/storage/${auth.user.image}`
                                                            : "/user/user01.png"
                                                    }
                                                    alt={`${
                                                        auth.user?.name ||
                                                        "User"
                                                    } profile`}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                                />

                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {auth.user?.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {auth.user?.email || ""}
                                                    </p>
                                                    <p className="text-xs text-gray-400 capitalize">
                                                        {userRole?.replace(
                                                            "_",
                                                            " "
                                                        ) || "User"}
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
                                <img
                                    src={
                                        auth.user?.image
                                            ? `/storage/${auth.user.image}`
                                            : "/user/user01.png"
                                    }
                                    alt={auth.user?.name || "User"}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                />

                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {auth.user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {auth.user?.email || ""}
                                    </p>
                                    <p className="text-xs text-gray-400 capitalize">
                                        {userRole?.replace("_", " ") || "User"}
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
                                                    handleUserAction(
                                                        item.action,
                                                        item.href
                                                    );
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
                            View Cart ({cart.totalItems})
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
