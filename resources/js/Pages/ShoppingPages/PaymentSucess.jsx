import React, { useEffect, useState } from "react";
import { CheckCircle, Truck, Download, Home } from "lucide-react";
import Navbar from "@/ContentWrapper/Navbar";
import Footer from "@/ContentWrapper/Footer";
import axios from "axios";

const PaymentSuccess = () => {
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isStoringOrder, setIsStoringOrder] = useState(false);
    const [storageError, setStorageError] = useState(null);

    useEffect(() => {
        const storedOrder = sessionStorage.getItem("pendingOrder");
        
        if (storedOrder) {
            try {
                const order = JSON.parse(storedOrder);
                const processedOrder = processOrderData(order);
                setOrderData(processedOrder);
                
                sessionStorage.removeItem("pendingOrder");
                
                // Store online payment order in database
                storeOnlineOrder(processedOrder);
            } catch (error) {
                console.error("Error parsing order data:", error);
                setStorageError("Failed to process order data");
            }
        }
        
        setIsLoading(false);
    }, []);

    // Store online payment order in database
    const storeOnlineOrder = async (order) => {
        if (!order || !order.orderItems || order.orderItems.length === 0) {
            console.error("No order items to store");
            setStorageError("No order items found to store");
            return;
        }

        setIsStoringOrder(true);
        setStorageError(null);

        try {
            const orderItemsData = order.orderItems.map(item => ({
                user_name: `${order.customerInfo.fullName} `,
                product_id: item.product_id || item.id,
                product_name: item.product_name || item.name,
                payment_method: "Online", // Fixed field name
                product_sku: item.product_sku,
                product_brand: item.product_brand ,
                quantity: item.quantity,
                price: item.price,
                discounted_price: item.discounted_price || item.discountedPrice || item.price,
                size: item.size || "",
                color: item.color || "",
            }));

            console.log("Sending order data to backend:", orderItemsData);

            // Send each order item to the backend
            const orderPromises = orderItemsData.map(orderItem => 
                axios.post(route('ourorder.store'), orderItem)
            );

            const results = await Promise.all(orderPromises);
            console.log("Order storage results:", results);
            
            console.log("Online order stored successfully");

        } catch (error) {
            console.error("Error storing online order:", error);
            console.error("Error details:", error.response?.data);
            setStorageError("Failed to save order details. Please contact support.");
        } finally {
            setIsStoringOrder(false);
        }
    };

    const processOrderData = (order) => {
        if (!order) return null;

        const processedOrder = JSON.parse(JSON.stringify(order));
        
        // Ensure amounts are numbers
        if (processedOrder.amounts) {
            processedOrder.amounts.subtotal = parseFloat(processedOrder.amounts.subtotal) || 0;
            processedOrder.amounts.shipping = parseFloat(processedOrder.amounts.shipping) || 0;
            processedOrder.amounts.tax = parseFloat(processedOrder.amounts.tax) || 0;
            processedOrder.amounts.total = parseFloat(processedOrder.amounts.total) || 0;
        }
        
        // Ensure order items have proper structure
        if (processedOrder.orderItems && Array.isArray(processedOrder.orderItems)) {
            processedOrder.orderItems = processedOrder.orderItems.map(item => ({
                ...item,
                product_id: item.product_id || item.id,
                product_name: item.product_name || item.name,
                price: parseFloat(item.price) || 0,
                discounted_price: parseFloat(item.discounted_price || item.discountedPrice || item.price) || 0,
                quantity: parseInt(item.quantity) || 1,
                product_sku: item.product_sku ,
                product_brand: item.product_brand,
                size: item.size || "",
                color: item.color || "",
            }));
        }
        
        return processedOrder;
    };

    const handleDownloadInvoice = () => {
        alert("Invoice download functionality would be implemented here");
    };

    const handleTrackOrder = () => {
        window.location.href = '/orders';
    };

    const handleContinueShopping = () => {
        window.location.href = '/';
    };

    const handleReturnHome = () => {
        window.location.href = '/';
    };

    const formatPrice = (price) => {
        if (typeof price !== 'number' || isNaN(price)) {
            return '0.00';
        }
        return price.toFixed(2);
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading order details...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative h-48 md:h-64 overflow-hidden mb-8">
                <img
                    src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"
                    alt="Success hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Payment Successful!
                    </h1>
                    <p className="text-lg md:text-xl text-center max-w-2xl">
                        Thank you for your purchase
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Success Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                        {/* Success Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
                            <div className="flex justify-center mb-4">
                                <div className="bg-white rounded-full p-3">
                                    <CheckCircle size={48} className="text-green-500" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                            <p className="text-green-100 text-lg">
                                Your order has been confirmed and is being processed
                            </p>
                            
                            {/* Storage Status */}
                            {isStoringOrder && (
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Saving order details...</span>
                                </div>
                            )}
                            
                            {storageError && (
                                <div className="mt-4 p-3 bg-red-500/80 rounded-lg">
                                    <p className="text-white text-sm">{storageError}</p>
                                    {orderData?.transactionUuid && (
                                        <p className="text-white text-sm mt-1">
                                            Order ID: {orderData.transactionUuid}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Order Details */}
                        <div className="p-8">
                            {orderData ? (
                                <div className="space-y-6">
                                    {/* Order Summary */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Order Information
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Order ID:</span>
                                                    <span className="font-medium text-gray-900">
                                                        {orderData.transactionUuid}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Date:</span>
                                                    <span className="font-medium text-gray-900">
                                                        {new Date(orderData.timestamp).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Time:</span>
                                                    <span className="font-medium text-gray-900">
                                                        {new Date(orderData.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment Method:</span>
                                                    <span className="font-medium text-gray-900">eSewa (Online)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Amount Paid
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Subtotal:</span>
                                                    <span className="font-medium text-gray-900">
                                                        Rs. {formatPrice(orderData.amounts.subtotal)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Shipping:</span>
                                                    <span className="font-medium text-gray-900">
                                                        Rs. {formatPrice(orderData.amounts.shipping)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tax (13%):</span>
                                                    <span className="font-medium text-gray-900">
                                                        Rs. {formatPrice(orderData.amounts.tax)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-t border-gray-200 pt-2">
                                                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                                                    <span className="text-lg font-bold text-orange-500">
                                                        Rs. {formatPrice(orderData.amounts.total)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Information */}
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Shipping Address
                                        </h3>
                                        <div className="text-sm text-gray-700">
                                            <p className="font-medium">
                                                {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}
                                            </p>
                                            <p>{orderData.customerInfo.address}</p>
                                            <p>
                                                {orderData.customerInfo.city}, {orderData.customerInfo.state} {orderData.customerInfo.zipCode}
                                            </p>
                                            <p>{orderData.customerInfo.country}</p>
                                            <p className="mt-2">
                                                <span className="font-medium">Phone:</span> {orderData.customerInfo.phone}
                                            </p>
                                            <p>
                                                <span className="font-medium">Email:</span> {orderData.customerInfo.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Order Items
                                        </h3>
                                        <div className="space-y-4">
                                            {orderData.orderItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                                                    <img
                                                        src={item.images?.[0]}
                                                        alt={item.product_name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                        {item.size && (
                                                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                                                        )}
                                                        {item.color && (
                                                            <p className="text-sm text-gray-600">Color: {item.color}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-orange-500">
                                                            Rs. {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                        <p className="text-sm text-gray-600">Rs. {formatPrice(item.price)} each</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-4">No order data found.</p>
                                    <button
                                        onClick={handleReturnHome}
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Return to Home
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {orderData && (
                            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={handleDownloadInvoice}
                                        className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        <Download size={20} />
                                        Download Invoice
                                    </button>
                                    <button
                                        onClick={handleTrackOrder}
                                        className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        <Truck size={20} />
                                        Track Your Order
                                    </button>
                                    <button
                                        onClick={handleContinueShopping}
                                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        <Home size={20} />
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PaymentSuccess;