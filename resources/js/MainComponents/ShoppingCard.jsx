import React from "react";
import { X, ShoppingCart as CartIcon, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useCart } from "../contexts/CartContext"; 

const ShoppingCard = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, getCartTotalPrice } = useCart();

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        // Ensure we have a valid cartItemId
        if (!cartItemId) {
            console.error('No cartItemId provided');
            return;
        }
        
        try {
            await updateQuantity(cartItemId, newQuantity);
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity. Please try again.');
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        if (!cartItemId) {
            console.error('No cartItemId provided');
            return;
        }
        
        try {
            await removeFromCart(cartItemId);
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item. Please try again.');
        }
    };

    // Helper function to get the correct cart item ID
    const getCartItemId = (item) => {
        // Priority: cartItemId -> id -> generate temporary ID
        const id = item.cartItemId || item.id;
        if (!id) {
            console.warn('No ID found for cart item:', item);
            return `temp-${Date.now()}`;
        }
        return String(id); // Ensure it's always a string
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
                                {cart.items.map((item) => {
                                    const cartItemId = getCartItemId(item);
                                    return (
                                        <div
                                            key={cartItemId}
                                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                                        >
                                            <img
                                                src={`storage/${item.images?.[0]}`}
                                                alt={item.name || item.product_name}
                                                className="w-16 h-16 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                                                    {item.name || item.product_name}
                                                </h3>
                                                <p className="text-red-600 font-semibold">
                                                    Rs.{item.discounted_price || item.price}
                                                </p>
                                                
                                                {/* Display size and color if available */}
                                                {(item.size || item.color) && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {item.size && <span>Size: {item.size}</span>}
                                                        {item.size && item.color && <span> • </span>}
                                                        {item.color && <span>Color: {item.color}</span>}
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(cartItemId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                                            item.quantity <= 1 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-gray-200 hover:bg-gray-300'
                                                        }`}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(cartItemId, item.quantity + 1)}
                                                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(cartItemId)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
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
                                href="/cart"
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