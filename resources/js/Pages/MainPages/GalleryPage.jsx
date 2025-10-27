import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/ContentWrapper/Navbar";

const Photo = () => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        {
            thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600",
        },
        {
            thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600",
        },
        {
            thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600",
        },
        {
            thumbnail: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500",
            image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600",
        },
        {
            thumbnail: "https://images.unsplash.com/photo-1536305030015-6c61b290b654?w=500",
            image: "https://images.unsplash.com/photo-1536305030015-6c61b290b654?w=1600",
        },
        {
            thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
            image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1600",
        },
        {
            thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
            image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1600",
        },
        {
            thumbnail: "https://images.unsplash.com/photo-1585386959984-a4155223f6aa?w=500",
            image: "https://images.unsplash.com/photo-1585386959984-a4155223f6aa?w=1600",
        },
    ];

    const openLightbox = (index) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div>
          <Navbar/>
            {/* Hero Section */}
            <div className="relative h-[550px] overflow-hidden">
                <img
                    src={images[0].image}
                    alt="Gallery hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                        Our Gallery
                    </h1>
                    <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">
                        Discover our premium quality products and showcases
                    </p>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-lg cursor-pointer group"
                            onClick={() => openLightbox(index)}
                        >
                            <img
                                src={img.thumbnail}
                                alt={`Gallery item ${index + 1}`}
                                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <ChevronRight size={48} />
                    </button>

                    <img
                        src={images[currentIndex].image}
                        alt={`Gallery item ${currentIndex + 1}`}
                        className="max-w-[90%] max-h-[90vh] object-contain"
                    />

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Photo;