import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
    ShoppingCart,
    Heart,
    Star,
    Flame,
    Grid,
    List,
    SlidersHorizontal,
    X,
    ChevronDown,
    TrendingUp,
    Package,
} from "lucide-react";
import Navbar from "@/ContentWrapper/Navbar";
import productsData from "../../../JsonData/finalproducts.json";
import { useCart } from "../../Contexts/CartContext";
import { useWishlist } from "../../Contexts/WishlistContext";

const AllProductsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("featured");
    const [priceRange, setPriceRange] = useState([0, 150000]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [showNotification, setShowNotification] = useState(null);

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const loadProducts = () => {
            setLoading(true);

            // Flatten all products from all categories
            const allProducts = [];
            const categories = Object.keys(productsData.products || {});

            categories.forEach((category) => {
                const categoryProducts = productsData.products[category];
                categoryProducts.forEach((product) => {
                    allProducts.push({
                        ...product,
                        category: category,
                    });
                });
            });

            setProducts(allProducts);
            setLoading(false);
        };

        loadProducts();
    }, []);

    const categories = [
        { id: "all", name: "All Products", icon: Package },
        { id: "Electronics", name: "Electronics", icon: ShoppingCart },
        { id: "Clothing", name: "Fashion", icon: Heart },
        { id: "Bags", name: "Bags", icon: Star },
        { id: "Accessories", name: "Accessories", icon: TrendingUp },
    ];

    const sortOptions = [
        { value: "featured", label: "Featured" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "price-high", label: "Price: High to Low" },
        { value: "rating", label: "Highest Rated" },
        { value: "newest", label: "Newest First" },
    ];

    const filteredProducts = products
        .filter((product) => {
            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;
            const matchesSearch = product.name
                .toLowerCase()
                .includes(""); // Add search term if needed
            const matchesPrice =
                product.price >= priceRange[0] &&
                product.price <= priceRange[1];
            const matchesRating =
                selectedRating === 0 || product.rating >= selectedRating;
            return (
                matchesCategory &&
                matchesSearch &&
                matchesPrice &&
                matchesRating
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "rating":
                    return b.rating - a.rating;
                case "newest":
                    return (
                        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                    );
                default:
                    return 0;
            }
        });

    const showNotificationMessage = (message, type = "success") => {
        setShowNotification({ message, type });
        setTimeout(() => setShowNotification(null), 3000);
    };

    const handleAddToCart = (product) => {
        if (!product.inStock) return;

        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            slug: product.slug,
        };

        addToCart(cartProduct);
        showNotificationMessage(`${product.name} added to cart!`);
    };

    const handleWishlistToggle = (product) => {
        const wishlistProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            slug: product.slug,
            rating: product.rating,
            inStock: product.inStock,
        };

        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
            showNotificationMessage(
                `${product.name} removed from wishlist`,
                "info"
            );
        } else {
            addToWishlist(wishlistProduct);
            showNotificationMessage(`${product.name} added to wishlist!`);
        }
    };

    const handleBuyNow = (product) => {
        handleAddToCart(product);
        window.location.href = "/check-out";
    };

    const renderStars = (rating) => {
        const safeRating = rating || 0;
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < safeRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    if (loading) {
        return (
            <div className="bg-[#ECF4E8] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
                        <ShoppingCart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-500" />
                    </div>
                    <div className="text-gray-600 text-lg font-medium">
                        Loading amazing products...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            {/* Add line-clamp CSS */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>

            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden">
                <img
                    src="hero.png"
                    alt="Products hero image"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Our Products
                    </h1>
                    <p className="text-lg md:text-xl text-center max-w-2xl mb-8">
                        Discover premium quality products crafted with
                        excellence
                    </p>

                    
                </div>
            </div>

            {/* Notification */}
            {showNotification && (
                <div
                    className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg border-2 transition-all duration-300 animate-in slide-in-from-right ${
                        showNotification.type === "success"
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-blue-50 border-blue-200 text-blue-800"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-2 h-2 rounded-full ${
                                showNotification.type === "success"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                            }`}
                        ></div>
                        {showNotification.message}
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-[#ECF4E8]/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Toolbar */}
                    <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 animate-in fade-in duration-500">
                        {/* Category Pills */}
                        <div className="w-full lg:w-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                {categories.map((category, idx) => {
                                    const Icon = category.icon;
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() =>
                                                setSelectedCategory(category.id)
                                            }
                                            style={{
                                                animationDelay: `${idx * 50}ms`,
                                            }}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 animate-in fade-in slide-in-from-bottom-2 ${
                                                selectedCategory === category.id
                                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-300"
                                                    : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300"
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {category.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all flex-1 lg:flex-none"
                            >
                                {sortOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <div className="flex gap-2 border-2 border-gray-200 rounded-xl p-1 bg-white">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === "grid"
                                            ? "bg-orange-500 text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === "list"
                                            ? "bg-orange-500 text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid/List */}
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "space-y-4"
                        }
                    >
                        {filteredProducts.map((product, idx) => (
                            <div
                                key={product.id}
                                style={{ animationDelay: `${idx * 50}ms` }}
                                className={`bg-white rounded-2xl overflow-hidden shadow-sm group border-2 border-gray-100 ${
                                    viewMode === "list" ? "flex gap-6" : ""
                                }`}
                            >
                                <div
                                    className={`relative overflow-hidden ${
                                        viewMode === "list" ? "w-48" : ""
                                    }`}
                                >
                                    <img
                                        src={product.images?.[0]}
                                        alt={product.name}
                                        className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                                            viewMode === "list"
                                                ? "w-48 h-full"
                                                : "w-full h-64"
                                        }`}
                                    />
                                    {product.discount && (
                                        <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                            -{product.discount}% OFF
                                        </span>
                                    )}
                                    {!product.inStock && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                            <span className="bg-white px-6 py-3 rounded-xl font-bold text-gray-900 shadow-xl">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() =>
                                            handleWishlistToggle(product)
                                        }
                                        className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
                                    >
                                        <Heart
                                            className={`w-5 h-5 transition-all ${
                                                isInWishlist(product.id)
                                                    ? "fill-red-500 text-red-500 scale-110"
                                                    : "text-gray-600"
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div
                                    className={`p-5 ${
                                        viewMode === "list" ? "flex-1" : ""
                                    }`}
                                >
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            {renderStars(product.rating)}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {product.rating}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ({product.reviews?.length || 0}{" "}
                                            reviews)
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <Flame className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm font-medium text-gray-700">
                                            {Math.floor(
                                                (product.stockQuantity || 0) *
                                                    0.3
                                            )}{" "}
                                            sold recently
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-3xl font-bold text-orange-600">
                                                Rs.
                                                {product.price.toLocaleString()}
                                            </p>
                                            {product.discount && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    Rs.
                                                    {Math.round(
                                                        product.price /
                                                            (1 -
                                                                product.discount /
                                                                    100)
                                                    ).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                        <span
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                                product.inStock
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {product.inStock
                                                ? "✓ Available"
                                                : "✗ Sold Out"}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <button
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                            disabled={!product.inStock}
                                            className={`w-full py-3 rounded-xl font-bold transition-all transform ${
                                                product.inStock
                                                    ? "bg-gray-900 text-white hover:bg-gray-700 hover:scale-105"
                                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <ShoppingCart className="w-5 h-5" />
                                                {product.inStock
                                                    ? "Add to Cart"
                                                    : "Out of Stock"}
                                            </div>
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleBuyNow(product)
                                            }
                                            disabled={!product.inStock}
                                            className={`w-full py-3 rounded-xl font-bold transition-all transform ${
                                                product.inStock
                                                    ? "bg-orange-500 text-white hover:bg-orange-600 hover:scale-105"
                                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20 animate-in fade-in duration-500">
                            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-xl font-medium mb-2">
                                No products found
                            </p>
                            <p className="text-gray-400">
                                Try adjusting your filters or search terms
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllProductsPage;