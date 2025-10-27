import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

const ReviewNotification = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [timeLeft, setTimeLeft] = useState(6000);

    const reviews = [
        {
            id: 1,
            customerName: "Danish",
            rating: 5,
            product: "Longines Watchmaking Tradition",
            detail: "25.5 mm Watch",
            timeAgo: "5 hours ago",
            verified: true,
            image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&h=100&fit=crop"
        },
        {
            id: 2,
            customerName: "Sarah",
            rating: 5,
            product: "Rolex Submariner Date",
            detail: "41 mm Steel Watch",
            timeAgo: "2 hours ago",
            verified: true,
            image: "https://images.unsplash.com/photo-1587836374455-c4845425d1ae?w=100&h=100&fit=crop"
        },
        {
            id: 3,
            customerName: "Michael",
            rating: 5,
            product: "Omega Seamaster Professional",
            detail: "42 mm Ceramic Watch",
            timeAgo: "1 hour ago",
            verified: true,
            image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=100&h=100&fit=crop"
        },
        {
            id: 4,
            customerName: "Emma",
            rating: 5,
            product: "Cartier Tank Must",
            detail: "29.5 mm Gold Watch",
            timeAgo: "30 minutes ago",
            verified: true,
            image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=100&h=100&fit=crop"
        }
    ];

    // Handle countdown timer
    useEffect(() => {
        if (isVisible && !isPaused) {
            const interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 100) {
                        clearInterval(interval);
                        setIsVisible(false);
                        return 6000;
                    }
                    return prev - 100;
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isVisible, isPaused]);

    // Show next notification after 3 minutes
    useEffect(() => {
        if (!isVisible) {
            const showTimer = setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
                setTimeLeft(6000);
                setIsVisible(true);
            }, 180000);

            return () => clearTimeout(showTimer);
        }
    }, [isVisible, reviews.length]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[...Array(rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
            </div>
        );
    };

    if (!isVisible) return null;

    const currentReview = reviews[currentIndex];
    const progressPercent = (timeLeft / 6000) * 100;

    return (
        <div
            className="fixed bottom-5 left-5 z-50 animate-slide-in"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="bg-white rounded-lg shadow-2xl w-96 overflow-hidden border border-gray-100 cursor-pointer">
                <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">
                                {currentReview.customerName} just rated {currentReview.rating} star
                            </span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close notification"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-shrink-0">
                            <img
                                src={currentReview.image}
                                alt={currentReview.product}
                                className="w-20 h-20 object-cover rounded-md bg-gray-100"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                                {currentReview.product}
                            </h3>
                            <p className="text-xs text-gray-600 mb-2">
                                {currentReview.detail}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">
                                        {currentReview.timeAgo}
                                    </span>
                                    {currentReview.verified && (
                                        <div className="flex items-center gap-1">
                                            <CheckCircle size={12} className="text-green-500" />
                                            <span className="text-xs text-green-600 font-medium">
                                                Verified
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {renderStars(currentReview.rating)}
                </div>

                <div className="h-1 bg-gray-200">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                        style={{
                            width: `${progressPercent}%`,
                            transitionDuration: isPaused ? '0ms' : '100ms',
                            transitionTimingFunction: 'linear'
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .animate-slide-in {
                    animation: slide-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ReviewNotification;