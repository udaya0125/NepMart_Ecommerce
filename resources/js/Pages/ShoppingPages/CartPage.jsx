import React, { useState } from "react";
import { Heart, Trash2, Plus, Minus } from "lucide-react";
import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";
import { useCart } from "../../Contexts/CartContext";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, getCartTotalPrice } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [voucherCode, setVoucherCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const { auth } = usePage().props;

    const toggleLike = (id) => {
        console.log("Toggle like for item:", id);
    };

    // Helper function to get the correct cart item ID
    const getCartItemId = (item) => {
        const id = item.cartItemId || item.id;
        if (!id) {
            console.warn('No ID found for cart item:', item);
            return `temp-${Date.now()}`;
        }
        return String(id);
    };

    const handleUpdateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity > 0) {
            updateQuantity(cartItemId, newQuantity);
        }
    };

    const handleRemoveItem = (cartItemId) => {
        removeFromCart(cartItemId);
    };

    const handleClearCart = () => {
        clearCart();
    };

    const handleApplyVoucher = () => {
        console.log("Applying voucher:", voucherCode);
    };

    // Generate a unique order ID
    const generateOrderId = () => {
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    };

    // Store COD order in database
    const storeCODOrder = async () => {
        if (cart.items.length === 0) {
            alert("No items in cart");
            return;
        }

        setIsProcessing(true);

        try {
            const subtotal = getCartTotalPrice();
            const shipping = calculateShippingFee();
            const total = subtotal + shipping;
            const orderId = generateOrderId();

            // Get user email from auth or use a default
            const userEmail = auth.user?.email || 'guest@example.com';
            const userName = auth.user?.name || 'Guest';

            // Prepare order items data - FIXED: Added user_email field
            const orderItemsData = cart.items.map(item => ({
                user_name: userName,
                user_email: userEmail,
                product_id: item.id || item.product_id || 0,
                product_name: item.name || item.product_name || 'Unknown Product',
                payment_method: "COD",
                product_sku: item.product_sku || 'N/A',
                product_brand: item.product_brand || 'Unknown Brand',
                quantity: item.quantity,
                price: item.price,
                discounted_price: item.discounted_price || item.price,
                size: item.size || 'One Size',
                color: item.color || 'Default',
                order_id: orderId,
            }));

            console.log("Sending order data:", orderItemsData);

            // Send each order item individually
            const orderPromises = orderItemsData.map(orderItem => 
                axios.post(route('ourorder.store'), orderItem)
            );

            await Promise.all(orderPromises);
            
            // Clear cart after successful order placement
            clearCart();
            
            alert(`COD Order placed successfully! Order ID: ${orderId}\nTotal: Rs. ${total}`);
            
            // Redirect to home page or orders page
            window.location.href = '/';

        } catch (error) {
            console.error("Error placing COD order:", error);
            if (error.response) {
                console.error("Backend validation errors:", error.response.data);
                if (error.response.data.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
                    alert(`Failed to place order: ${errorMessages}`);
                } else {
                    alert(`Failed to place order: ${error.response.data.message || 'Unknown error'}`);
                }
            } else {
                alert("Failed to place order. Please check your connection and try again.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // Shipping fee calculation
    const calculateShippingFee = () => {
        if (paymentMethod === 'cod') {
            return 100;
        }
        return 0;
    };

    const subtotal = getCartTotalPrice();
    const shipping = calculateShippingFee();
    const total = subtotal + shipping;

    console.log("Rendering CartPage with cart:", cart);

    return (
        <div>
            <Navbar />
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 overflow-hidden mb-8">
                <img
                    src="https://images.pexels.com/photos-1525612/pexels-photo-1525612.jpeg"
                    alt="Shopping hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                        Shopping Cart
                    </h1>
                    <p className="text-xl md:text-2xl text-center max-w-2xl">
                        Review and manage your selected items
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 sticky top-20 self-start">
                        <div className="bg-white rounded-lg p-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Cart Items ({cart.totalItems})
                                </h2>
                                {cart.items.length > 0 && (
                                    <button 
                                        onClick={handleClearCart}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        CLEAR ALL
                                    </button>
                                )}
                            </div>

                            {cart.items.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">
                                        Your cart is empty
                                    </p>
                                    <Link 
                                        href="/"
                                        className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.items.map((item) => {
                                        const cartItemId = getCartItemId(item);
                                        return (
                                            <div
                                                key={cartItemId}
                                                className="border border-gray-200 rounded-lg p-4 flex gap-4"
                                            >
                                                {/* <input
                                                    type="checkbox"
                                                    className="w-5 h-5 mt-1"
                                                    defaultChecked
                                                /> */}

                                                <img
                                                    src={`storage/${item.images}`}
                                                    alt={item.name || item.product_name}
                                                    className="w-24 h-24 object-cover rounded"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-image.jpg';
                                                    }}
                                                />

                                                <div className="flex-1">
                                                    <a
                                                        href="#"
                                                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm mb-1 block"
                                                    >
                                                        {item.product_brand || 'Brand'}
                                                    </a>
                                                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                                        {item.name || item.product_name}
                                                    </h3>
                                                    
                                                    {/* Display size and color if available */}
                                                    {(item.size || item.color) && (
                                                        <div className="text-xs text-gray-500 mb-2">
                                                            {item.size && <span>Size: {item.size}</span>}
                                                            {item.size && item.color && <span> • </span>}
                                                            {item.color && <span>Color: {item.color}</span>}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <p className="text-lg font-bold text-orange-500">
                                                                Rs.{" "}
                                                                {item.discounted_price || item.price}
                                                            </p>
                                                            {item.discounted_price && item.discounted_price !== item.price && (
                                                                <p className="text-sm text-gray-400 line-through">
                                                                    Rs.{" "}
                                                                    {item.price}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center border border-gray-300 rounded">
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        cartItemId,
                                                                        item.quantity - 1
                                                                    )
                                                                }
                                                                disabled={item.quantity <= 1}
                                                                className={`p-1 ${
                                                                    item.quantity <= 1 
                                                                        ? 'text-gray-400 cursor-not-allowed' 
                                                                        : 'hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                <Minus size={16} />
                                                            </button>
                                                            <span className="px-3 py-1 font-medium">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        cartItemId,
                                                                        item.quantity + 1
                                                                    )
                                                                }
                                                                className="p-1 hover:bg-gray-100"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    {/* <button
                                                        onClick={() =>
                                                            toggleLike(cartItemId)
                                                        }
                                                        className="p-2 hover:bg-gray-100 rounded"
                                                    >
                                                        <Heart
                                                            size={20}
                                                            fill={
                                                                item.liked
                                                                    ? "currentColor"
                                                                    : "none"
                                                            }
                                                            className={
                                                                item.liked
                                                                    ? "text-red-500"
                                                                    : "text-gray-400"
                                                            }
                                                        />
                                                    </button> */}
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveItem(cartItemId)
                                                        }
                                                        className="p-2 hover:bg-red-50 rounded text-red-500"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 sticky top-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            {/* Payment Method Selection */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Payment Method
                                </h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-orange-500"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">
                                                Cash On Delivery
                                            </span>
                                            <p className="text-sm text-gray-500">
                                                Pay when you receive the order
                                            </p>
                                            {shipping > 0 && (
                                                <p className="text-sm text-red-500 font-medium">
                                                    + Rs. {shipping} shipping fee
                                                </p>
                                            )}
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-orange-500"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">
                                                Online Payment (eSewa)
                                            </span>
                                            <p className="text-sm text-gray-500">
                                                Secure payment via eSewa
                                            </p>
                                            {shipping === 0 && (
                                                <p className="text-sm text-green-500 font-medium">
                                                    Free shipping
                                                </p>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal ({cart.totalItems} items)
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        Rs. {subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Shipping Fee
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {shipping === 0 ? (
                                            <span className="text-green-500">FREE</span>
                                        ) : (
                                            `Rs. ${shipping}`
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Enter Voucher Code"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
                                />
                                <button 
                                    onClick={handleApplyVoucher}
                                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg"
                                >
                                    APPLY
                                </button>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-xl font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-orange-500">
                                        Rs. {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Conditional Checkout Button */}
                            {paymentMethod === 'online' ? (
                                <Link 
                                    href={'/check-out'} 
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-center block"
                                >
                                    PROCEED TO CHECKOUT ({cart.totalItems})
                                </Link>
                            ) : (
                                <button 
                                    onClick={storeCODOrder}
                                    disabled={isProcessing || cart.items.length === 0}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        `PLACE ORDER (COD) - Rs. ${total.toFixed(2)}`
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;