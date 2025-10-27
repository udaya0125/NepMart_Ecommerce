import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const Testimonial = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            title: "Excellent Product, A+ Customer Service.",
            description:
                "The point of using Lorem Ipsum is that it has a more is normal they always wash up well no matter how many versions of Lorem Ipsum.",
            name: "Augusta Wind",
            rating: 3,
        },
        {
            id: 2,
            title: "Impressive Quality, Durable & Reliable",
            description:
                "The point of using Lorem Ipsum is that it has a more is normal they always wash up well no matter how many versions of Lorem Ipsum.",
            name: "Stefanie Rashford",
            rating: 3,
        },
        {
            id: 3,
            title: "Reliable Product, Consistently Delivers.",
            description:
                "The point of using Lorem Ipsum is that it has a more is normal they always wash up well no matter how many versions of Lorem Ipsum.",
            name: "Chelsea Handler",
            rating: 3,
        },
    ];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length
        );
    };

    const getVisibleTestimonials = () => {
        const visible = [];
        for (let i = 0; i < 3; i++) {
            visible.push(
                testimonials[(currentIndex + i) % testimonials.length]
            );
        }
        return visible;
    };

    const StarRating = ({ rating }) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={20}
                        fill={star <= rating ? "currentColor" : "none"}
                        color={star <= rating ? "#fbbf24" : "#d1d5db"}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Customer Review
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Corporis veniam nostrum quaerat doloribus
                        doloremque deserunt maxime ad minus, tempora
                        exercitationem officia odit, reprehenderit provident
                        dolor laborum modi cum, architecto quos!
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-8 h-8 text-gray-600" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {getVisibleTestimonials().map((testimonial, index) => (
                            <div
                                key={`${testimonial.id}-${index}`}
                                className="bg-white border border-gray-200 p-8 rounded-lg"
                            >
                                <div className="mb-6">
                                    <div className="w-14 h-14 flex items-center justify-center">
                                        <span className="text-3xl font-serif">
                                            <Quote />
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {testimonial.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {testimonial.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <span className="text-gray-900 font-medium">
                                        - {testimonial.name}
                                    </span>
                                    <StarRating rating={testimonial.rating} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-8 h-8 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Testimonial;
