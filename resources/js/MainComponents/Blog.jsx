import React, { useState, useEffect } from "react";
import axios from "axios"; // Add this import
import {
    Calendar,
    User,
    ArrowRight,
    Tag,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import blogPosts from "../../JsonData/Blog.json";

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [allBlogs, setAllBlogs] = useState([]); // Add this state
    const [allCategory, setAllCategory] = useState([]); // Add this state
    const [loading, setLoading] = useState(false); // Add this state
    const [currentPage, setCurrentPage] = useState(0);
    const postsPerPage = 3;

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourblog.index"));
                const blogsData = Array.isArray(response.data)
                    ? response.data
                    : response.data.data || [];
                setAllBlogs(blogsData);
            } catch (error) {
                console.error("Fetching error", error);
                setAllBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("ourcategory.index"));
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllCategory([]);
            }
        };

        fetchBlogs();
        fetchCategory();
    }, []); // Remove reloadTrigger since it's not defined

    // Use API data if available, otherwise fall back to JSON
    useEffect(() => {
        if (allBlogs.length > 0) {
            // Transform API data to match the expected format
            const transformedPosts = allBlogs.map(blog => ({
                id: blog.id,
                title: blog.title,
                excerpt: blog.excerpt,
                author: blog.author,
                category: blog.category?.category|| 'Uncategorized', // Use category name
                readTime: blog.read_time,
                image: blog.image_url || blog.image, // Use image_url from accessor
                slug: blog.slug,
                date: new Date(blog.created_at).toLocaleDateString() // Add date from created_at
            }));
            setPosts(transformedPosts);
        } else {
            // Fall back to JSON data
            setPosts(blogPosts.blogPosts || []);
        }
    }, [allBlogs]);

    // Calculate total pages
    const totalPages = Math.ceil(posts.length / postsPerPage);

    // Navigation functions
    const nextSlide = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    // Get current posts to display
    const getCurrentPosts = () => {
        const startIndex = currentPage * postsPerPage;
        return posts.slice(startIndex, startIndex + postsPerPage);
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading blogs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Intro Section */}
                <header className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our Latest Blog
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nesciunt deleniti neque voluptatem iusto quod sint non,
                        quos autem, amet unde sequi maxime corrupti! At
                        voluptate commodi quod mollitia dicta impedit!
                    </p>
                </header>

                {/* Blog Grid with Carousel */}
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No blog posts found.</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Previous Button - Only show if there are multiple pages */}
                        {totalPages > 1 && currentPage > 0 && (
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                                aria-label="Previous posts"
                            >
                                <ChevronLeft className="w-8 h-8 text-gray-600" />
                            </button>
                        )}

                        {/* Blog Posts Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {getCurrentPosts().map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                                >
                                    <div className="relative overflow-hidden h-48">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                                            }}
                                        />
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                                <Tag
                                                    className="w-3 h-3"
                                                    aria-hidden="true"
                                                />
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center gap-2">
                                                <User
                                                    className="w-4 h-4"
                                                    aria-hidden="true"
                                                />
                                                <span>{post.author}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar
                                                    className="w-4 h-4"
                                                    aria-hidden="true"
                                                />
                                                <span>{post.date}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <span className="text-sm text-gray-500">
                                                {post.readTime}
                                            </span>

                                            <a
                                                href={`/blog-details/${post.slug}`}
                                                className="flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
                                                aria-label={`Read more about ${post.title}`}
                                            >
                                                Read More
                                                <ArrowRight
                                                    className="w-4 h-4"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Next Button - Only show if there are multiple pages */}
                        {totalPages > 1 && currentPage < totalPages - 1 && (
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                                aria-label="Next posts"
                            >
                                <ChevronRight className="w-8 h-8 text-gray-600" />
                            </button>
                        )}
                    </div>
                )}

                {/* Page Indicators - Only show if there are multiple pages */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentPage
                                        ? "bg-purple-600"
                                        : "bg-gray-300"
                                }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;