import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";
import { ArrowRight, Calendar, Tag, User, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import blogPosts from "../../../JsonData/Blog.json";
import { Link } from "@inertiajs/react";


const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
const postsPerPage = 6;

const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = blogPosts.blogPosts.slice(indexOfFirstPost, indexOfLastPost);
const totalPages = Math.ceil(blogPosts.blogPosts.length / postsPerPage);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const Pagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

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
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-2 rounded-lg border ${
                        currentPage === totalPages
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

    return (
        <div>
          <Navbar/>
            {/* Hero Section */}
            <div className="relative h-[550px] overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
                    alt="Blog hero image"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                        Our Blog
                    </h1>
                    <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">
                        Insights, trends, and stories from the world of style, tech, and lifestyle.
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
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {blog.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                                    {blog.title}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {blog.excerpt}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{blog.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{blog.date}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <span className="text-sm text-gray-500">
                                        {blog.readTime}
                                    </span>
                                    <Link
                                        href={`/blog-details/${blog.slug}`}
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
                <Pagination />              
            </div>
            <Footer/>
        </div>
    );
};

export default BlogPage;