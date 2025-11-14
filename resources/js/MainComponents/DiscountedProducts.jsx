import React, { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Eye,
    ShoppingCart,
    ExternalLink,
} from "lucide-react";
import ProductsPopup from "./ProductsPopup";
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import axios from "axios";

const DiscountedProducts = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    // Use Effect for fetching discounted products
    useEffect(() => {
        const fetchDiscountedProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching discounted products from:", route("ourproducts.index"));
                
                const response = await axios.get(route("ourproducts.index"));
                console.log("Products response:", response.data);
                
                // Extract products from response
                const products = response.data.data || response.data;
                
                // Filter only products with discount
                const discounted = products.filter(product => 
                    product.discount !== null && 
                    product.discount > 0
                );
                
                console.log("Discounted products:", discounted);
                setDiscountedProducts(discounted);
            } catch (err) {
                console.error("Fetching error:", err);
                console.error("Error response:", err.response);
                setError("Failed to load discounted products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDiscountedProducts();
    }, []);

    // Use the cart context
    const { addToCart } = useCart();
    
    // Use the wishlist context
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    // Notification handler
    const showNotificationMessage = (message, type = 'success') => {
        setNotification({
            show: true,
            message,
            type
        });
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, message: '', type: 'success' });
        }, 3000);
    };

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

    // Helper function to prepare product data for cart/wishlist
    const prepareProductData = (product) => {
        const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
        
        return {
            id: product.id,
            name: product.name,
            product_name: product.name,
            price: parseFloat(product.price),
            discounted_price: product.discounted_price ? parseFloat(product.discounted_price) : parseFloat(product.price),
            discount: product.discount || 0,
            images: product.images ? product.images.map(img => img.image_path) : [],
            image: primaryImage ? `/storage/${primaryImage.image_path}` : '/images/placeholder-product.jpg',
            slug: product.slug,
            sku: product.sku || product.product_sku || `SKU-${product.id}`,
            product_sku: product.sku || product.product_sku || `SKU-${product.id}`,
            brand: product.brand || product.product_brand || 'Unknown Brand',
            product_brand: product.brand || product.product_brand || 'Unknown Brand',
            rating: product.rating || 4,
            inStock: product.in_stock !== false && (product.stock_quantity > 0 || product.in_stock === true),
            stock_quantity: product.stock_quantity || 0
        };
    };

    const handleAddToCart = async (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if product is in stock
        const isInStock = product.in_stock !== false && (product.stock_quantity > 0 || product.in_stock === true);
        if (!isInStock) {
            showNotificationMessage(`${product.name} is out of stock!`, 'error');
            return;
        }

        try {
            // Prepare the product data with all required fields
            const cartProduct = prepareProductData(product);
            
            await addToCart(cartProduct, 1);
            
            // Show success notification
            showNotificationMessage(`${product.name} added to cart!`);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            showNotificationMessage('Failed to add product to cart. Please try again.', 'error');
        }
    };

    const handleWishlistToggle = async (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const wishlistProduct = prepareProductData(product);

            if (isInWishlist(product.id)) {
                await removeFromWishlist(product.id);
                showNotificationMessage(`${product.name} removed from wishlist`, 'info');
            } else {
                await addToWishlist(wishlistProduct);
                showNotificationMessage(`${product.name} added to wishlist!`);
            }
        } catch (error) {
            console.error('Failed to toggle wishlist:', error);
            showNotificationMessage('Failed to update wishlist. Please try again.', 'error');
        }
    };

    const renderStars = (rating) => {
        const productRating = rating || 4;
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${
                            i < productRating ? "text-yellow-400" : "text-gray-300"
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

    console.log("Rendering DiscountedProducts with products:", discountedProducts);

    // Get primary image for a product
    const getPrimaryImage = (product) => {
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.is_primary);
            const imagePath = primaryImage
                ? primaryImage.image_path
                : product.images?.[0]?.image_path;

            return `/storage/${imagePath}`;
        }

        // fallback placeholder
        return '/images/placeholder-product.jpg';
    };

    // Notification component styles based on type
    const getNotificationStyles = () => {
        const baseStyles = "fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 transform";
        
        switch (notification.type) {
            case 'success':
                return `${baseStyles} bg-green-500 text-white`;
            case 'error':
                return `${baseStyles} bg-red-500 text-white`;
            case 'info':
                return `${baseStyles} bg-blue-500 text-white`;
            default:
                return `${baseStyles} bg-gray-500 text-white`;
        }
    };

    if (loading) {
        return (
            <div className="w-full bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-pulse">Loading discounted products...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center text-red-500">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white py-16">
            {/* Notification */}
            {notification.show && (
                <div className={getNotificationStyles()}>
                    <div className="flex items-center">
                        <span className="flex-1">{notification.message}</span>
                        <button 
                            onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Special Discounted Products
                    </h1>
                    <p className="text-gray-600">
                        Exclusive deals on premium products - Limited time offers
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
                        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
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
                                                src={getPrimaryImage(product)}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            {/* Discount Badge */}
                                            {product.discount && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">
                                                    -{product.discount}%
                                                </div>
                                            )}

                                            {/* Out of Stock Overlay */}
                                            {!(product.in_stock !== false && (product.stock_quantity > 0 || product.in_stock === true)) && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg bg-red-600 px-3 py-1 rounded">
                                                        Out of Stock
                                                    </span>
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
                                                    Rs. {product.price}
                                                </span>
                                                <span className="text-lg font-semibold text-red-600">
                                                    Rs. {product.discounted_price || product.price}
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
                                            disabled={!(product.in_stock !== false && (product.stock_quantity > 0 || product.in_stock === true))}
                                            className={`p-2 rounded-full shadow-md transition-colors ${
                                                product.in_stock !== false && (product.stock_quantity > 0 || product.in_stock === true)
                                                    ? "bg-white text-gray-700 hover:bg-red-50"
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                            aria-label="Add to cart"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
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