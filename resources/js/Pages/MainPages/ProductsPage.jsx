import React, { useState, useEffect } from "react";
import {
    Star,
    Flame,
    Minus,
    Plus,
    Heart,
    MessageCircle,
    Share2,
    CheckCircle,
    Truck,
    Shield,
    BarChart2,
    Check,
    DollarSign,
    ShoppingCart,
} from "lucide-react";
import productsData from "../../../JsonData/Products.json";
import Navbar from "@/ContentWrapper/Navbar";
import Footer from "@/ContentWrapper/Footer";
import { useCart } from '../../Contexts/CartContext'; 
import { useWishlist } from '../../Contexts/WishlistContext'; // Import the useWishlist hook

const ProductsPage = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState("description");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Use the cart context
    const { addToCart } = useCart();
    
    // Use the wishlist context
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const loadProduct = () => {
            setLoading(true);
            
            // Get slug from URL path
            const pathParts = window.location.pathname.split('/');
            const slug = pathParts[pathParts.length - 1];
            
            if (!slug) {
                setProduct(null);
                setLoading(false);
                return;
            }
            
            let foundProduct = null;
            const categories = Object.keys(productsData.products || {});
            
            for (const category of categories) {
                const categoryProducts = productsData.products[category];
                foundProduct = categoryProducts.find(p => p.slug === slug);
                if (foundProduct) break;
            }
            
            setProduct(foundProduct);
            setLoading(false);
        };

        loadProduct();
    }, []);

    const handleAddToCart = () => {
        if (!product || !product.inStock) return;
        
        // Create a cart-ready product object
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            slug: product.slug
        };
        
        // Add the product to cart with the selected quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(cartProduct);
        }
        
        // Optional: Show feedback (you can add a toast notification here)
        console.log(`Added ${quantity} ${product.name} to cart`);
    };

    const handleWishlistToggle = () => {
        if (!product) return;
        
        const wishlistProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            slug: product.slug,
            rating: product.rating,
            inStock: product.inStock
        };

        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
            console.log(`Removed ${product.name} from wishlist`);
        } else {
            addToWishlist(wishlistProduct);
            console.log(`Added ${product.name} to wishlist`);
        }
    };

    const handleBuyNow = () => {
        handleAddToCart(); // Add to cart first
        // Then redirect to checkout page
        window.location.href = '/check-out';
    };

    // Early return if product not found
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-gray-500 text-lg">Loading product...</div>
                </div>
            </div>
        );
    }

    const images = product.images || [];
    const sizes = product.sizes || [];
    const colors = product.colors || [];
    const features = product.features || [];
    const reviews = product.reviews || [];

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    };

    const renderStars = (rating) => {
        const safeRating = rating || 0;
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 md:w-5 md:h-5 ${
                    i < safeRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    return (
        <div>
            <Navbar />
            <div className="">
                <div className="relative h-[550px] overflow-hidden">
                    <img
                        src="https://images.pexels.com/photos/34391717/pexels-photo-34391717.jpeg"
                        alt="Products hero image"
                        className="w-full h-full object-cover"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                            Our Products
                        </h1>
                        <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">
                            Discover premium quality products crafted with excellence
                        </p>
                    </div>
                </div>
                
                {/* Product Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Side - Product Images */}
                        <div className="flex flex-col gap-6 sticky top-20 self-start">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Thumbnail Column */}
                                <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
                                    <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImage(idx)}
                                                className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                    selectedImage === idx
                                                        ? "border-blue-500 ring-2 ring-blue-200"
                                                        : "border-transparent hover:border-gray-300"
                                                }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Image */}
                                <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden relative order-1 lg:order-2">
                                    {product.discount && (
                                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded-full z-10">
                                            -{product.discount}%
                                        </div>
                                    )}
                                    <div className="aspect-square flex items-center justify-center p-8">
                                        <img
                                            src={images[selectedImage] || "/placeholder-image.jpg"}
                                            alt={product.name || "Product Image"}
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Features Bar */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="flex items-center justify-center gap-3 py-4 px-4">
                                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <span className="font-semibold text-gray-900 text-sm text-center">
                                        100% Original
                                    </span>
                                </div>
                                <div className="flex items-center justify-center gap-3 py-4 px-4">
                                    <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <span className="font-semibold text-gray-900 text-sm text-center">
                                        Lowest Price
                                    </span>
                                </div>
                                <div className="flex items-center justify-center gap-3 py-4 px-4">
                                    <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <span className="font-semibold text-gray-900 text-sm text-center">
                                        {product.freeShipping ? "Free Shipping" : "Fast Shipping"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Product Details */}
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <div className="text-sm text-gray-600 mb-2">
                                    Brand:{" "}
                                    <span className="font-semibold text-gray-900">
                                        {product.brand || "Unknown Brand"}
                                    </span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                                    {product.name || "Product Name"}
                                </h1>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        {product.discount && (
                                            <span className="text-gray-400 line-through text-lg">
                                                $
                                                {(
                                                    product.price /
                                                    (1 - product.discount / 100)
                                                ).toFixed(0)}
                                            </span>
                                        )}
                                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            Rs.{product.price || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {renderStars(product.rating)}
                                        <span className="text-sm text-gray-600">
                                            ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <Flame className="w-4 h-4 text-red-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {Math.floor((product.stockQuantity || 0) * 0.3)} products sold in last 4 hours
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {product.shortDescription || "No description available."}
                            </p>

                            {/* Size Selection */}
                            {sizes.length > 0 && (
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                        Size {selectedSize && `• ${selectedSize}`}
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2.5 border rounded-xl text-sm font-medium transition-all duration-200 ${
                                                    selectedSize === size
                                                        ? "border-gray-900 bg-gray-900 text-white shadow-md"
                                                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selection */}
                            {colors.length > 0 && (
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                        Color {selectedColor && `• ${selectedColor}`}
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2.5 border rounded-xl text-sm font-medium transition-all duration-200 ${
                                                    selectedColor === color
                                                        ? "border-gray-900 bg-gray-900 text-white shadow-md"
                                                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                                }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div>
                                <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                        product.inStock
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                    }`}
                                >
                                    {product.inStock
                                        ? `✓ ${product.stockQuantity || 0} in stock`
                                        : "✗ Out of stock"}
                                </span>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex items-center border border-gray-300 rounded-xl self-start overflow-hidden">
                                        <button
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="px-4 py-3 hover:bg-gray-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            readOnly
                                            className="w-16 text-center border-x border-gray-300 py-3 bg-white font-medium"
                                        />
                                        <button
                                            onClick={incrementQuantity}
                                            className="px-4 py-3 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                                        disabled={!product.inStock}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        ADD TO CART
                                    </button>
                                </div>

                                <button
                                    onClick={handleBuyNow}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                    disabled={!product.inStock}
                                >
                                    BUY NOW
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 pt-2">
                                {[
                                    { icon: BarChart2, label: "COMPARE" },
                                    { 
                                        icon: Heart, 
                                        label: "WISHLIST",
                                        isWishlist: true,
                                        isActive: isInWishlist(product.id)
                                    },
                                    { icon: MessageCircle, label: "ASK US" },
                                    { icon: Share2, label: "SHARE" },
                                ].map(({ icon: Icon, label, isWishlist, isActive }) => (
                                    <button
                                        key={label}
                                        onClick={isWishlist ? handleWishlistToggle : undefined}
                                        className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                                            isWishlist && isActive
                                                ? "text-pink-600 hover:text-pink-700"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <Icon 
                                            size={18} 
                                            fill={isWishlist && isActive ? "currentColor" : "none"}
                                        />
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Delivery Info */}
                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <Check size={18} className="text-green-600 flex-shrink-0" />
                                    <span>
                                        <span className="font-semibold">Estimated Delivery:</span>{" "}
                                        {product.estimatedDelivery || "Not specified"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <Check size={18} className="text-green-600 flex-shrink-0" />
                                    <span>
                                        <span className="font-semibold">Free Shipping & Returns:</span>{" "}
                                        {product.freeShipping ? "Free shipping available" : "Shipping costs apply"} •{" "}
                                        {product.returns || "Standard returns"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="mt-12 bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200">
                            <div className="flex gap-8 px-6 overflow-x-auto">
                                {[
                                    { id: "description", label: "Description" },
                                    { id: "additional", label: "Additional Info" },
                                    { id: "reviews", label: `Reviews (${reviews.length})` },
                                    { id: "shipping", label: "Shipping & Return" },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-5 px-2 font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                                            activeTab === tab.id
                                                ? "border-blue-600 text-blue-600"
                                                : "border-transparent text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 lg:p-8">
                            {activeTab === "description" && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            About this item
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed">
                                            {product.longDescription || product.shortDescription || "No description available."}
                                        </p>
                                    </div>

                                    {features.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                                Product Features
                                            </h3>
                                            <div className="bg-gray-50 p-6 rounded-xl">
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {features.map((feature, index) => (
                                                        <li key={index} className="flex items-center gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                            <span className="text-gray-700">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                            Product Details
                                        </h3>
                                        <div className="overflow-hidden rounded-xl border border-gray-200">
                                            <table className="w-full">
                                                <tbody>
                                                    {[
                                                        ["Brand", product.brand],
                                                        ["Category", product.category],
                                                        ["SKU", product.sku],
                                                        ["In Stock", product.inStock ? "Yes" : "No"],
                                                        ["Stock Quantity", product.stockQuantity],
                                                        ["Available Sizes", sizes.join(", ") || "One Size"],
                                                        ["Available Colors", colors.join(", ") || "Multiple"],
                                                    ].map(([key, value], idx) => (
                                                        <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                                                            <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-900 w-1/3">
                                                                {key}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-700">
                                                                {value || "N/A"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "additional" && (
                                <div className="text-gray-600 space-y-6">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Additional Information
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Features
                                            </h4>
                                            <ul className="list-disc list-inside space-y-2">
                                                {features.map((feature, index) => (
                                                    <li key={index} className="text-gray-700">
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Specifications
                                            </h4>
                                            <p className="text-gray-600">
                                                All specifications are based on manufacturer data and may vary.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Customer Reviews ({reviews.length})
                                    </h3>

                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-900">
                                                {(product.rating || 0).toFixed(1)}
                                            </div>
                                            <div className="flex justify-center mt-2">
                                                {renderStars(product.rating)}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {reviews.length > 0 ? (
                                            reviews.map((review, index) => (
                                                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="font-semibold text-white text-sm">
                                                                {review.user?.charAt(0) || "U"}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">
                                                                {review.user || "Anonymous User"}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {renderStars(review.rating)}
                                                                <span className="text-sm text-gray-500">
                                                                    {review.date
                                                                        ? new Date(review.date).toLocaleDateString()
                                                                        : "Unknown date"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {review.comment || "No comment provided."}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                No reviews yet. Be the first to review this product!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "shipping" && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Shipping & Return Policy
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                                                Shipping Information
                                            </h4>
                                            <div className="space-y-3 text-gray-600">
                                                <p>
                                                    <strong>Estimated Delivery:</strong>{" "}
                                                    {product.estimatedDelivery || "Not specified"}
                                                </p>
                                                <p>
                                                    <strong>Free Shipping:</strong>{" "}
                                                    {product.freeShipping ? "Yes" : "No"}
                                                </p>
                                                <p>
                                                    <strong>Processing Time:</strong> 1-2 business days
                                                </p>
                                                <p>
                                                    <strong>International Shipping:</strong> Available to most countries
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                                                Return Policy
                                            </h4>
                                            <div className="space-y-3 text-gray-600">
                                                <p>
                                                    <strong>Returns:</strong>{" "}
                                                    {product.returns || "Standard 30-day return policy"}
                                                </p>
                                                <p>
                                                    <strong>Condition:</strong> Items must be in original condition with tags attached
                                                </p>
                                                <p>
                                                    <strong>Process:</strong> Contact customer service within 30 days of delivery
                                                </p>
                                                <p>
                                                    <strong>Refund Time:</strong> 5-10 business days after receipt
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default ProductsPage;