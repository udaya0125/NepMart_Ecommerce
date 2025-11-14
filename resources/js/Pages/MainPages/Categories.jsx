import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    ShoppingCart,
    Eye,
    ExternalLink,
    Menu,
    X,
} from "lucide-react";
import ProductsPopup from "@/MainComponents/ProductsPopup";
import Navbar from "@/ContentWrapper/Navbar";
import { Link } from "@inertiajs/react";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import axios from "axios";
import Footer from "@/ContentWrapper/Footer";

const Categories = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

    // Calculate initial price range from actual products
    const productPriceRange = useMemo(() => {
        if (allProducts.length === 0) return { min: 500, max: 10000 };
        const prices = allProducts
            .map((p) => parseFloat(p.price || p.discounted_price || 0))
            .filter((price) => !isNaN(price) && price > 0);
        if (prices.length === 0) return { min: 500, max: 10000 };
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices)),
        };
    }, [allProducts]);

    console.log(allCategory);
    console.log(allProducts);

    const [filters, setFilters] = useState(() => ({
        new: false,
        sale: false,
        categories: [],
        priceRange: [0, 50000],
        sizes: [],
        search: "",
    }));

    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
        size: true,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;
    const sizes = [92, 102, 104, 106, 108, 110, 112, 116];
    const { addToCart } = useCart();
    const {
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistItemId,
    } = useWishlist();

    // Show notification message
    const showNotificationMessage = (message, type = "success") => {
        setNotification({ show: true, message, type });
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "success" });
        }, 3000);
    };

    // Get unique categories from fetched categories
    const categories = useMemo(() => {
        if (!allCategory || allCategory.length === 0) return [];
        return allCategory
            .map((category) => ({
                id: category.id,
                name: category.category || category.name,
                slug: category.slug,
            }))
            .filter((category) => category.name);
    }, [allCategory]);

    // Build filter parameters for API call
    const buildFilterParams = useCallback(() => {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory =
            urlParams.get("categories") ||
            urlParams.get("category_id") ||
            urlParams.get("category");
        
        if (urlCategory) {
            params.categories = urlCategory;
            params.category_id = urlCategory;
            params.category = urlCategory;
            const categoryIds = urlCategory
                .split(",")
                .map((id) => parseInt(id))
                .filter((id) => !isNaN(id));
            if (
                categoryIds.length > 0 &&
                JSON.stringify(categoryIds) !==
                    JSON.stringify(filters.categories)
            ) {
                setFilters((prev) => ({
                    ...prev,
                    categories: categoryIds,
                }));
            }
        } else if (filters.categories.length > 0) {
            params.categories = filters.categories.join(",");
            params.category_id = filters.categories.join(",");
            params.category = filters.categories.join(",");
        }
        
        if (filters.new) params.new_arrivals = true;
        if (filters.sale) params.on_sale = true;
        
        if (filters.priceRange && filters.priceRange[0] > 0) {
            params.min_price = filters.priceRange[0];
        }
        if (filters.priceRange && filters.priceRange[1] < 50000) {
            params.max_price = filters.priceRange[1];
        }
        
        if (filters.sizes.length > 0) {
            params.sizes = filters.sizes.join(",");
        }
        
        if (filters.search) {
            params.search = filters.search;
        }
        
        params.page = currentPage;
        params.per_page = productsPerPage;
        console.log("Filter params being sent:", params);
        return params;
    }, [filters, currentPage, productsPerPage]);

    // Fetch products with filters
    const fetchProducts = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const cleaned = { ...params };
            Object.keys(cleaned).forEach((key) => {
                const val = cleaned[key];
                if (val === false || val === "" || val == null)
                    delete cleaned[key];
                if (Array.isArray(val) && val.length === 0) delete cleaned[key];
            });
            console.log("Fetching products with params:", cleaned);
            const response = await axios.get(route("ourproducts.index"), {
                params: cleaned,
            });
            console.log("Products response:", response?.data);
            const productsData = response.data?.data ?? response.data ?? [];
            setAllProducts(
                Array.isArray(productsData) ? productsData : productsData
            );
        } catch (err) {
            console.error("Fetching error:", err);
            console.error("Error response:", err?.response);
            setError("Failed to load products. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get(route("ourcategory.index"));
            console.log("Categories response:", response?.data);
            const categoriesData = response.data?.data ?? response.data ?? [];
            setAllCategory(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (err) {
            console.error("Categories fetching error:", err);
            setError("Failed to load categories.");
        }
    };

    // Read URL parameters on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam =
            urlParams.get("categories") ||
            urlParams.get("category_id") ||
            urlParams.get("category");
        if (categoryParam) {
            const categoryIds = categoryParam
                .split(",")
                .map((id) => parseInt(id))
                .filter((id) => !isNaN(id));
            if (categoryIds.length > 0) {
                setFilters((prev) => ({
                    ...prev,
                    categories: categoryIds,
                }));
            }
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchCategories();
            await fetchProducts({ page: 1, per_page: productsPerPage });
        };
        fetchInitialData();
    }, []);

    // Fetch products when filters or page change
    useEffect(() => {
        const params = buildFilterParams();
        fetchProducts(params);
    }, [buildFilterParams]);

    // Filter products locally for immediate UI update
    const filteredProducts = useMemo(() => {
        if (!allProducts || allProducts.length === 0) return [];
        const mappedFilterCategoryStrings = filters.categories.map((c) =>
            String(c)
        );
        return allProducts.filter((product) => {
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const productName = product.name?.toLowerCase() || "";
                const productBrand =
                    product.brand?.toLowerCase() ||
                    product.product_brand?.toLowerCase() ||
                    "";
                const productSku =
                    product.sku?.toLowerCase() ||
                    product.product_sku?.toLowerCase() ||
                    "";
                if (
                    !productName.includes(searchTerm) &&
                    !productBrand.includes(searchTerm) &&
                    !productSku.includes(searchTerm)
                ) {
                    return false;
                }
            }
            
            if (filters.new) {
                const isNew =
                    product.isNew ||
                    (product.created_at &&
                        new Date(product.created_at) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
                if (!isNew) return false;
            }
            
            if (
                filters.sale &&
                (!product.discount && product.discount !== 0
                    ? true
                    : product.discount === 0)
            ) {
                if (!(product.discount > 0)) return false;
            }
            
            if (filters.categories.length > 0) {
                const productCategoryId =
                    product.category_id ??
                    product.category?.id ??
                    product.category;
                if (!productCategoryId) return false;
                const prodCatStr = String(productCategoryId);
                if (!mappedFilterCategoryStrings.includes(prodCatStr))
                    return false;
            }
            
            const productPrice = parseFloat(
                product.discounted_price ?? product.price
            );
            if (isNaN(productPrice)) return false;
            if (
                productPrice < filters.priceRange[0] ||
                productPrice > filters.priceRange[1]
            )
                return false;
            
            if (filters.sizes.length > 0 && product.sizes) {
                try {
                    const productSizes =
                        typeof product.sizes === "string"
                            ? JSON.parse(product.sizes)
                            : product.sizes;
                    if (!Array.isArray(productSizes)) return false;
                    const productSizesStr = productSizes.map((s) => String(s));
                    if (
                        !filters.sizes.some((size) =>
                            productSizesStr.includes(String(size))
                        )
                    )
                        return false;
                } catch (error) {
                    console.error("Error parsing sizes:", error);
                    return false;
                }
            }
            return true;
        });
    }, [filters, allProducts]);

    // Pagination (client-side based on filteredProducts)
    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / productsPerPage)
    );
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

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

    // Handle Add to Cart
    const handleAddToCart = async (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if product is in stock
        const isInStock = product.in_stock !== false && (product.stock_quantity > 0 || product.in_stock === true);
        if (!isInStock) {
            showNotificationMessage(`${product.name} is out of stock!`, "error");
            return;
        }

        try {
            // Prepare the product data with all required fields
            const cartProduct = prepareProductData(product);
            
            await addToCart(cartProduct, 1);
            
            console.log(`Added ${product.name} to cart`);
            showNotificationMessage(`${product.name} added to cart!`);
            
        } catch (error) {
            console.error('Failed to add to cart:', error);
            showNotificationMessage('Failed to add item to cart. Please try again.', "error");
        }
    };

    // Handle Wishlist Toggle
    const handleWishlistToggle = async (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
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

    // Filter handlers
    const toggleFilterNew = () => {
        setFilters((f) => ({ ...f, new: !f.new }));
        setCurrentPage(1);
    };
    const toggleFilterSale = () => {
        setFilters((f) => ({ ...f, sale: !f.sale }));
        setCurrentPage(1);
    };
    const toggleCategoryItem = (categoryId) => {
        setFilters((f) => {
            const has = f.categories.includes(categoryId);
            const newCategories = has
                ? f.categories.filter((o) => o !== categoryId)
                : [...f.categories, categoryId];
            return { ...f, categories: newCategories };
        });
        setCurrentPage(1);
    };
    const onMinPriceChange = (e) => {
        const val = Number(e.target.value || 0);
        setFilters((f) => ({
            ...f,
            priceRange: [Math.min(val, f.priceRange[1]), f.priceRange[1]],
        }));
        setCurrentPage(1);
    };
    const onMaxPriceChange = (e) => {
        const val = Number(e.target.value || 0);
        setFilters((f) => ({
            ...f,
            priceRange: [f.priceRange[0], Math.max(val, f.priceRange[0])],
        }));
        setCurrentPage(1);
    };
    const onPriceRangeChange = (values) => {
        setFilters((f) => ({ ...f, priceRange: values }));
        setCurrentPage(1);
    };
    const toggleSize = (size) => {
        setFilters((f) => {
            const has = f.sizes.includes(size);
            const newSizes = has
                ? f.sizes.filter((s) => s !== size)
                : [...f.sizes, size];
            return { ...f, sizes: newSizes };
        });
        setCurrentPage(1);
    };
    const resetFilters = () => {
        setFilters({
            new: false,
            sale: false,
            categories: [],
            priceRange: [productPriceRange.min, productPriceRange.max],
            sizes: [],
            search: "",
        });
        setCurrentPage(1);
        const url = new URL(window.location);
        url.searchParams.delete("categories");
        url.searchParams.delete("category_id");
        url.searchParams.delete("category");
        window.history.replaceState({}, "", url);
    };
    const toggleSection = (section) => {
        setExpandedSections((e) => ({ ...e, [section]: !e[section] }));
    };
    const handleShowDetails = (product) => {
        setSelectedProduct(product);
        setShowDetails(true);
    };

    // Pagination helpers
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
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
        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );
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

    // Custom range slider component
    const RangeSlider = ({ min, max, values, onChange }) => {
        const [minVal, maxVal] = values;
        const handleMinChange = (e) => {
            const value = Math.min(Number(e.target.value), maxVal - 1);
            onChange([value, maxVal]);
        };
        const handleMaxChange = (e) => {
            const value = Math.max(Number(e.target.value), minVal + 1);
            onChange([minVal, value]);
        };
        const denom = max - min === 0 ? 1 : max - min;
        const minPercent = ((minVal - min) / denom) * 100;
        const maxPercent = ((maxVal - min) / denom) * 100;
        return (
            <div className="relative py-4">
                <div className="relative h-2 bg-gray-200 rounded-lg">
                    <div
                        className="absolute h-2 bg-green-500 rounded-lg"
                        style={{
                            left: `${minPercent}%`,
                            width: `${Math.max(0, maxPercent - minPercent)}%`,
                        }}
                    />
                </div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={handleMinChange}
                    className="absolute top-4 w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-auto opacity-0 z-10"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={handleMaxChange}
                    className="absolute top-4 w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-auto opacity-0 z-10"
                />
                <div className="flex justify-between mt-2 text-sm">
                    <span>Rs.{minVal.toLocaleString()}</span>
                    <span>Rs.{maxVal.toLocaleString()}</span>
                </div>
            </div>
        );
    };

    // Update price range when product data loads
    useEffect(() => {
        if (allProducts.length > 0 && filters.priceRange[1] === 50000) {
            setFilters((f) => ({
                ...f,
                priceRange: [productPriceRange.min, productPriceRange.max],
            }));
        }
    }, [allProducts, productPriceRange]);

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

    if (loading && allProducts.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Loading products and categories...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center text-red-500">
                            <p>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
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

            {/* Header */}
            <Navbar />
            <div
                className="relative h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage: 'url("hero/hero.png")',
                }}
            >
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 tracking-wide text-center">
                        Our Products
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-100 text-center max-w-2xl">
                        Discover premium quality products crafted with excellence
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                    {/* Sidebar Filters */}
                    <div
                        className={`fixed inset-y-0 right-0 w-full h-full z-50 lg:z-0 sm:w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-sm lg:w-72 lg:sticky lg:top-16 lg:self-start ${
                            showFilters ? "translate-x-0" : "translate-x-full"
                        }`}
                    >
                        <div className="h-full flex flex-col">
                            {/* Mobile Header */}
                            <div className="lg:hidden p-4 border-b flex justify-between items-center">
                                <h2 className="font-semibold">Filters</h2>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-gray-500"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            {/* Desktop/Scrollable Filter Content */}
                            <div className="p-4 flex-1 overflow-y-auto">
                                {/* Filter Header */}
                                <div className="hidden lg:block pb-4 border-b">
                                    <div className="flex justify-between items-center">
                                        <h2 className="font-semibold">Filters</h2>
                                        <button
                                            onClick={resetFilters}
                                            className="text-sm text-green-500 hover:text-green-600"
                                        >
                                            Reset All
                                        </button>
                                    </div>
                                </div>
                                {/* New & Sale */}
                                <div className="pb-4 border-b">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.new}
                                                onChange={toggleFilterNew}
                                                className="w-4 h-4 text-green-500"
                                            />
                                            <span className="text-sm">
                                                New Arrivals
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.sale}
                                                onChange={toggleFilterSale}
                                                className="w-4 h-4 text-green-500"
                                            />
                                            <span className="text-sm">
                                                On Sale
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                {/* Category Filter */}
                                <div className="py-4 border-b">
                                    <div
                                        className="flex items-center justify-between mb-3 cursor-pointer"
                                        onClick={() =>
                                            toggleSection("categories")
                                        }
                                    >
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase">
                                            Category
                                        </h3>
                                        <button className="text-xl font-bold select-none">
                                            {expandedSections.categories
                                                ? "−"
                                                : "+"}
                                        </button>
                                    </div>
                                    {expandedSections.categories && (
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <label
                                                        key={category.id}
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.categories.includes(
                                                                category.id
                                                            )}
                                                            className="w-4 h-4 text-green-500"
                                                            onChange={() =>
                                                                toggleCategoryItem(
                                                                    category.id
                                                                )
                                                            }
                                                        />
                                                        <span className="text-sm capitalize">
                                                            {category.name}
                                                        </span>
                                                    </label>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    No categories available
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* Price Filter */}
                                <div className="py-4 border-b">
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
                                                    value={
                                                        filters.priceRange[0]
                                                    }
                                                    onChange={onMinPriceChange}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    min={productPriceRange.min}
                                                    max={productPriceRange.max}
                                                    value={
                                                        filters.priceRange[1]
                                                    }
                                                    onChange={onMaxPriceChange}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </div>
                                            <RangeSlider
                                                min={productPriceRange.min}
                                                max={productPriceRange.max}
                                                values={filters.priceRange}
                                                onChange={onPriceRangeChange}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* Size Filter */}
                                <div className="py-4">
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
                                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() =>
                                                        toggleSize(size)
                                                    }
                                                    className={`py-2 px-3 border rounded text-sm font-medium transition-colors ${
                                                        filters.sizes.includes(
                                                            size
                                                        )
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
                        </div>
                    </div>

                    {/* Overlay for mobile filters */}
                    {showFilters && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                            onClick={() => setShowFilters(false)}
                        ></div>
                    )}

                    {/* Product Grid Area */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar with Search */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="flex-1">
                                {/* Search Input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={filters.search || ""}
                                        onChange={(e) => {
                                            setFilters((f) => ({
                                                ...f,
                                                search: e.target.value,
                                            }));
                                            setCurrentPage(1);
                                        }}
                                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                    {filters.search && (
                                        <button
                                            onClick={() => {
                                                setFilters((f) => ({
                                                    ...f,
                                                    search: "",
                                                }));
                                                setCurrentPage(1);
                                            }}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            <svg
                                                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm transition-colors whitespace-nowrap"
                                >
                                    <div className="flex items-center gap-2">
                                        {showFilters ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                                        <span>{showFilters ? "Close" : "Filters"}</span>
                                    </div>
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="hidden lg:block px-4 py-2 bg-white text-green-500 border border-green-500 rounded-md hover:bg-green-50 text-sm transition-colors whitespace-nowrap"
                                >
                                    Reset All
                                </button>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product) => {
                                    const isInStock = product.in_stock !== false && (product.stock_quantity > 0 || product.in_stock === true);
                                    
                                    return (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-lg overflow-hidden group relative border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col"
                                        >
                                            {/* Product Link */}
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="block flex-1"
                                            >
                                                <div className="relative bg-white h-60 sm:h-64 flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={
                                                            product.images &&
                                                            product.images.length > 0
                                                                ? `/storage/${product.images[0].image_path}`
                                                                : "https://via.placeholder.com/300x300?text=No+Image"
                                                        }
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {product.discount > 0 && (
                                                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black text-white px-1 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm font-semibold">
                                                            -{product.discount}%
                                                        </div>
                                                    )}
                                                    {!isInStock && (
                                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                            <span className="text-white font-bold text-lg bg-red-600 px-3 py-1 rounded">
                                                                Out of Stock
                                                            </span>
                                                        </div>
                                                    )}
                                                    {product.created_at &&
                                                        new Date(
                                                            product.created_at
                                                        ) >
                                                            new Date(
                                                                Date.now() -
                                                                    7 *
                                                                        24 *
                                                                        60 *
                                                                        60 *
                                                                        1000
                                                            ) && (
                                                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white px-1 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm font-semibold">
                                                            NEW
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3 sm:p-4 flex-1 flex flex-col items-center justify-between">
                                                    <h3 className="text-sm font-medium text-gray-900 mb-1 sm:mb-2 h-10 line-clamp-2 text-center">
                                                        {product.name}
                                                    </h3>
                                                    <div className="mb-1 sm:mb-2">
                                                        {renderStars(
                                                            product.rating
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        {product.discount > 0 && (
                                                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                                                                Rs.
                                                                {parseFloat(
                                                                    product.price
                                                                ).toLocaleString()}
                                                            </span>
                                                        )}
                                                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                                                            Rs.
                                                            {parseFloat(
                                                                product.discounted_price ??
                                                                    product.price
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                            {/* Action Icons */}
                                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button
                                                    onClick={(e) =>
                                                        handleWishlistToggle(
                                                            product,
                                                            e
                                                        )
                                                    }
                                                    className={`p-1.5 sm:p-2 rounded-full shadow-md transition-colors ${
                                                        isInWishlist(product.id)
                                                            ? "bg-pink-50 text-pink-500 hover:bg-pink-100"
                                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                                    }`}
                                                    aria-label={
                                                        isInWishlist(product.id)
                                                            ? "Remove from wishlist"
                                                            : "Add to wishlist"
                                                    }
                                                >
                                                    <Heart
                                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                                        fill={
                                                            isInWishlist(product.id)
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                    />
                                                </button>
                                                <button
                                                    onClick={(e) =>
                                                        handleAddToCart(product, e)
                                                    }
                                                    disabled={!isInStock}
                                                    className={`p-1.5 sm:p-2 rounded-full shadow-md transition-colors ${
                                                        isInStock
                                                            ? "bg-white text-gray-700 hover:bg-gray-100"
                                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                    aria-label="Add to cart"
                                                >
                                                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleShowDetails(product);
                                                    }}
                                                    className="bg-white p-1.5 sm:p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                                    aria-label="View details"
                                                >
                                                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                                                </button>
                                                <button
                                                    className="bg-white p-1.5 sm:p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                                    aria-label="View on external site"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
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
                            <div className="flex flex-col sm:flex-row items-center lg:justify-center gap-4 mb-8">
                                <div className="flex items-center gap-2">
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
                                    <div className="hidden md:flex gap-2">
                                        {renderPaginationButtons()}
                                    </div>
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
                                <div className="text-sm text-gray-600 md:hidden">
                                    Page {currentPage} of {totalPages}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />

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