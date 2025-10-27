import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Eye,
    ExternalLink,
    ShoppingCart,
} from "lucide-react";
import ProductsPopup from "./ProductsPopup";
import productsData from "../../JsonData/Products.json";
import { Link } from "@inertiajs/react";

const PopularProducts = () => {
    const [activeTab, setActiveTab] = useState("Fashion");
    const [showDetails, setShowDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const products = productsData?.products || {};
    const activeProducts = products[activeTab] || [];

    const scroll = (direction) => {
        const container = document.getElementById("products-container");
        if (!container) return;
        // Dynamically calculate card width
        const card = container.firstElementChild;
        const cardWidth = card ? card.offsetWidth + 24 : 320; // 24px gap
        container.scrollBy({
            left: direction === "left" ? -cardWidth : cardWidth,
            behavior: "smooth",
        });
    };

    const handleShowDetails = (product) => {
        setSelectedProduct(product);
        setShowDetails(true);
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

    // Ensure Tailwind line-clamp works (requires plugin)
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-4xl font-semibold text-center mb-8 text-gray-900">
                Popular Products
            </h2>

            <div className="flex justify-center gap-8 mb-10">
                {["Fashion", "Accessories", "Apparel"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-lg font-medium pb-2 transition-all ${
                            activeTab === tab
                                ? "text-gray-900 border-b-2 border-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="relative">
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                <div
                    id="products-container"
                    className="flex gap-6 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {activeProducts.length > 0 ? (
                        activeProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex-shrink-0 w-72 bg-gray-50 rounded-lg overflow-hidden group relative"
                            >
                                {/* Navigate to product page on card click */}
                                <Link
                                    href={`/products/${product.slug}`}
                                    method="get"
                                    className="block"
                                >
                                    <div className="relative bg-white h-72 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {product.discount && (
                                            <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-semibold">
                                                -{product.discount}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col items-center">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2 h-10 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="mb-2">
                                            {renderStars(product.rating)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-semibold text-gray-900">
                                                ${product.price}
                                            </span>
                                            {product.priceMax && (
                                                <>
                                                    <span className="text-gray-400">–</span>
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        ${product.priceMax}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Link>

                                {/* Overlay actions */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                        aria-label="Add to wishlist"
                                    >
                                        <Heart className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <button
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
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
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                        aria-label="View details"
                                    >
                                        <Eye className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <button
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                        aria-label="View on external site"
                                    >
                                        <ExternalLink className="w-4 h-4 text-gray-700" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 col-span-full">
                            No products available in this category.
                        </div>
                    )}
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            {showDetails && selectedProduct && (
                <ProductsPopup
                    product={selectedProduct}
                    showDetails={showDetails}
                    setShowDetails={setShowDetails}
                />
            )}
        </div>
    );
};

export default PopularProducts;