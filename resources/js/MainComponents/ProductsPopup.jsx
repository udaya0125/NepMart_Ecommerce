import { X, ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import React, { useState, useEffect } from "react";

const ProductsPopup = ({ product, showDetails, setShowDetails }) => {
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState(0);
    
    // Use the product's images array from JSON data
    const images = product?.images || [];

    // Reset quantity and image when product changes
    useEffect(() => {
        setQuantity(1);
        setCurrentImage(0);
    }, [product]);

    const handlePrevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleQuantityChange = (value) => {
        const newValue = parseInt(value) || 1;
        if (newValue >= 1 && newValue <= 278) {
            setQuantity(newValue);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    if (!product) return null;

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
                    <div className="relative">
                        <div className="relative  bg-gray-100 rounded-lg overflow-hidden">
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
                            {product.discount && (
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
                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                                    <Heart className="w-4 h-4 text-gray-700" />
                                </button>
                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
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
                            <span className="text-sm text-gray-600">({product.reviews.length} review)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            {product.priceMax && (
                                <span className="text-gray-400 line-through text-lg">
                                    ${product.priceMax}
                                </span>
                            )}
                            <span className="text-3xl font-bold text-gray-900">
                                ${product.price}
                            </span>
                            {product.discount && (
                                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                                    Save {product.discount}%
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                           {product.shortDescription}
                        </p>

                        {/* Stock Status */}
                        <div className="mb-6">
                            <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
                                278 in stock
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
                                    max="278"
                                />
                                <div className="flex flex-col border-l border-gray-300">
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="px-2 py-1 hover:bg-gray-100 border-b border-gray-300 transition-colors"
                                        disabled={quantity >= 278}
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
                            <button className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                ADD TO CART
                            </button>
                        </div>

                        {/* Buy Now Button */}
                        <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors mb-6">
                            BUY NOW
                        </button>

                        {/* Product Meta Information */}
                        <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">SKU:</span> PRD-{product.id.toString().padStart(3, '0')}
                            </div>
                            <div>
                                <span className="font-medium">Categories:</span> Our Store, {product.category || 'Popular'}
                            </div>
                            <div>
                                <span className="font-medium">Shipping:</span> Free shipping worldwide
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPopup;