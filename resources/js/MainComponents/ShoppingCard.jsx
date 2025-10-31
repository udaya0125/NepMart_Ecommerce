import React from "react";
import { X, ShoppingCart as CartIcon, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useCart } from "../contexts/CartContext"; 

const ShoppingCard = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, getCartTotalPrice } = useCart();

    const handleQuantityChange = (productId, newQuantity) => {
        updateQuantity(productId, newQuantity);
    };

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

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
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Shopping Cart
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {cart.items.length === 0 ? (
                            <div className="text-center text-gray-500 mt-20">
                                <CartIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg">Your cart is empty</p>
                                <p className="text-sm mt-2">
                                    Add items to get started
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                                    >
                                        <img
                                            src={item.images?.[0]}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-red-600 font-semibold">
                                                Rs.{item.price}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer - Only show when cart has items */}
                    {cart.items.length > 0 && (
                        <div className="border-t p-6">
                            <div className="flex justify-between mb-4">
                                <span className="text-lg font-semibold">
                                    Subtotal:
                                </span>
                                <span className="text-lg font-bold">
                                    Rs.{getCartTotalPrice().toFixed(2)}
                                </span>
                            </div>
                            <Link
                                href="/check-out"
                                className="w-full block text-center bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors mb-2"
                                onClick={onClose}
                            >
                                Checkout
                            </Link>
                            <button
                                onClick={onClose}
                                className="w-full text-center text-gray-600 py-2 rounded-lg font-medium hover:text-gray-800 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ShoppingCard;