import React from "react";
import { XCircle, ArrowLeft, Home, X } from "lucide-react";
import { Link } from "@inertiajs/react";

const PaymentFailure = ({ onClose, onRetry }) => {
    const handleGoHome = () => {
        window.location.href = "/";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Payment Failed
                    </h2>
                    <Link
                        href="/"
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                        <X size={24} />
                    </Link>
                </div>

                {/* Failure Content */}
                <div className="text-center">
                    {/* Failure Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 rounded-full p-3">
                            <XCircle size={48} className="text-red-500" />
                        </div>
                    </div>

                    {/* Failure Message */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Payment Failed
                    </h3>
                    <p className="text-gray-600 mb-4">
                        We couldn't process your payment. Please try again.
                    </p>

                    {/* Possible Reasons */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            This could be due to:
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>
                                • Insufficient balance in your eSewa account
                            </li>
                            <li>• Network connectivity issues</li>
                            <li>• Incorrect payment details</li>
                            <li>• Temporary service unavailability</li>
                        </ul>
                    </div>

                    {/* Note */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <p className="text-xs text-yellow-800">
                            <strong>Note:</strong> Your cart items have been
                            saved. You can retry the payment.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onRetry}
                            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Retry Payment
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                        >
                            <Home size={16} />
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
