import { X, ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const ProductsPopup = ({ product, showDetails, setShowDetails }) => {
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

    // Use the cart context
    const { addToCart, cart: { isLoading: cartLoading } } = useCart();
    
    // Use the wishlist context
    const { addToWishlist, removeFromWishlist, isInWishlist, wishlist: { isLoading: wishlistLoading } } = useWishlist();
    
    // Use the product's images array from the relationship
    const images = product?.images?.map(img => 
        img.image_path ? `/storage/${img.image_path}` : img
    ) || [];

    // Parse sizes and colors from string to array
    const availableSizes = product?.sizes ? 
        (Array.isArray(product.sizes) ? product.sizes : product.sizes.split(',').map(s => s.trim()).filter(s => s)) 
        : [];

    const availableColors = product?.colors ? 
        (Array.isArray(product.colors) ? product.colors : product.colors.split(',').map(c => c.trim()).filter(c => c)) 
        : [];

    // Reset states when product changes
    useEffect(() => {
        setQuantity(1);
        setCurrentImage(0);
        setSelectedSize("");
        setSelectedColor("");
        
        // Auto-select first available size and color if only one option exists
        if (availableSizes.length === 1) {
            setSelectedSize(availableSizes[0]);
        }
        if (availableColors.length === 1) {
            setSelectedColor(availableColors[0]);
        }
    }, [product]);

    const handlePrevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleQuantityChange = (value) => {
        const newValue = parseInt(value) || 1;
        const maxStock = product?.stock_quantity || 278;
        if (newValue >= 1 && newValue <= maxStock) {
            setQuantity(newValue);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;
        
        // Check if size selection is required but not selected
        if (availableSizes.length > 0 && !selectedSize) {
            alert("Please select a size before adding to cart");
            return;
        }
        
        // Check if color selection is required but not selected
        if (availableColors.length > 0 && !selectedColor) {
            alert("Please select a color before adding to cart");
            return;
        }
        
        setIsAddingToCart(true);
        try {
            // Create a cart-ready product object with selected variants
            const cartProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                discounted_price: product.discounted_price || product.price,
                images: images,
                slug: product.slug,
                stock_quantity: product.stock_quantity,
                selectedSize: selectedSize,
                selectedColor: selectedColor,
                size: selectedSize,
                color: selectedColor,
                product_name: product.name,
                product_sku: product.sku,
                product_brand: product.brand,
                // Create a unique identifier for cart items with variants
                variantId: `${product.id}-${selectedSize}-${selectedColor}`
            };
            
            // Add the product to cart with the selected quantity
            await addToCart(cartProduct, quantity);
            
            console.log(`Added ${quantity} ${product.name} to cart`, {
                size: selectedSize,
                color: selectedColor
            });
            
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (!product) return;
        
        setIsTogglingWishlist(true);
        try {
            const wishlistProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                discounted_price: product.discounted_price || product.price,
                images: images,
                slug: product.slug,
                rating: product.rating || 0,
                inStock: product.in_stock || product.stock_quantity > 0,
                availableSizes: availableSizes,
                availableColors: availableColors,
                sku: product.sku,
                brand: product.brand,
                product_name: product.name,
                product_sku: product.sku,
                product_brand: product.brand
            };

            if (isInWishlist(product.id)) {
                await removeFromWishlist(product.id);
                console.log(`Removed ${product.name} from wishlist`);
            } else {
                await addToWishlist(wishlistProduct);
                console.log(`Added ${product.name} to wishlist`);
            }
        } catch (error) {
            console.error('Failed to toggle wishlist:', error);
            alert('Failed to update wishlist. Please try again.');
        } finally {
            setIsTogglingWishlist(false);
        }
    };

    const handleBuyNow = async () => {
        // Check selections before proceeding to buy now
        if (availableSizes.length > 0 && !selectedSize) {
            alert("Please select a size before buying");
            return;
        }
        
        if (availableColors.length > 0 && !selectedColor) {
            alert("Please select a color before buying");
            return;
        }
        
        await handleAddToCart();
        window.location.href = '/check-out';
    };

    const renderStars = (rating) => {
        const actualRating = rating || 0;
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-5 h-5 ${i < actualRating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    // Function to get color style based on color name
    const getColorStyle = (colorName) => {
        const colorMap = {
            'red': 'bg-red-500',
            'blue': 'bg-blue-500',
            'green': 'bg-green-500',
            'black': 'bg-black',
            'white': 'bg-white border border-gray-300',
            'gray': 'bg-gray-400',
            'yellow': 'bg-yellow-400',
            'pink': 'bg-pink-400',
            'purple': 'bg-purple-500',
            'orange': 'bg-orange-400',
            'brown': 'bg-amber-800',
            'navy': 'bg-blue-800',
            'maroon': 'bg-red-800',
            'teal': 'bg-teal-500',
            'cyan': 'bg-cyan-400',
            'lime': 'bg-lime-400',
            'indigo': 'bg-indigo-500',
            'violet': 'bg-violet-500',
            'gold': 'bg-yellow-300',
            'silver': 'bg-gray-300'
        };

        const normalizedColor = colorName.toLowerCase().trim();
        return colorMap[normalizedColor] || 'bg-gray-200';
    };

    if (!product) return null;

    // Calculate display price and discount
    const displayPrice = product.discounted_price || product.price;
    const hasDiscount = product.discount && product.discount > 0;
    const originalPrice = hasDiscount ? product.price : null;

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${showDetails ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto relative transform transition-transform duration-300 ${showDetails ? 'scale-100' : 'scale-95'}`}>
                <button
                    onClick={() => setShowDetails(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 p-8">
                    {/* Left Side - Image Gallery */}
                    <div className="relative sticky top-8 self-start">
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                            {images.length > 0 ? (
                                <img
                                    src={images[currentImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No image available
                                </div>
                            )}
                            
                            {/* Discount Badge */}
                            {hasDiscount && (
                                <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-sm font-semibold rounded">
                                    -{product.discount}%
                                </div>
                            )}
                            
                            {/* Navigation Arrows - Only show if there are multiple images */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all hover:scale-110"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all hover:scale-110"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}

                            {/* Action Icons */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                <button 
                                    onClick={handleWishlistToggle}
                                    disabled={isTogglingWishlist || wishlistLoading}
                                    className={`relative p-2 rounded-full shadow-md transition-colors ${
                                        isInWishlist(product.id) 
                                            ? "bg-pink-50 text-pink-500 hover:bg-pink-100" 
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                    } ${isTogglingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    <Heart 
                                        className="w-4 h-4" 
                                        fill={isInWishlist(product.id) ? "currentColor" : "none"}
                                    />
                                    {isTogglingWishlist && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-3 h-3 border border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                        </span>
                                    )}
                                </button>
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart || cartLoading}
                                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-4 h-4 text-gray-700" />
                                </button>
                            </div>
                        </div>

                        {/* Image Dots Indicator - Only show if there are multiple images */}
                        {images.length > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            index === currentImage
                                                ? "bg-gray-800 w-6"
                                                : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Thumbnail Gallery - Only show if there are multiple images */}
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden transition-all ${
                                            index === currentImage
                                                ? "border-gray-800"
                                                : "border-transparent hover:border-gray-400"
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} view ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            {renderStars(product.rating)}
                            <span className="text-sm text-gray-600">({product.reviews ? product.reviews.length : 0} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            {originalPrice && (
                                <span className="text-gray-400 line-through text-lg">
                                    Rs.{originalPrice}
                                </span>
                            )}
                            <span className="text-3xl font-bold text-gray-900">
                                Rs.{displayPrice}
                            </span>
                            {hasDiscount && (
                                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                                    Save {product.discount}%
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                           {product.short_description || product.long_description || "No description available."}
                        </p>

                        {/* Size Selection */}
                        {availableSizes.length > 0 && (
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">Size:</span>
                                    {selectedSize && (
                                        <span className="text-sm text-gray-600">Selected: {selectedSize}</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border rounded-lg transition-all ${
                                                selectedSize === size
                                                    ? "border-gray-900 bg-gray-900 text-white"
                                                    : "border-gray-300 hover:border-gray-900 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection */}
                        {availableColors.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">Color:</span>
                                    {selectedColor && (
                                        <span className="text-sm text-gray-600">Selected: {selectedColor}</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`flex flex-col items-center gap-1 transition-all ${
                                                selectedColor === color ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                                            }`}
                                        >
                                            <div 
                                                className={`w-10 h-10 rounded-full ${getColorStyle(color)} border border-gray-200`}
                                                title={color}
                                            />
                                            <span className="text-xs text-gray-600 capitalize">{color}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="mb-6">
                            <span className={`inline-block text-sm font-medium px-3 py-1 rounded ${
                                product.in_stock 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                            }`}>
                                {product.stock_quantity || 278} in stock
                            </span>
                        </div>

                        {/* Quantity Selector and Add to Cart */}
                        <div className="flex gap-3 mb-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(e.target.value)}
                                    className="w-16 px-3 py-2 text-center border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg"
                                    min="1"
                                    max={product.stock_quantity || 278}
                                />
                                <div className="flex flex-col border-l border-gray-300">
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="px-2 py-1 hover:bg-gray-100 border-b border-gray-300 transition-colors"
                                        disabled={quantity >= (product.stock_quantity || 278)}
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="px-2 py-1 hover:bg-gray-100 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <svg className="w-3 h-3 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                disabled={!product.in_stock || product.stock_quantity <= 0 || isAddingToCart || cartLoading}
                                className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isAddingToCart ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ADDING...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4" />
                                        {product.in_stock ? "ADD TO CART" : "OUT OF STOCK"}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Buy Now Button */}
                        <button 
                            onClick={handleBuyNow}
                            disabled={!product.in_stock || product.stock_quantity <= 0 || isAddingToCart}
                            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors mb-6 disabled:bg-red-400 disabled:cursor-not-allowed"
                        >
                            {product.in_stock ? "BUY NOW" : "OUT OF STOCK"}
                        </button>

                        {/* Product Meta Information */}
                        <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">SKU:</span> {product.sku || `PRD-${product.id.toString().padStart(3, '0')}`}
                            </div>
                            <div>
                                <span className="font-medium">Categories:</span> {product.category?.name || 'Our Store'}, {product.subCategory?.name || 'Popular'}
                            </div>
                            <div>
                                <span className="font-medium">Shipping:</span> {product.free_shipping || 'Free shipping worldwide'}
                            </div>
                            {selectedSize && (
                                <div>
                                    <span className="font-medium">Selected Size:</span> {selectedSize}
                                </div>
                            )}
                            {selectedColor && (
                                <div>
                                    <span className="font-medium">Selected Color:</span> {selectedColor}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPopup;