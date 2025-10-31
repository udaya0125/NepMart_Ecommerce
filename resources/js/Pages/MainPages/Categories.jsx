import React, { useState, useMemo } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    ShoppingCart,
    Eye,
    ExternalLink,
} from "lucide-react";
import productsData from "../../../JsonData/Products.json";
import ProductsPopup from "@/MainComponents/ProductsPopup";
import Navbar from "@/ContentWrapper/Navbar";
import { Link } from "@inertiajs/react";
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext'; // Import the useWishlist hook

const Categories = () => {
    const [showFilters, setShowFilters] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    
    // Calculate initial price range from actual products
    const initialPriceRange = useMemo(() => {
        const allProducts = Object.values(productsData.products).flat();
        if (allProducts.length === 0) return [500, 10000];
        
        const prices = allProducts.map(p => parseFloat(p.price));
        return [
            Math.floor(Math.min(...prices)),
            Math.ceil(Math.max(...prices))
        ];
    }, []);

    const [filters, setFilters] = useState({
        new: false,
        sale: false,
        outerwear: [],
        priceRange: initialPriceRange,
        sizes: [],
    });

    const [expandedSections, setExpandedSections] = useState({
        outerwear: true,
        price: true,
        size: true,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const sizes = [92, 102, 104, 106, 108, 110, 112, 116];

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // Use wishlist context

    // Flatten all products from all categories
    const allProducts = useMemo(() => {
        return Object.values(productsData.products).flat();
    }, []);

    // Get unique categories
    const categories = useMemo(() => {
        return [...new Set(allProducts.map((p) => p.category))];
    }, [allProducts]);

    // Calculate realistic price range from actual products
    const productPriceRange = useMemo(() => {
        if (allProducts.length === 0) return { min: 500, max: 10000 };
        
        const prices = allProducts.map(p => parseFloat(p.price));
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices))
        };
    }, [allProducts]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return allProducts.filter((product) => {
            // New filter
            if (filters.new && !product.isNew) return false;

            // Sale filter
            if (filters.sale && !product.discount) return false;

            // Category filter
            if (
                filters.outerwear.length > 0 &&
                !filters.outerwear.includes(product.category)
            ) {
                return false;
            }

            // Price filter
            const productPrice = parseFloat(product.price);
            if (
                productPrice < filters.priceRange[0] ||
                productPrice > filters.priceRange[1]
            ) {
                return false;
            }

            // Size filter
            if (
                filters.sizes.length > 0 &&
                product.sizes &&
                !filters.sizes.some((size) =>
                    product.sizes.includes(size.toString())
                )
            ) {
                return false;
            }

            return true;
        });
    }, [filters, allProducts]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    // Filter handlers
    const toggleFilterNew = () => setFilters((f) => ({ ...f, new: !f.new }));
    const toggleFilterSale = () => setFilters((f) => ({ ...f, sale: !f.sale }));

    const toggleOuterwearItem = (item) => {
        setFilters((f) => {
            const has = f.outerwear.includes(item);
            const newOuterwear = has
                ? f.outerwear.filter((o) => o !== item)
                : [...f.outerwear, item];
            return { ...f, outerwear: newOuterwear };
        });
    };

    const onMinPriceChange = (e) => {
        const val = Number(e.target.value);
        setFilters((f) => ({
            ...f,
            priceRange: [Math.min(val, f.priceRange[1]), f.priceRange[1]],
        }));
    };

    const onMaxPriceChange = (e) => {
        const val = Number(e.target.value);
        setFilters((f) => ({
            ...f,
            priceRange: [f.priceRange[0], Math.max(val, f.priceRange[0])],
        }));
    };

    // Dual range slider handler
    const onPriceRangeChange = (values) => {
        setFilters((f) => ({
            ...f,
            priceRange: values,
        }));
    };

    const toggleSize = (size) => {
        setFilters((f) => {
            const has = f.sizes.includes(size);
            const newSizes = has
                ? f.sizes.filter((s) => s !== size)
                : [...f.sizes, size];
            return { ...f, sizes: newSizes };
        });
    };

    const resetFilters = () => {
        setFilters({
            new: false,
            sale: false,
            outerwear: [],
            priceRange: [productPriceRange.min, productPriceRange.max],
            sizes: [],
        });
        setCurrentPage(1);
    };

    const toggleSection = (section) => {
        setExpandedSections((e) => ({ ...e, [section]: !e[section] }));
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
            price: product.price,
            images: product.images,
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
            price: product.price,
            images: product.images,
            slug: product.slug,
            rating: product.rating,
            inStock: true
        };

        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
            console.log(`Removed ${product.name} from wishlist`);
        } else {
            addToWishlist(wishlistProduct);
            console.log(`Added ${product.name} to wishlist`);
        }
    };

    // Pagination
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    // Star rating
    const renderStars = (rating = 4) => (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <span
                    key={i}
                    className={i < rating ? "text-yellow-400" : "text-gray-300"}
                >
                    ★
                </span>
            ))}
        </div>
    );

    // Pagination buttons
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === i
                            ? "bg-green-500 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    // Custom range slider component to fix the dual slider issue
    const RangeSlider = ({ min, max, values, onChange }) => {
        const [minVal, maxVal] = values;
        
        const handleMinChange = (e) => {
            const value = Math.min(Number(e.target.value), maxVal);
            onChange([value, maxVal]);
        };

        const handleMaxChange = (e) => {
            const value = Math.max(Number(e.target.value), minVal);
            onChange([minVal, value]);
        };

        const minPercent = ((minVal - min) / (max - min)) * 100;
        const maxPercent = ((maxVal - min) / (max - min)) * 100;

        return (
            <div className="relative py-4">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={handleMinChange}
                    className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={handleMaxChange}
                    className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
                />
                
                {/* Track */}
                <div className="absolute w-full h-2 bg-gray-200 rounded-lg"></div>
                
                {/* Active range */}
                <div 
                    className="absolute h-2 bg-green-500 rounded-lg"
                    style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`
                    }}
                />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Navbar />
            <div className="relative h-[550px] overflow-hidden">
                <img
                    src="https://images.pexels.com/photos-1525612/pexels-photo-1525612.jpeg"
                    alt="Products hero image"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                        Our Products
                    </h1>
                    <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">
                        Discover premium quality products crafted with excellence
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <div className={`${showFilters ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden`}>
                        {showFilters && (
                            <div className="bg-white rounded-lg shadow-sm">
                                {/* Filter Header */}
                                <div className="p-4 border-b flex justify-between items-center">
                                    <h2 className="font-semibold">Filters</h2>
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm text-green-500 hover:text-green-600"
                                    >
                                        Reset All
                                    </button>
                                </div>

                                {/* New & Sale */}
                                <div className="p-4 border-b">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.new}
                                                onChange={toggleFilterNew}
                                                className="w-4 h-4 text-green-500"
                                            />
                                            <span className="text-sm">New Arrivals</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.sale}
                                                onChange={toggleFilterSale}
                                                className="w-4 h-4 text-green-500"
                                            />
                                            <span className="text-sm">On Sale</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div className="p-4 border-b">
                                    <div
                                        className="flex items-center justify-between mb-3 cursor-pointer"
                                        onClick={() => toggleSection("outerwear")}
                                    >
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase">
                                            Category
                                        </h3>
                                        <button className="text-xl font-bold select-none">
                                            {expandedSections.outerwear ? "−" : "+"}
                                        </button>
                                    </div>
                                    {expandedSections.outerwear && (
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {categories.map((category) => (
                                                <label
                                                    key={category}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.outerwear.includes(category)}
                                                        className="w-4 h-4 text-green-500"
                                                        onChange={() => toggleOuterwearItem(category)}
                                                    />
                                                    <span className="text-sm capitalize">{category}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Price Filter */}
                                <div className="p-4 border-b">
                                    <div
                                        className="flex items-center justify-between mb-3 cursor-pointer"
                                        onClick={() => toggleSection("price")}
                                    >
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase">
                                            Price (Rs.)
                                        </h3>
                                        <button className="text-xl font-bold select-none">
                                            {expandedSections.price ? "−" : "+"}
                                        </button>
                                    </div>
                                    {expandedSections.price && (
                                        <div className="relative pt-2 pb-4">
                                            <div className="flex justify-between mb-2">
                                                <input
                                                    type="number"
                                                    min={productPriceRange.min}
                                                    max={productPriceRange.max}
                                                    value={filters.priceRange[0]}
                                                    onChange={onMinPriceChange}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    min={productPriceRange.min}
                                                    max={productPriceRange.max}
                                                    value={filters.priceRange[1]}
                                                    onChange={onMaxPriceChange}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </div>
                                            
                                            {/* Fixed Dual Range Slider */}
                                            <RangeSlider
                                                min={productPriceRange.min}
                                                max={productPriceRange.max}
                                                values={filters.priceRange}
                                                onChange={onPriceRangeChange}
                                            />
                                            
                                            <div className="flex justify-between mt-2 text-sm">
                                                <span>Rs.{filters.priceRange[0].toLocaleString()}</span>
                                                <span>Rs.{filters.priceRange[1].toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Size Filter */}
                                <div className="p-4">
                                    <div
                                        className="flex items-center justify-between mb-3 cursor-pointer"
                                        onClick={() => toggleSection("size")}
                                    >
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase">
                                            Size
                                        </h3>
                                        <button className="text-xl font-bold select-none">
                                            {expandedSections.size ? "−" : "+"}
                                        </button>
                                    </div>
                                    {expandedSections.size && (
                                        <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => toggleSize(size)}
                                                    className={`py-2 px-3 border rounded text-sm font-medium transition-colors ${
                                                        filters.sizes.includes(size)
                                                            ? "bg-green-500 text-white border-green-500"
                                                            : "border-gray-300 hover:border-gray-400"
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Grid Area */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-600">Sort by</label>
                                    <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                                        <option>Default</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                        <option>Newest</option>
                                        <option>Popular</option>
                                    </select>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Showing {indexOfFirstProduct + 1}-
                                    {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm transition-colors"
                            >
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </button>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-lg overflow-hidden group relative border border-gray-200 hover:shadow-lg transition-all duration-300"
                                    >
                                        {/* Product Link */}
                                        <Link href={`/products/${product.slug}`} className="block">
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
                                                {product.isNew && (
                                                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold">
                                                        NEW
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
                                                    {product.oldPrice && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            Rs.{product.oldPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        Rs.{parseFloat(product.price).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Action Icons */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={(e) => handleWishlistToggle(product, e)}
                                                className={`p-2 rounded-full shadow-md transition-colors ${
                                                    isInWishlist(product.id) 
                                                        ? "bg-pink-50 text-pink-500 hover:bg-pink-100" 
                                                        : "bg-white text-gray-700 hover:bg-gray-100"
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
                                                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
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
                                                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                                aria-label="View details"
                                            >
                                                <Eye className="w-4 h-4 text-gray-700" />
                                            </button>
                                            <button
                                                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                                aria-label="View on external site"
                                            >
                                                <ExternalLink className="w-4 h-4 text-gray-700" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 col-span-full py-8">
                                    No products found matching your filters.
                                    <button 
                                        onClick={resetFilters}
                                        className="ml-2 text-green-500 hover:text-green-600 underline"
                                    >
                                        Reset filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {filteredProducts.length > productsPerPage && (
                            <div className="flex justify-center items-center gap-4 mb-8">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-md transition-colors ${
                                        currentPage === 1
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600"
                                    }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex gap-2">{renderPaginationButtons()}</div>

                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-md transition-colors ${
                                        currentPage === totalPages
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600"
                                    }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Popup */}
            <ProductsPopup
                product={selectedProduct}
                showDetails={showDetails}
                setShowDetails={setShowDetails}
            />
        </div>
    );
};

export default Categories;