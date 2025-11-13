import React, { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Eye,
    ExternalLink,
    ShoppingCart,
} from "lucide-react";
import ProductsPopup from "./ProductsPopup";
import { Link } from "@inertiajs/react";
import { useCart } from "../Contexts/CartContext";
import { useWishlist } from "../Contexts/WishlistContext";
import axios from "axios";

const PopularProducts = () => {
    const [activeTab, setActiveTab] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    // Fetch categories and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch categories
                console.log("Fetching categories from:", route("ourcategory.index"));
                const categoriesResponse = await axios.get(route("ourcategory.index"));
                const categoriesData = categoriesResponse.data.data || categoriesResponse.data || [];
                console.log("Categories response:", categoriesData);
                setAllCategories(categoriesData);

                // Set first category as active tab if available
                if (categoriesData.length > 0) {
                    setActiveTab(categoriesData[0].category || categoriesData[0].name);
                }

                // Fetch products
                console.log("Fetching products from:", route("ourproducts.index"));
                const productsResponse = await axios.get(route("ourproducts.index"));
                const productsData = productsResponse.data.data || productsResponse.data || [];
                console.log("Products response:", productsData);
                setAllProducts(productsData);

            } catch (err) {
                console.error("Fetching error:", err);
                console.error("Error response:", err.response);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products by active category
    const getFilteredProducts = () => {
        if (!activeTab || allProducts.length === 0) return [];
        
        return allProducts.filter(product => {
            // Check if product belongs to the active category
            // You might need to adjust this based on your actual data structure
            return product.category?.category === activeTab || 
                   product.category_id === activeTab ||
                   product.category?.name === activeTab;
        });
    };

    const activeProducts = getFilteredProducts();

    const scroll = (direction) => {
        const container = document.getElementById("products-container");
        if (!container) return;
        const card = container.firstElementChild;
        const cardWidth = card ? card.offsetWidth + 24 : 320;
        container.scrollBy({
            left: direction === "left" ? -cardWidth : cardWidth,
            behavior: "smooth",
        });
    };

    const handleShowDetails = (product) => {
        setSelectedProduct(product);
        setShowDetails(true);
    };

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.discounted_price || product.price,
            images: product.images?.map(img => img.image_path) || [product.image],
            slug: product.slug
        };
        
        addToCart(cartProduct);
        console.log(`Added ${product.name} to cart`);
    };

    const handleWishlistToggle = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const wishlistProduct = {
            id: product.id,
            name: product.name,
            price: product.discounted_price || product.price,
            images: product.images?.map(img => img.image_path) || [product.image],
            slug: product.slug,
            rating: product.rating || 4, // Default rating if not available
            inStock: product.in_stock !== undefined ? product.in_stock : (product.stock_quantity > 0)
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
        const productRating = rating || 4; // Default rating if not available
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

    // Get product image
   const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
        // Find primary image or use first image
        const primaryImage = product.images.find(img => img.is_primary);
        const imagePath = primaryImage
            ? primaryImage.image_path
            : product.images[0].image_path;

        // Ensure it uses the /storage path
        return imagePath.startsWith('/storage/')
            ? imagePath
            : `/storage/${imagePath}`;
    }

    // If product has a single image or fallback placeholder
    if (product.image) {
        return product.image.startsWith('/storage/')
            ? product.image
            : `/storage/${product.image}`;
    }

    // Default placeholder
    return "/images/placeholder-product.jpg";
};


    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-12">
                <div className="text-center text-red-500">
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-4xl font-semibold text-center mb-8 text-gray-900">
                Popular Products
            </h2>

            {/* Category Tabs */}
            <div className="flex justify-center gap-8 mb-10">
                {allCategories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveTab(category.category || category.name)}
                        className={`text-lg font-medium pb-2 transition-all ${
                            activeTab === (category.category || category.name)
                                ? "text-gray-900 border-b-2 border-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {category.category || category.name}
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
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="block"
                                >
                                    <div className="relative bg-white h-72 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {product.discount && product.discount > 0 && (
                                            <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-semibold">
                                                -{product.discount}%
                                            </div>
                                        )}
                                        {!product.in_stock && (
                                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold">
                                                Out of Stock
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col items-center">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2 h-10 line-clamp-2 text-center">
                                            {product.name}
                                        </h3>
                                        <div className="mb-2">
                                            {renderStars(product.rating)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {product.discount && product.discount > 0 ? (
                                                <>
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        Rs.{product.discounted_price || (product.price - (product.price * product.discount / 100)).toFixed(2)}
                                                    </span>
                                                    <span className="text-sm text-gray-500 line-through">
                                                        Rs.{product.price}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-semibold text-gray-900">
                                                    Rs.{product.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>

                                {/* Overlay actions */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleWishlistToggle(product, e)}
                                        className={`p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors ${
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
                                        disabled={!product.in_stock}
                                        className={`p-2 rounded-full shadow-md transition-colors ${
                                            product.in_stock 
                                                ? "bg-white text-gray-700 hover:bg-gray-100" 
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
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                        aria-label="View details"
                                    >
                                        <Eye className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                        aria-label="View product details"
                                    >
                                        <ExternalLink className="w-4 h-4 text-gray-700" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 w-full py-12">
                            {activeTab ? `No products available in ${activeTab} category.` : "Please select a category."}
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