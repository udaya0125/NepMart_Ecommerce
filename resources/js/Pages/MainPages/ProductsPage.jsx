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
import Navbar from "@/ContentWrapper/Navbar";
import Footer from "@/ContentWrapper/Footer";
import { useCart } from "../../Contexts/CartContext";
import { useWishlist } from "../../Contexts/WishlistContext";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import parse from "html-react-parser";

const ProductsPage = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState("description");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: "",
        user_name: "",
        email: "",
    });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

    // Use the cart context
    const { addToCart } = useCart();

    // Use the wishlist context
    const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemId } = useWishlist();

    // Get the current route parameters
    const { props } = usePage();
    const slug = window.location.pathname.split("/").pop();

    // Show notification message
    const showNotificationMessage = (message, type = "success") => {
        setNotification({ show: true, message, type });
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "success" });
        }, 3000);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!slug) {
                    setError("Product not found");
                    setLoading(false);
                    return;
                }

                console.log("Fetching product with slug:", slug);

                // Fetch all products and find the one with matching slug
                const response = await axios.get(route("ourproducts.index"));
                console.log("Products response:", response.data);

                const allProducts = response.data.data || response.data;

                // Find product by slug
                const foundProduct = allProducts.find((p) => p.slug === slug);

                if (!foundProduct) {
                    setError("Product not found");
                    setProduct(null);
                } else {
                    setProduct(foundProduct);
                }
            } catch (err) {
                console.error("Fetching error:", err);
                setError("Failed to load product. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

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
            stock_quantity: product.stock_quantity || 0,
            selectedSize: selectedSize,
            selectedColor: selectedColor,
            size: selectedSize,
            color: selectedColor,
            // Create a unique identifier for cart items with variants
            variantId: `${product.id}-${selectedSize}-${selectedColor}`
        };
    };

    const handleAddToCart = async () => {
        if (!product) return;
        
        // Check if product is in stock
        const isInStock = product.in_stock !== false && (product.stock_quantity > 0 || product.in_stock === true);
        if (!isInStock) {
            showNotificationMessage(`${product.name} is out of stock!`, "error");
            return;
        }

        try {
            // Prepare the product data with all required fields
            const cartProduct = prepareProductData(product);
            
            // Add the product to cart with the selected quantity
            await addToCart(cartProduct, quantity);
            
            console.log(`Added ${quantity} ${product.name} to cart`, {
                size: selectedSize,
                color: selectedColor
            });
            
            showNotificationMessage(`${product.name} added to cart!`);
            
        } catch (error) {
            console.error('Failed to add to cart:', error);
            showNotificationMessage('Failed to add item to cart. Please try again.', "error");
        }
    };

    const handleBuyNow = async () => {
        if (!product) return;
        
        // Check if product is in stock
        const isInStock = product.in_stock !== false && (product.stock_quantity > 0 || product.in_stock === true);
        if (!isInStock) {
            showNotificationMessage(`${product.name} is out of stock!`, "error");
            return;
        }

        try {
            // Prepare the product data with all required fields
            const cartProduct = prepareProductData(product);
            
            // Add to cart first
            await addToCart(cartProduct, quantity);
            
            console.log(`Successfully added ${quantity} ${product.name} to cart, redirecting to checkout`);
            
            // Show success message
            showNotificationMessage(`${product.name} added to cart! Redirecting to checkout...`);
            
            // Then redirect to checkout after a brief delay
            setTimeout(() => {
                window.location.href = "/check-out";
            }, 1000);
            
        } catch (error) {
            console.error('Failed to add to cart for Buy Now:', error);
            showNotificationMessage('Failed to proceed with Buy Now. Please try again.', "error");
        }
    };

    const handleWishlistToggle = async () => {
        if (!product) return;
        
        try {
            const wishlistProduct = prepareProductData(product);

            if (isInWishlist(product.id)) {
                const wishlistItemId = getWishlistItemId(product.id);
                console.log('Removing from wishlist - Product ID:', product.id, 'Wishlist Item ID:', wishlistItemId);
                
                if (wishlistItemId) {
                    await removeFromWishlist(wishlistItemId);
                    console.log(`Removed ${product.name} from wishlist`);
                    showNotificationMessage(`${product.name} removed from wishlist`, "info");
                } else {
                    console.error('Could not find wishlist item ID for product:', product.id);
                    showNotificationMessage('Failed to remove from wishlist', "error");
                }
            } else {
                await addToWishlist(wishlistProduct);
                console.log(`Added ${product.name} to wishlist`);
                showNotificationMessage(`${product.name} added to wishlist!`);
            }
        } catch (error) {
            console.error('Failed to toggle wishlist:', error);
            showNotificationMessage(`Failed to update wishlist: ${error.message}`, "error");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!isReviewFormValid()) {
            alert("Please fill in all required fields");
            return;
        }

        if (!product) {
            alert("Product not found");
            return;
        }

        setReviewSubmitting(true);

        try {
            // Send review to backend using the correct endpoint
            const response = await axios.post(
                `/ourproducts/${product.id}/reviews`,
                {
                    user_name: newReview.user_name,
                    email: newReview.email,
                    rating: newReview.rating,
                    comment: newReview.comment,
                    // user_id can be added here if you have authenticated users
                }
            );

            if (response.data.status) {
                // Review submitted successfully
                setReviewSuccess(true);

                // Reset form
                setNewReview({
                    rating: 0,
                    comment: "",
                    user_name: "",
                    email: "",
                });

                // Refresh product data to show the new review
                const updatedResponse = await axios.get(
                    route("ourproducts.index")
                );
                const allProducts =
                    updatedResponse.data.data || updatedResponse.data;
                const updatedProduct = allProducts.find(
                    (p) => p.id === product.id
                );

                if (updatedProduct) {
                    setProduct(updatedProduct);
                }

                setTimeout(() => setReviewSuccess(false), 5000);
            } else {
                alert(
                    "Failed to submit review: " +
                        (response.data.message || "Unknown error")
                );
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            if (error.response && error.response.data.errors) {
                const errors = Object.values(error.response.data.errors)
                    .flat()
                    .join(", ");
                alert("Failed to submit review: " + errors);
            } else {
                alert("Failed to submit review. Please try again.");
            }
        } finally {
            setReviewSubmitting(false);
        }
    };

    const isReviewFormValid = () => {
        return (
            newReview.rating > 0 &&
            newReview.comment.trim() !== "" &&
            newReview.user_name.trim() !== "" &&
            newReview.email.trim() !== ""
        );
    };

    // Parse string fields to arrays
    const parseStringToArray = (str) => {
        if (!str) return [];
        try {
            if (Array.isArray(str)) return str;
            return str
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item);
        } catch (error) {
            console.error("Error parsing string to array:", error);
            return [];
        }
    };

    // Parse HTML content with html-react-parser
    const parseHTMLContent = (content) => {
        if (!content) return "No description available.";
        try {
            return parse(content);
        } catch (error) {
            console.error("Error parsing HTML content:", error);
            return content;
        }
    };

    // Parse features array with HTML content
    const parseFeatures = (featuresArray) => {
        if (!featuresArray || !Array.isArray(featuresArray)) return [];

        return featuresArray.map((feature) => {
            try {
                return {
                    raw: feature,
                    parsed: parseHTMLContent(feature),
                };
            } catch (error) {
                console.error("Error parsing feature:", error);
                return {
                    raw: feature,
                    parsed: feature,
                };
            }
        });
    };

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
                    i < Math.floor(safeRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    // Notification styles based on type
    const getNotificationStyles = () => {
        const baseStyles = "fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 transform";
        
        switch (notification.type) {
            case "success":
                return `${baseStyles} bg-green-500 text-white`;
            case "error":
                return `${baseStyles} bg-red-500 text-white`;
            case "info":
                return `${baseStyles} bg-blue-500 text-white`;
            default:
                return `${baseStyles} bg-gray-500 text-white`;
        }
    };

    // Early return if loading or error
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-gray-500 text-lg">
                        Loading product...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-500 text-lg">
                        Product not found
                    </div>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mt-4"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Prepare data from API response
    const images = product.images
        ? product.images.map((img) => `/storage/${img.image_path}`)
        : [];
    const sizes = parseStringToArray(product.sizes);
    const colors = parseStringToArray(product.colors);
    const features = parseFeatures(parseStringToArray(product.features));
    const reviews = product.reviews || [];

    // Calculate average rating
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) /
              reviews.length
            : 0;

    // Check stock status
    const isInStock = product.in_stock !== false && (product.stock_quantity > 0 || product.in_stock === true);

    return (
        <div>
            {/* Notification */}
            {notification.show && (
                <div className={getNotificationStyles()}>
                    <div className="flex items-center">
                        <span className="flex-1">{notification.message}</span>
                        <button 
                            onClick={() => setNotification({ show: false, message: "", type: "success" })}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <Navbar />
            <div className="">
                <div className="relative h-[550px] overflow-hidden">
                    <img
                        src="hero.png"
                        alt="Products hero image"
                        className="w-full h-full object-cover"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/60"></div>

                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                            Our Products
                        </h1>
                        <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">
                            Discover premium quality products crafted with
                            excellence
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
                                                onClick={() =>
                                                    setSelectedImage(idx)
                                                }
                                                className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                    selectedImage === idx
                                                        ? "border-blue-500 ring-2 ring-blue-200"
                                                        : "border-transparent hover:border-gray-300"
                                                }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${
                                                        product.name
                                                    } thumbnail ${idx + 1}`}
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
                                    {!isInStock && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                                            <span className="text-white font-bold text-2xl bg-red-600 px-4 py-2 rounded-lg">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                    <div className="aspect-square flex items-center justify-center p-8">
                                        <img
                                            src={
                                                images[selectedImage] ||
                                                "/placeholder-image.jpg"
                                            }
                                            alt={product.name}
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
                                        {product.free_shipping
                                            ? "Free Shipping"
                                            : "Fast Shipping"}
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
                                    {product.name}
                                </h1>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        {product.discount > 0 && (
                                            <span className="text-gray-400 line-through text-lg">
                                                Rs.{product.price}
                                            </span>
                                        )}
                                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            Rs.
                                            {product.discounted_price ||
                                                product.price}
                                        </span>
                                        {product.discount > 0 && (
                                            <span className="text-red-600 font-semibold text-sm bg-red-50 px-2 py-1 rounded">
                                                Save {product.discount}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {renderStars(averageRating)}
                                        <span className="text-sm text-gray-600">
                                            ({reviews.length} review
                                            {reviews.length !== 1 ? "s" : ""})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <Flame className="w-4 h-4 text-red-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {Math.floor(
                                            (product.stock_quantity || 0) * 0.3
                                        )}{" "}
                                        products sold in last 4 hours
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {product.short_description ||
                                    "No description available."}
                            </p>

                            {/* Size Selection */}
                            {sizes.length > 0 && (
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                        Size{" "}
                                        {selectedSize && `• ${selectedSize}`}
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() =>
                                                    setSelectedSize(size)
                                                }
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
                                        Color{" "}
                                        {selectedColor && `• ${selectedColor}`}
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() =>
                                                    setSelectedColor(color)
                                                }
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
                                        isInStock
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                    }`}
                                >
                                    {isInStock
                                        ? `✓ ${
                                              product.stock_quantity || 0
                                          } in stock`
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
                                        disabled={!isInStock}
                                        className="flex-1 bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        ADD TO CART
                                    </button>
                                </div>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={!isInStock}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
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
                                        isActive: isInWishlist(product.id),
                                    },
                                    { icon: MessageCircle, label: "ASK US" },
                                    { icon: Share2, label: "SHARE" },
                                ].map(
                                    ({
                                        icon: Icon,
                                        label,
                                        isWishlist,
                                        isActive,
                                    }) => (
                                        <button
                                            key={label}
                                            onClick={
                                                isWishlist
                                                    ? handleWishlistToggle
                                                    : undefined
                                            }
                                            className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                                                isWishlist && isActive
                                                    ? "text-pink-600 hover:text-pink-700"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            <Icon
                                                size={18}
                                                fill={
                                                    isWishlist && isActive
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />
                                            {label}
                                        </button>
                                    )
                                )}
                            </div>

                            {/* Delivery Info */}
                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <Check
                                        size={18}
                                        className="text-green-600 flex-shrink-0"
                                    />
                                    <span>
                                        <span className="font-semibold">
                                            Estimated Delivery:
                                        </span>{" "}
                                        {product.estimated_delivery ||
                                            "Not specified"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <Check
                                        size={18}
                                        className="text-green-600 flex-shrink-0"
                                    />
                                    <span>
                                        <span className="font-semibold">
                                            Free Shipping & Returns:
                                        </span>{" "}
                                        {product.free_shipping
                                            ? "Free shipping available"
                                            : "Shipping costs apply"}{" "}
                                        •{" "}
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
                                    {
                                        id: "additional",
                                        label: "Additional Info",
                                    },
                                    {
                                        id: "reviews",
                                        label: `Reviews (${reviews.length})`,
                                    },
                                    {
                                        id: "shipping",
                                        label: "Shipping & Return",
                                    },
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
                                        <div className="text-gray-600 leading-relaxed prose prose-lg max-w-none">
                                            {parseHTMLContent(
                                                product.long_description ||
                                                    product.short_description
                                            )}
                                        </div>
                                    </div>

                                    {features.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                                Product Features
                                            </h3>

                                            <div className="bg-gray-50 p-6 rounded-xl">
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {features.map(
                                                        (feature, index) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-center gap-3"
                                                            >
                                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                                <span className="text-gray-700">
                                                                    {
                                                                        feature.parsed
                                                                    }
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
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
                                                        [
                                                            "Brand",
                                                            product.brand,
                                                        ],
                                                        [
                                                            "Category",
                                                            product.category
                                                                ?.category,
                                                        ],
                                                        [
                                                            "Sub Category",
                                                            product.sub_category
                                                                ?.sub_category,
                                                        ],
                                                        ["SKU", product.sku],
                                                        [
                                                            "In Stock",
                                                            isInStock
                                                                ? "Yes"
                                                                : "No",
                                                        ],
                                                        [
                                                            "Stock Quantity",
                                                            product.stock_quantity,
                                                        ],
                                                        [
                                                            "Available Sizes",
                                                            sizes.join(", ") ||
                                                                "One Size",
                                                        ],
                                                        [
                                                            "Available Colors",
                                                            colors.join(", ") ||
                                                                "Multiple",
                                                        ],
                                                    ].map(
                                                        ([key, value], idx) => (
                                                            <tr
                                                                key={idx}
                                                                className="border-b border-gray-200 last:border-b-0"
                                                            >
                                                                <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-900 w-1/3">
                                                                    {key}
                                                                </td>
                                                                <td className="px-6 py-4 text-gray-700">
                                                                    {value ||
                                                                        "N/A"}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
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
                                                {features.map(
                                                    (feature, index) => (
                                                        <li
                                                            key={index}
                                                            className="text-gray-700"
                                                        >
                                                            {feature.parsed}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Specifications
                                            </h4>
                                            <p className="text-gray-600">
                                                All specifications are based on
                                                manufacturer data and may vary.
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

                                    {/* Review Summary */}
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-900">
                                                {averageRating.toFixed(1)}
                                            </div>
                                            <div className="flex justify-center mt-2">
                                                {renderStars(averageRating)}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {reviews.length} review
                                                {reviews.length !== 1
                                                    ? "s"
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Success Message */}
                                    {reviewSuccess && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 text-green-800">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="font-medium">
                                                    Thank you for your review!
                                                    It has been submitted
                                                    successfully.
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Review Form */}
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">
                                            Write a Review
                                        </h4>
                                        <form
                                            className="space-y-4"
                                            onSubmit={handleReviewSubmit}
                                        >
                                            {/* Rating Selection */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Your Rating *
                                                </label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                className={`text-2xl focus:outline-none ${
                                                                    star <=
                                                                    (newReview.rating ||
                                                                        0)
                                                                        ? "text-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                                onClick={() =>
                                                                    setNewReview(
                                                                        {
                                                                            ...newReview,
                                                                            rating: star,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                ★
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {newReview.rating
                                                        ? `${newReview.rating} out of 5 stars`
                                                        : "Select a rating"}
                                                </div>
                                            </div>

                                            {/* Review Comment */}
                                            <div>
                                                <label
                                                    htmlFor="reviewComment"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Your Review *
                                                </label>
                                                <textarea
                                                    id="reviewComment"
                                                    rows="4"
                                                    value={newReview.comment}
                                                    onChange={(e) =>
                                                        setNewReview({
                                                            ...newReview,
                                                            comment:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Share your thoughts about this product..."
                                                    required
                                                />
                                            </div>

                                            {/* Reviewer Name */}
                                            <div>
                                                <label
                                                    htmlFor="reviewerName"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Your Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="reviewerName"
                                                    value={newReview.user_name}
                                                    onChange={(e) =>
                                                        setNewReview({
                                                            ...newReview,
                                                            user_name:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter your name"
                                                    required
                                                />
                                            </div>

                                            {/* Reviewer Email */}
                                            <div>
                                                <label
                                                    htmlFor="reviewerEmail"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Your Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="reviewerEmail"
                                                    value={newReview.email}
                                                    onChange={(e) =>
                                                        setNewReview({
                                                            ...newReview,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={
                                                    !isReviewFormValid() ||
                                                    reviewSubmitting
                                                }
                                            >
                                                {reviewSubmitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    "Submit Review"
                                                )}
                                            </button>

                                            <p className="text-sm text-gray-500">
                                                Your review will be published
                                                after approval. Please ensure
                                                your review is honest and
                                                helpful to other customers.
                                            </p>
                                        </form>
                                    </div>

                                    {/* Existing Reviews */}
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-bold text-gray-900">
                                            Customer Reviews ({reviews.length})
                                        </h4>

                                        {reviews.length > 0 ? (
                                            reviews.map((review, index) => (
                                                <div
                                                    key={index}
                                                    className="border-b border-gray-200 pb-6 last:border-b-0"
                                                >
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="font-semibold text-white text-sm">
                                                                {review.user_name?.charAt(
                                                                    0
                                                                ) ||
                                                                    review.user?.name?.charAt(
                                                                        0
                                                                    ) ||
                                                                    "U"}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">
                                                                {review.user_name ||
                                                                    review.user
                                                                        ?.name ||
                                                                    "Anonymous User"}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {renderStars(
                                                                    review.rating
                                                                )}
                                                                <span className="text-sm text-gray-500">
                                                                    {review.created_at
                                                                        ? new Date(
                                                                              review.created_at
                                                                          ).toLocaleDateString()
                                                                        : "Unknown date"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-700 leading-relaxed">
                                                        {review.comment ||
                                                            "No comment provided."}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                No reviews yet. Be the first to
                                                review this product!
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
                                                    <strong>
                                                        Estimated Delivery:
                                                    </strong>{" "}
                                                    {product.estimated_delivery ||
                                                        "Not specified"}
                                                </p>
                                                <p>
                                                    <strong>
                                                        Free Shipping:
                                                    </strong>{" "}
                                                    {product.free_shipping
                                                        ? "Yes"
                                                        : "No"}
                                                </p>
                                                <p>
                                                    <strong>
                                                        Processing Time:
                                                    </strong>{" "}
                                                    1-2 business days
                                                </p>
                                                <p>
                                                    <strong>
                                                        International Shipping:
                                                    </strong>{" "}
                                                    Available to most countries
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
                                                    {product.returns ||
                                                        "Standard 30-day return policy"}
                                                </p>
                                                <p>
                                                    <strong>Condition:</strong>{" "}
                                                    Items must be in original
                                                    condition with tags attached
                                                </p>
                                                <p>
                                                    <strong>Process:</strong>{" "}
                                                    Contact customer service
                                                    within 30 days of delivery
                                                </p>
                                                <p>
                                                    <strong>
                                                        Refund Time:
                                                    </strong>{" "}
                                                    5-10 business days after
                                                    receipt
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
            <Footer />
        </div>
    );
};

export default ProductsPage;