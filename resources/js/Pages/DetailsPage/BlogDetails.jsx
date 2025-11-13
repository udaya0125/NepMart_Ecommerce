import React, { useState, useEffect } from "react";
import { Calendar, User, ArrowLeft, Share2, MessageCircle, Heart, Clock, Tag } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";

const BlogDetails = () => {
    const [blog, setBlog] = useState(null);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("content");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(route("ourblog.index"));
                const blogsData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.data || [];
                setAllBlogs(blogsData);
            } catch (error) {
                console.error("Fetching error", error);
                setAllBlogs([]);
            }
        };

        fetchBlogs();
    }, []);

    useEffect(() => {
        const loadBlog = async () => {
            setLoading(true);
            
            // Get slug from URL path
            const pathParts = window.location.pathname.split('/');
            const slug = pathParts[pathParts.length - 1];
            
            if (!slug) {
                setBlog(null);
                setLoading(false);
                return;
            }
            
            try {
                // Fetch all blogs first
                const response = await axios.get(route("ourblog.index"));
                const blogsData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.data || [];
                
                // Find blog by slug
                const foundBlog = blogsData.find(post => post.slug === slug);
                setBlog(foundBlog);
                setAllBlogs(blogsData);
            } catch (error) {
                console.error("Error fetching blog:", error);
                setBlog(null);
            } finally {
                setLoading(false);
            }
        };

        loadBlog();
    }, []);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get image URL - handle storage paths
    const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-blog-image.jpg'; // fallback
    if (imagePath.startsWith('http')) return imagePath; // full URL case
    return `/${imagePath}`; // for paths like uploads/blogs/xxx.jpg
};


    console.log(allBlogs)

    // Get category name
    const getCategoryName = (blog) => {
        return blog.category?.category || 'Uncategorized';
    };

    // Sanitize and render HTML content
    const renderHTML = (htmlContent) => {
        if (!htmlContent) return null;
        
        return (
            <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        );
    };

    // Parse key features from HTML string
    const parseKeyFeatures = (keyFeaturesHtml) => {
        if (!keyFeaturesHtml) return [];
        
        try {
            // Extract text content from HTML and split by commas
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = keyFeaturesHtml;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            
            // Split by commas and clean up
            return textContent
                .split(',')
                .map(feature => feature.trim().replace(/^"|"$/g, '').replace(/^&nbsp;|^\\"/g, ''))
                .filter(feature => feature.length > 0);
        } catch (error) {
            console.error('Error parsing key features:', error);
            return [];
        }
    };

    // Get related posts
    const relatedPosts = blog ? allBlogs
        .filter(post => post.id !== blog.id && post.category_id === blog.category_id)
        .slice(0, 3) : [];

    // Early return if blog not found
    if (loading) {
        return (
            <div className="bg-gray-50 text-gray-800 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <div className="text-gray-500 text-lg">Loading blog post...</div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="bg-gray-50 text-gray-800 min-h-screen">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
                    <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const keyFeaturesList = parseKeyFeatures(blog.key_features);

    return (
        <div className="bg-gray-50 text-gray-800">
            <Navbar />
            
            {/* ===== HERO SECTION ===== */}
            <div className="relative h-[500px] overflow-hidden">
                <img
                    src={getImageUrl(blog.image)}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                    <div className="mb-4">
                        <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            {getCategoryName(blog)}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-4xl">
                        {blog.title}
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl">
                        {blog.excerpt}
                    </p>
                </div>
            </div>

            {/* ===== MAIN CONTENT SECTION ===== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Side - Blog Content */}
                    <div className="lg:col-span-2">
                        {/* Back Button */}
                        <div className="mb-6">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Blog
                            </Link>
                        </div>

                        {/* Blog Content Card */}
                        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                            {/* Author & Meta Info */}
                            <div className="p-8 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <User className="w-4 h-4" />
                                            <span className="font-medium">{blog.author}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(blog.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{blog.read_time}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                                            <Heart size={18} />
                                            Like
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                                            <Share2 size={18} />
                                            Share
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                                            <MessageCircle size={18} />
                                            Comment
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs Section */}
                            <div className="border-b border-gray-200">
                                <div className="flex gap-8 px-8 overflow-x-auto">
                                    {[
                                        { id: "content", label: "Content" },
                                        { id: "discussion", label: "Discussion" },
                                        { id: "related", label: "Related" },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-5 px-2 font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                                                activeTab === tab.id
                                                    ? "border-purple-600 text-purple-600"
                                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                {activeTab === "content" && (
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                                            {blog.excerpt}
                                        </p>

                                        {/* Excerpt or highlight section */}
                                        <blockquote className="border-l-4 border-purple-500 pl-6 italic text-gray-600 bg-purple-50 py-6 px-6 rounded-md my-8">
                                            "{blog.excerpt}"
                                        </blockquote>

                                        {/* Main Content */}
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Introduction
                                            </h2>
                                            {renderHTML(blog.introduction)}

                                            {keyFeaturesList.length > 0 && (
                                                <>
                                                    <h2 className="text-2xl font-bold text-gray-900">
                                                        Key Features
                                                    </h2>
                                                    <div className="bg-gray-50 p-6 rounded-xl">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                                            Summary
                                                        </h3>
                                                        <ul className="space-y-3">
                                                            {keyFeaturesList.map((feature, index) => (
                                                                <li key={index} className="flex items-center gap-3">
                                                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                                                    <span className="text-gray-700">
                                                                        {feature}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "discussion" && (
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Discussion
                                        </h3>
                                        <div className="text-center py-8 text-gray-500">
                                            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p>No comments yet. Be the first to start the discussion!</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "related" && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            More from {getCategoryName(blog)}
                                        </h3>
                                        <div className="space-y-4">
                                            {relatedPosts.map((relatedBlog) => (
                                                <Link
                                                    key={relatedBlog.id}
                                                    href={`/blog-details/${relatedBlog.slug}`}
                                                    className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={getImageUrl(relatedBlog.image)}
                                                            alt={relatedBlog.title}
                                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                                {relatedBlog.title}
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                <span>{formatDate(relatedBlog.created_at)}</span>
                                                                <span>•</span>
                                                                <span>{relatedBlog.read_time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Sidebar */}
                    <div className="space-y-6 sticky top-20 self-start">
                        {/* Author Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">About the Author</h3>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="font-semibold text-white text-sm">
                                        {blog.author?.charAt(0) || "A"}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{blog.author}</div>
                                    <div className="text-sm text-gray-600">Blog Writer</div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                Passionate about sharing insights and trends in {getCategoryName(blog).toLowerCase()}.
                            </p>
                        </div>

                        {/* Category Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-purple-600" />
                                <span className="text-gray-700">{getCategoryName(blog)}</span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Reading Stats</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Reading Time</span>
                                    <span className="font-medium text-gray-900">{blog.read_time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Published</span>
                                    <span className="font-medium text-gray-900">{formatDate(blog.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category</span>
                                    <span className="font-medium text-gray-900">{getCategoryName(blog)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== RELATED POSTS SECTION ===== */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
                        You May Also Like
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {allBlogs
                            .filter((post) => post.id !== blog.id)
                            .slice(0, 3)
                            .map((relatedBlog) => (
                                <Link
                                    key={relatedBlog.id}
                                    href={`/blog-details/${relatedBlog.slug}`}
                                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                                >
                                    <img
                                        src={getImageUrl(relatedBlog.image)}
                                        alt={relatedBlog.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-semibold">
                                                {getCategoryName(relatedBlog)}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {relatedBlog.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                            {relatedBlog.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{formatDate(relatedBlog.created_at)}</span>
                                            <span>{relatedBlog.read_time}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BlogDetails;