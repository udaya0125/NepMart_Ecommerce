import React, { useState } from "react";
import { Calendar, User, ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";

const Blog = () => {
    const blogPosts = [
        {
            id: 1,
            title: "Top 10 Fashion Trends for Fall 2025",
            excerpt:
                "Discover the hottest fashion trends this season, from cozy knits to bold patterns that will elevate your wardrobe.",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
            author: "Sarah Johnson",
            date: "Oct 12, 2025",
            category: "Fashion",
            readTime: "5 min read",
        },
        {
            id: 2,
            title: "Smart Home Gadgets Worth Your Investment",
            excerpt:
                "Explore the latest smart home technology that combines convenience, security, and energy efficiency.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
            author: "Michael Chen",
            date: "Oct 10, 2025",
            category: "Electronics",
            readTime: "7 min read",
        },
        {
            id: 3,
            title: "Sustainable Shopping: A Complete Guide",
            excerpt:
                "Learn how to make eco-friendly choices while shopping online and support brands that care about the planet.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
            author: "Emma Green",
            date: "Oct 8, 2025",
            category: "Lifestyle",
            readTime: "6 min read",
        },
        {
            id: 4,
            title: "Essential Kitchen Tools Every Home Chef Needs",
            excerpt:
                "Upgrade your cooking game with these must-have kitchen gadgets and tools for the modern home chef.",
            image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
            author: "David Miller",
            date: "Oct 5, 2025",
            category: "Home & Kitchen",
            readTime: "4 min read",
        },
        {
            id: 5,
            title: "Beauty Hacks: Budget-Friendly Skincare Routine",
            excerpt:
                "Achieve glowing skin without breaking the bank with these affordable skincare tips and product recommendations.",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
            author: "Lisa Anderson",
            date: "Oct 3, 2025",
            category: "Beauty",
            readTime: "5 min read",
        },
        {
            id: 6,
            title: "Fitness Tech: Best Wearables of 2025",
            excerpt:
                "Compare the top fitness trackers and smartwatches to find the perfect companion for your wellness journey.",
            image: "https://images.unsplash.com/photo-1575313281549-6071bc7cfd9b?w=800&q=80",
            author: "Ryan Taylor",
            date: "Oct 1, 2025",
            category: "Electronics",
            readTime: "6 min read",
        },
    ];

    // State to track current slide/page for carousel functionality
    const [currentPage, setCurrentPage] = useState(0);
    const postsPerPage = 3; // Show 3 posts at a time

    // Calculate total pages
    const totalPages = Math.ceil(blogPosts.length / postsPerPage);

    // Navigation functions
    const nextSlide = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevSlide = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    // Get current posts to display
    const getCurrentPosts = () => {
        const startIndex = currentPage * postsPerPage;
        return blogPosts.slice(startIndex, startIndex + postsPerPage);
    };

    return (
        <div className=" bg-gradient-to-br from-gray-50 to-gray-100">
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
                <div className="relative">
                    {/* Previous Button - Only show if there are multiple pages */}
                    {totalPages > 1 && (
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
                                            href={`/blog/${post.id}`}
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
                    {totalPages > 1 && (
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                            aria-label="Next posts"
                        >
                            <ChevronRight className="w-8 h-8 text-gray-600" />
                        </button>
                    )}
                </div>

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