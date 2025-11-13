import React from "react";
import { Heart, Share2, Trash2, Star, ShoppingCart } from "lucide-react";
import Navbar from "@/ContentWrapper/Navbar";
import { useWishlist } from "../../contexts/WishlistContext";
import { useCart } from "../../contexts/CartContext";
import { Link } from "@inertiajs/react";
import Footer from "@/ContentWrapper/Footer";

const WishlistPage = () => {
    const {
        wishlist,
        removeFromWishlist,
        clearWishlist,
        getWishlistTotalValue,
        getInStockCount,
    } = useWishlist();

    const { addToCart } = useCart();

    const handleClearWishlist = () => {
        if (
            window.confirm(
                "Are you sure you want to clear your entire wishlist?"
            )
        ) {
            clearWishlist();
        }
    };

    const handleAddToCart = (item) => {
        // Create a cart-ready product object
        const cartProduct = {
            id: item.id,
            name: item.name,
            price: item.price,
            images: [item.image],
            slug: item.slug || `product-${item.id}`,
        };

        addToCart(cartProduct);
    };

    const handleRemoveItem = (itemId) => {
        removeFromWishlist(itemId);
    };

    const totalValue = getWishlistTotalValue();
    const inStockCount = getInStockCount();

    return (
        <>
            <Navbar />
            <div className="">
                <div
                    className="relative h-96 overflow-hidden bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
                    }}
                >
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-wide">
                            Our Products
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 mb-6">
                            Discover premium quality products crafted with
                            excellence
                        </p>
                    </div>
                </div>

                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                                <h1 className="text-3xl font-bold text-gray-900">
                                    My Wishlist
                                </h1>
                                <span className="text-lg text-gray-500">
                                    ({wishlist.totalItems}{" "}
                                    {wishlist.totalItems === 1
                                        ? "item"
                                        : "items"}
                                    )
                                </span>
                            </div>
                            <div className="flex gap-3">
                                {wishlist.items.length > 0 && (
                                    <button
                                        onClick={handleClearWishlist}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {/* Stats */}
                    {wishlist.items.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <p className="text-sm text-gray-600 mb-1">
                                    Total Items
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {wishlist.totalItems}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <p className="text-sm text-gray-600 mb-1">
                                    Total Value
                                </p>
                                <p className="text-3xl font-bold text-purple-600">
                                    Rs.{totalValue.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <p className="text-sm text-gray-600 mb-1">
                                    In Stock
                                </p>
                                <p className="text-3xl font-bold text-green-600">
                                    {inStockCount}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Wishlist Items */}
                    {wishlist.items.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Your wishlist is empty
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Start adding items you love to keep track of
                                them!
                            </p>
                            <Link
                                href={"/"}
                                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {wishlist.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="relative">
                                        <img
                                            src={`storage/${item.images}`}
                                            alt={item.name}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <button
                                            onClick={() =>
                                                handleRemoveItem(item.id)
                                            }
                                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </button>
                                        {!item.inStock && (
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                                                Out of Stock
                                            </div>
                                        )}
                                        {item.inStock !== false && (
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                                                In Stock
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-sm font-semibold text-gray-700 ml-1">
                                                    {item.rating || 4.5}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                Added{" "}
                                                {new Date(
                                                    item.addedDate
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-2xl font-bold text-purple-600">
                                                Rs.{item.price.toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    handleAddToCart(item)
                                                }
                                                disabled={
                                                    item.inStock === false
                                                }
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                                    item.inStock !== false
                                                        ? "bg-purple-500 text-white hover:bg-purple-600"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default WishlistPage;
