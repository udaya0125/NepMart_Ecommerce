import React from "react";
import { XCircle, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/ContentWrapper/Navbar";
import Footer from "@/ContentWrapper/Footer";

const PaymentFailure = () => {
    const navigate = useNavigate();

    const handleRetryPayment = () => {
        navigate("/checkout");
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <>
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative h-48 md:h-64 overflow-hidden mb-8">
                <img
                    src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"
                    alt="Failure hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Payment Failed
                    </h1>
                    <p className="text-lg md:text-xl text-center max-w-2xl">
                        We couldn't process your payment
                    </p>
                </div>
            </div>

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Failure Header */}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center text-white">
                            <div className="flex justify-center mb-4">
                                <div className="bg-white rounded-full p-3">
                                    <XCircle size={48} className="text-red-500" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
                            <p className="text-red-100 text-lg">
                                We encountered an issue processing your payment
                            </p>
                        </div>

                        {/* Failure Content */}
                        <div className="p-8 text-center">
                            <div className="mb-6">
                                <p className="text-gray-600 mb-4">
                                    Your payment could not be processed. This could be due to:
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2 max-w-md mx-auto">
                                    <li>• Insufficient balance in your eSewa account</li>
                                    <li>• Network connectivity issues</li>
                                    <li>• Incorrect payment details</li>
                                    <li>• Temporary service unavailability</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Your cart items have been saved. You can retry the payment.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleRetryPayment}
                                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    Retry Payment
                                </button>
                                <button
                                    onClick={handleGoHome}
                                    className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    <Home size={20} />
                                    Return to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PaymentFailure;