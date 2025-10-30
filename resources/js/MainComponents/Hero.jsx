import React, { useState, useEffect } from "react";
import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            title: "Summer Collection 2025",
            subtitle: "Trending Fashion & Accessories",
            description: "Discover the hottest styles of the season with up to 50% off",
            buttonText: "Shop Now",
            image: "https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg"
        },
        {
            title: "New Arrivals",
            subtitle: "Premium Quality Products",
            description: "Elevate your lifestyle with our exclusive collection",
            buttonText: "Explore Collection",
            image: "https://images.pexels.com/photos/8169649/pexels-photo-8169649.jpeg"
        },
        {
            title: "Limited Time Offer",
            subtitle: "Flash Sale Ends Soon",
            description: "Get amazing deals on selected items before they're gone",
            buttonText: "Grab Deals",
            image: "https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
        },
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [heroSlides.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? heroSlides.length - 1 : prev - 1
        );
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative w-full  overflow-hidden">
            <div className="relative w-full h-screen">
                <div
                    className="flex transition-transform duration-700 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {heroSlides.map((slide, index) => (
                        <div
                            key={index}
                            className="min-w-full h-full relative"
                            style={{
                                backgroundImage: `url(${slide.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            <div className="absolute inset-0 bg-black/40"></div>

                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center text-center px-4 md:px-6 text-white z-10">
                                <div className="max-w-5xl w-full space-y-6">
                                    <div className="flex justify-center space-x-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-6 h-6 text-yellow-400 fill-yellow-400"
                                                size={24}
                                            />
                                        ))}
                                    </div>

                                    <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                                        <span className="text-sm md:text-base font-semibold uppercase tracking-wider">
                                            {slide.title}
                                        </span>
                                    </div>

                                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 leading-tight uppercase tracking-tight">
                                        {slide.subtitle}
                                    </h1>

                                    <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                                        {slide.description}
                                    </p>



                                    <div className="flex justify-center items-center gap-8 md:gap-16 mt-12 pt-8 border-t border-white/20">
                                        <div>
                                            <p className="text-3xl md:text-4xl font-bold">5K+</p>
                                            <p className="text-sm md:text-base opacity-80">Products</p>
                                        </div>
                                        <div className="h-12 w-px bg-white/30"></div>
                                        <div>
                                            <p className="text-3xl md:text-4xl font-bold">100K+</p>
                                            <p className="text-sm md:text-base opacity-80">Customers</p>
                                        </div>
                                        <div className="h-12 w-px bg-white/30"></div>
                                        <div>
                                            <p className="text-3xl md:text-4xl font-bold">4.9★</p>
                                            <p className="text-sm md:text-base opacity-80">Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={prevSlide}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-4 transition-all duration-300 hover:scale-110 z-20 rounded-full hidden lg:block"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-4 transition-all duration-300 hover:scale-110 z-20 rounded-full hidden lg:block"
                >
                    <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                currentSlide === index
                                    ? "bg-white w-12 h-3"
                                    : "bg-white/50 hover:bg-white/75 w-3 h-3"
                            }`}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;