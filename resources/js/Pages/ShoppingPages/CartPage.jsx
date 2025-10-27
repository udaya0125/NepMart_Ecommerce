import React, { useState } from "react";
import { Heart, Trash2, Plus, Minus } from "lucide-react";
import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";

const CartPage = () => {
    const [items, setItems] = useState([
        {
            id: 1,
            name: "FANTECH (HQ56-BLACK) - TONE II WIRED GAMING HEADSET",
            brand: "Fantech",
            color: "Black",
            image: "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg",
            currentPrice: 1138,
            originalPrice: 2199,
            quantity: 1,
            endTime: "Oct 24 23:59:59",
            liked: false,
        },
        {
            id: 2,
            name: "I-phone 20W Charger For 14 Pro Max USB-C TO Lightning 3 pin",
            brand: "No Brand",
            color: "White",
            image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
            currentPrice: 475,
            originalPrice: 1599,
            quantity: 1,
            endTime: "Oct 24 23:59:59",
            liked: false,
        },
    ]);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity > 0) {
            setItems(
                items.map((item) =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const toggleLike = (id) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, liked: !item.liked } : item
            )
        );
    };

    const removeItem = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const subtotal = items.reduce(
        (sum, item) => sum + item.currentPrice * item.quantity,
        0
    );
    const shipping = 0;
    const total = subtotal + shipping;

    return (
        <div>
            <Navbar />
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 overflow-hidden mb-8">
                <img
                    src="https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
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
                    <div className="lg:col-span-2 sticky top-56 self-start">
                        <div className="bg-white rounded-lg p-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Cart Items ({items.length})
                                </h2>
                                {items.length > 0 && (
                                    <button className="text-red-500 hover:text-red-700 text-sm font-medium">
                                        CLEAR ALL
                                    </button>
                                )}
                            </div>

                            {items.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">
                                        Your cart is empty
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border border-gray-200 rounded-lg p-4 flex gap-4"
                                        >
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 mt-1"
                                            />

                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded"
                                            />

                                            <div className="flex-1">
                                                <a
                                                    href="#"
                                                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm mb-1 block"
                                                >
                                                    {item.brand}
                                                </a>
                                                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {item.color} • Ends at{" "}
                                                    {item.endTime}
                                                </p>

                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-lg font-bold text-orange-500">
                                                            Rs.{" "}
                                                            {item.currentPrice}
                                                        </p>
                                                        <p className="text-sm text-gray-400 line-through">
                                                            Rs.{" "}
                                                            {item.originalPrice}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center border border-gray-300 rounded">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity -
                                                                        1
                                                                )
                                                            }
                                                            className="p-1 hover:bg-gray-100"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="px-3 py-1 font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity +
                                                                        1
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
                                                <button
                                                    onClick={() =>
                                                        toggleLike(item.id)
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
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                    className="p-2 hover:bg-red-50 rounded text-red-500"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
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

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal ({items.length} items)
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        Rs. {subtotal}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Shipping Fee
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        Rs. {shipping}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Enter Voucher Code"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
                                />
                                <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg">
                                    APPLY
                                </button>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-xl font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-orange-500">
                                        Rs. {total}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg">
                                PROCEED TO CHECKOUT({items.length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
