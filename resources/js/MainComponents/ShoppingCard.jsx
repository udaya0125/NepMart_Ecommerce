import React from "react";
import { X, ShoppingCart as CartIcon } from "lucide-react";
import { Link } from "@inertiajs/react";

const ShoppingCard = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Shopping Cart
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="text-center text-gray-500 mt-20">
                            <CartIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg">Your cart is empty</p>
                            <p className="text-sm mt-2">
                                Add items to get started
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t p-6">
                        <div className="flex justify-between mb-4">
                            <span className="text-lg font-semibold">
                                Subtotal:
                            </span>
                            <span className="text-lg font-bold">$0.00</span>
                        </div>
                        <Link
                            href="/check-out"
                            className="w-full block text-center bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShoppingCard;
