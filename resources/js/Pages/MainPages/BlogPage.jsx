import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";
import {
    ArrowRight,
    Calendar,
    Tag,
    User,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import axios from "axios";

const BlogPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [allBlogs, setAllBlogs] = useState([]);
    const [allCategory, setAllCategory] = useState([]); // Fixed: Added missing state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const postsPerPage = 6;

    // Fetch blogs and categories from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Fetch blogs and categories concurrently
                const [blogsResponse, categoriesResponse] = await Promise.all([
                    axios.get(route("ourblog.index")),
                    axios.get(route("ourcategory.index"))
                ]);

                // Process blogs data
                const blogsData = Array.isArray(blogsResponse.data)
                    ? blogsResponse.data
                    : blogsResponse.data?.data || [];
                setAllBlogs(blogsData);

                // Process categories data
                const categoriesData = Array.isArray(categoriesResponse.data)
                    ? categoriesResponse.data
                    : categoriesResponse.data?.data || [];
                setAllCategory(categoriesData);

            } catch (error) {
                console.error("Fetching error", error);
                setError("Failed to load content. Please try again later.");
                setAllBlogs([]);
                setAllCategory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get category name by ID
    const getCategoryName = (categoryId) => {
        const category = allCategory.find(cat => cat.id === categoryId);
        return category?.name || "Uncategorized";
    };

    // Format date if needed
    const formatDate = (dateString) => {
        if (!dateString) return "Unknown date";
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Pagination calculations
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = allBlogs.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(allBlogs.length / postsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const Pagination = () => {
        const pageNumbers = [];
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
            pageNumbers.push(i);
        }


        console.log(allBlogs)

        return (
            <div className="flex justify-center items-center space-x-2 mt-12">
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-2 rounded-lg border ${
                        currentPage === 1
                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                            : "text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600"
                    }`}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                </button>

                {/* Page Numbers */}
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className={`px-3 py-2 rounded-lg border ${
                                1 === currentPage
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300"
                            }`}
                        >
                            1
                        </button>
                        {startPage > 2 && (
                            <span className="px-2 py-2 text-gray-500">...</span>
                        )}
                    </>
                )}

                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`px-3 py-2 rounded-lg border ${
                            number === currentPage
                                ? "bg-purple-600 text-white border-purple-600"
                                : "text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300"
                        }`}
                    >
                        {number}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <span className="px-2 py-2 text-gray-500">...</span>
                        )}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className={`px-3 py-2 rounded-lg border ${
                                totalPages === currentPage
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300"
                            }`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next Button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`flex items-center px-3 py-2 rounded-lg border ${
                        currentPage === totalPages || totalPages === 0
                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                            : "text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600"
                    }`}
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse"
                            >
                                <div className="h-48 bg-gray-300"></div>
                                <div className="p-6">
                                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div>
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-red-800 mb-4">
                            Oops! Something went wrong
                        </h2>
                        <p className="text-red-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Empty state
    if (allBlogs.length === 0) {
        return (
            <div>
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            No Blog Posts Yet
                        </h2>
                        <p className="text-gray-600 text-lg mb-6">
                            Check back later for new blog posts!
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            {/* Hero Section */}
            <div
                className="relative h-96 overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage:
                        'url("https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
                }}
            >
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-wide">
                        Our Blog
                    </h1>
                    <p className="text-lg md:text-xl text-gray-100 mb-6">
                        Insights, trends, and stories from the world of style,
                        tech, and lifestyle.
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentPosts.map((blog) => (
                        <article
                            key={blog.id}
                            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                        >
                            <div className="relative overflow-hidden h-48">
                                <img
                                    src={blog?.image}
                                    alt={blog.title || "Blog post image"}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                    
                                />

                                <div className="absolute top-4 right-4">
                                    <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {blog.category?.category || "Uncategorized"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                                    {blog.title || "Untitled Post"}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {blog.excerpt || blog.content?.substring(0, 100) + "..." || "No description available."}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{blog.author || "Unknown Author"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(blog.created_at)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <span className="text-sm text-gray-500">
                                        {blog.read_time || "5 min read"}
                                    </span>
                                    <Link
                                        href={blog.slug ? `/blog-details/${blog.slug}` : `/blog-details/${blog.id}`}
                                        className="flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
                                    >
                                        Read More
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && <Pagination />}
            </div>
            <Footer />
        </div>
    );
};

export default BlogPage;