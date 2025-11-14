import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Category = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const categories = [
        {
            name: "Watch",
            products: 17,
            image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop",
        },
        {
            name: "Fashion",
            products: 6,
            image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop",
        },
        {
            name: "Ethnic Wear",
            products: 4,
            image: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg",
        },
        {
            name: "Goggles",
            products: 10,
            image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
        },
        {
            name: "Bag",
            products: 4,
            image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop",
        },
        {
            name: "Shoes",
            products: 5,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        },
    ];

    const itemsPerView = 6; // Number of items to show at once
    const maxIndex = Math.ceil(categories.length / itemsPerView) - 1;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex <= 0 ? maxIndex : prevIndex - 1
        );
    };

    const getVisibleCategories = () => {
        const start = currentIndex * itemsPerView;
        return categories.slice(start, start + itemsPerView);
    };

    return (
        <div className=" bg-gray-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Best For Your Categories
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Mauris quis nisi elit curabitur sodales libero ac
                        interdum finibus.
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                        aria-label="Previous category"
                    >
                        <ChevronLeft className="w-8 h-8 text-gray-600" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
                        {getVisibleCategories().map((category, index) => (
                            <div
                                key={`${category.name}-${index}`}
                                className="flex flex-col items-center group cursor-pointer"
                            >
                                {/* Image Circle */}
                                <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full bg-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                </div>

                                {/* Category Info */}
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {category.products} Products
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                        aria-label="Next category"
                    >
                        <ChevronRight className="w-8 h-8 text-gray-600" />
                    </button>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentIndex
                                    ? "bg-gray-900"
                                    : "bg-gray-300"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Category;