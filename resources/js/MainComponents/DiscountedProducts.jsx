import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Eye,
    ShoppingCart,
    ExternalLink,
} from "lucide-react";
import productsData from "../../JsonData/Products.json";
import ProductsPopup from "./ProductsPopup";
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext'; // Import the useWishlist hook

const DiscountedProducts = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    // Use the cart context
    const { addToCart } = useCart();
    
    // Use the wishlist context
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    // Flatten all products and filter only those with discounts
    const discountedProducts = Object.values(productsData.products)
        .flat()
        .filter((product) => product.discount !== null && product.discount > 0);

    const scroll = (direction) => {
        const container = document.getElementById(
            "discounted-products-container"
        );
        if (!container) return;
        const scrollAmount = 320;
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Create a cart-ready product object
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            slug: product.slug
        };
        
        addToCart(cartProduct);
        
        // Optional: Show feedback (you can add a toast notification here)
        console.log(`Added ${product.name} to cart`);
    };

    const handleWishlistToggle = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const wishlistProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            slug: product.slug,
            rating: product.rating,
            inStock: true // You can modify this based on your product data
        };

        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
            console.log(`Removed ${product.name} from wishlist`);
        } else {
            addToWishlist(wishlistProduct);
            console.log(`Added ${product.name} to wishlist`);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${
                            i < rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    const handleShowDetails = (product) => {
        setSelectedProduct(product);
        setShowDetails(true);
    };

    return (
        <div className="w-full bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Special Discounted Products
                    </h1>
                    <p className="text-gray-600">
                        Exclusive deals on premium products - Limited time
                        offers
                    </p>
                </div>

                {/* Products Carousel */}
                <div className="relative">
                    {/* Left Arrow - Only show if there are discounted products */}
                    {discountedProducts.length > 0 && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                    )}

                    {/* Scrollable Container */}
                    <div
                        id="discounted-products-container"
                        className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        {discountedProducts.length > 0 ? (
                            discountedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex-shrink-0 w-72 bg-gray-50 rounded-lg overflow-hidden group relative"
                                >
                                    {/* Product Card */}
                                    <div className="block">
                                        {/* Image Container */}
                                        <div className="relative bg-white h-72 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            {/* Discount Badge */}
                                            {product.discount && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">
                                                    -{product.discount}%
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4 items-center justify-center flex flex-col">
                                            <h3 className="text-sm font-medium text-gray-900 mb-2 h-10 line-clamp-2">
                                                {product.name}
                                            </h3>

                                            {/* Rating */}
                                            <div className="mb-2">
                                                {renderStars(product.rating)}
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center gap-2">
                                                <span className="line-through text-gray-400 text-sm">
                                                    Rs.
                                                    {product.originalPrice ||
                                                        product.priceMax ||
                                                        product.price}
                                                </span>
                                                <span className="text-lg font-semibold text-red-600">
                                                    Rs.{product.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Icons */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleWishlistToggle(product, e)}
                                            className={`p-2 rounded-full shadow-md hover:bg-red-50 transition-colors ${
                                                isInWishlist(product.id) 
                                                    ? "bg-pink-50 text-pink-500" 
                                                    : "bg-white text-gray-700"
                                            }`}
                                            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                        >
                                            <Heart 
                                                className="w-4 h-4" 
                                                fill={isInWishlist(product.id) ? "currentColor" : "none"}
                                            />
                                        </button>
                                        <button
                                            onClick={(e) => handleAddToCart(product, e)}
                                            className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                                            aria-label="Add to cart"
                                        >
                                            <ShoppingCart className="w-4 h-4 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleShowDetails(product);
                                            }}
                                            className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                                            aria-label="View details"
                                        >
                                            <Eye className="w-4 h-4 text-gray-700" />
                                        </button>
                                        <button
                                            className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                                            aria-label="View on external site"
                                        >
                                            <ExternalLink className="w-4 h-4 text-gray-700" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 col-span-full py-12">
                                No discounted products available at the moment.
                            </div>
                        )}
                    </div>

                    {/* Right Arrow - Only show if there are discounted products */}
                    {discountedProducts.length > 0 && (
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>
                    )}
                </div>

                {/* Products Popup */}
                {showDetails && selectedProduct && (
                    <ProductsPopup
                        product={selectedProduct}
                        showDetails={showDetails}
                        setShowDetails={setShowDetails}
                    />
                )}

                <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .line-clamp-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default DiscountedProducts;