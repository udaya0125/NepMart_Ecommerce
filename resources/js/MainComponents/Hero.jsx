import React, { useState, useEffect } from "react";
import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroSlides, setHeroSlides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use Effect for fetching hero slides
    useEffect(() => {
        const fetchHeroSlides = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching hero slides from:", route("ourhome.index"));
                const response = await axios.get(route("ourhome.index"));
                console.log("Hero slides response:", response.data);
                
                // Handle both response formats
                const slidesData = response.data.data || response.data;
                setHeroSlides(slidesData);
            } catch (err) {
                console.error("Fetching error:", err);
                console.error("Error response:", err.response);
                setError("Failed to load hero slides. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchHeroSlides();
    }, []);

    // Auto-slide effect - only run if we have slides
    useEffect(() => {
        if (heroSlides.length === 0) return;
        
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        
        return () => clearInterval(slideInterval);
    }, [heroSlides.length]);

    const prevSlide = () => {
        if (heroSlides.length === 0) return;
        setCurrentSlide((prev) =>
            prev === 0 ? heroSlides.length - 1 : prev - 1
        );
    };

    const nextSlide = () => {
        if (heroSlides.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const goToSlide = (index) => {
        if (heroSlides.length === 0) return;
        setCurrentSlide(index);
    };

    // Loading state
    if (loading) {
        return (
            <div className="relative w-full overflow-hidden">
                <div className="relative w-full h-screen flex items-center justify-center">
                    <div className="text-white text-xl">Loading hero slides...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="relative w-full overflow-hidden">
                <div className="relative w-full h-screen flex items-center justify-center">
                    <div className="text-white text-xl text-center">
                        {error}
                        <button 
                            onClick={() => window.location.reload()} 
                            className="ml-4 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all duration-300"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No slides state
    if (heroSlides.length === 0) {
        return (
            <div className="relative w-full overflow-hidden">
                <div className="relative w-full h-screen flex items-center justify-center">
                    <div className="text-white text-xl">No hero slides available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden">
            <div className="relative w-full h-screen">
                <div
                    className="flex transition-transform duration-700 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {heroSlides.map((slide, index) => (
                        <div
                            key={slide.id || index}
                            className="min-w-full h-full relative"
                            style={{
                                backgroundImage: `url(${`storage/${slide.image_path}`})`,
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

                {/* Navigation buttons - only show if we have multiple slides */}
                {heroSlides.length > 1 && (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Hero;