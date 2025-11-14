import React, { useEffect, useState } from "react";
import { CheckCircle, Truck, Download, Home, X } from "lucide-react";
import axios from "axios";
import { Link } from "@inertiajs/react";

const PaymentSuccess = ({ showForm, setShowForm }) => {
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isStoringOrder, setIsStoringOrder] = useState(false);
    const [storageError, setStorageError] = useState(null);
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

    import.meta.env.VITE_service_id;
    import.meta.env.VITE_template_id_payment;
    import.meta.env.VITE_public_key;

    useEffect(() => {
        // Check if we're coming from eSewa redirect
        const urlParams = new URLSearchParams(window.location.search);
        const fromEsewa = urlParams.get("from_esewa");

        const storedOrder = sessionStorage.getItem("pendingOrder");

        if (storedOrder) {
            try {
                const order = JSON.parse(storedOrder);
                const processedOrder = processOrderData(order);
                setOrderData(processedOrder);

                // Only remove from session storage if we're not in popup mode
                if (!fromEsewa) {
                    sessionStorage.removeItem("pendingOrder");
                }

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

        // Validate required customer info
        if (!order.customerInfo || !order.customerInfo.email) {
            console.error("Customer email is required");
            setStorageError("Customer email is required to save order");
            return;
        }

        setIsStoringOrder(true);
        setStorageError(null);

        try {
            const orderItemsData = order.orderItems.map((item) => ({
                user_name: `${order.customerInfo.fullName}`,
                user_email: order.customerInfo.email, // Fixed: Added user_email
                product_id: item.product_id || item.id,
                product_name: item.product_name || item.name,
                payment_method: "Online",
                product_sku: item.product_sku,
                product_brand: item.product_brand,
                quantity: item.quantity,
                price: item.price,
                discounted_price:
                    item.discounted_price || item.discountedPrice || item.price,
                size: item.size || "",
                color: item.color || "",
            }));

            console.log("Sending order data to backend:", orderItemsData);

            // Send each order item to the backend
            const orderPromises = orderItemsData.map((orderItem) =>
                axios.post(route("ourorder.store"), orderItem)
            );

            const results = await Promise.all(orderPromises);
            console.log("Order storage results:", results);

            console.log("Online order stored successfully");
        } catch (error) {
            console.error("Error storing online order:", error);
            console.error("Error details:", error.response?.data);
            setStorageError(
                "Failed to save order details. Please contact support."
            );
        } finally {
            setIsStoringOrder(false);
        }
    };

    console.log("Order Data:", orderData);

    const processOrderData = (order) => {
        if (!order) return null;

        const processedOrder = JSON.parse(JSON.stringify(order));

        // Ensure customer info has all required fields
        if (processedOrder.customerInfo) {
            processedOrder.customerInfo = {
                fullName: processedOrder.customerInfo.fullName || "",
                email: processedOrder.customerInfo.email || "",
                address: processedOrder.customerInfo.address || "",
                city: processedOrder.customerInfo.city || "",
                state: processedOrder.customerInfo.state || "",
                zipCode: processedOrder.customerInfo.zipCode || "",
                country: processedOrder.customerInfo.country || "",
                phone: processedOrder.customerInfo.phone || "",
            };
        }

        // Ensure amounts are numbers
        if (processedOrder.amounts) {
            processedOrder.amounts.subtotal =
                parseFloat(processedOrder.amounts.subtotal) || 0;
            processedOrder.amounts.shipping =
                parseFloat(processedOrder.amounts.shipping) || 0;
            processedOrder.amounts.tax =
                parseFloat(processedOrder.amounts.tax) || 0;
            processedOrder.amounts.total =
                parseFloat(processedOrder.amounts.total) || 0;
        }

        // Ensure order items have proper structure
        if (
            processedOrder.orderItems &&
            Array.isArray(processedOrder.orderItems)
        ) {
            processedOrder.orderItems = processedOrder.orderItems.map(
                (item) => ({
                    ...item,
                    product_id: item.product_id || item.id,
                    product_name: item.product_name || item.name,
                    price: parseFloat(item.price) || 0,
                    discounted_price:
                        parseFloat(
                            item.discounted_price ||
                                item.discountedPrice ||
                                item.price
                        ) || 0,
                    quantity: parseInt(item.quantity) || 1,
                    product_sku: item.product_sku,
                    product_brand: item.product_brand,
                    size: item.size || "",
                    color: item.color || "",
                })
            );
        }

        return processedOrder;
    };

    const generateInvoice = () => {
        if (!orderData) return "";

        const invoiceNumber = orderData.transactionUuid || `INV-${Date.now()}`;
        const invoiceDate = new Date().toLocaleDateString();
        const orderDate = new Date(orderData.timestamp).toLocaleDateString();

        // Calculate totals
        const subtotal = orderData.amounts.subtotal;
        const shipping = orderData.amounts.shipping;
        const tax = orderData.amounts.tax;
        const total = orderData.amounts.total;

        // Create invoice HTML content
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice - ${invoiceNumber}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
                    .invoice-container { max-width: 800px; margin: 0 auto; background: white; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f97316; padding-bottom: 20px; }
                    .company-name { font-size: 24px; font-weight: bold; color: #f97316; margin-bottom: 5px; }
                    .invoice-title { font-size: 32px; font-weight: bold; margin: 10px 0; }
                    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    .section { margin-bottom: 20px; }
                    .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #f97316; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th { background-color: #f97316; color: white; text-align: left; padding: 12px; }
                    td { padding: 12px; border-bottom: 1px solid #ddd; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .totals { width: 300px; margin-left: auto; }
                    .totals-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                    .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 8px; margin-top: 8px; }
                    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
                    .thank-you { font-size: 16px; font-weight: bold; color: #f97316; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <div class="company-name">NepMart</div>
                        <div class="invoice-title">INVOICE</div>
                        <div>123 Business Street, City, State 12345</div>
                        <div>Phone: (123) 456-7890 | Email: info@company.com</div>
                    </div>

                    <div class="invoice-details">
                        <div>
                            <strong>Invoice Number:</strong> ${invoiceNumber}<br>
                            <strong>Invoice Date:</strong> ${invoiceDate}<br>
                            <strong>Order Date:</strong> ${orderDate}
                        </div>
                        <div>
                            <strong>Payment Method:</strong> eSewa (Online)<br>
                            <strong>Payment Status:</strong> Paid<br>
                            <strong>Transaction ID:</strong> ${
                                orderData.transactionUuid || "N/A"
                            }
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Bill To</div>
                        <strong>${orderData.customerInfo.fullName}</strong><br>
                        ${orderData.customerInfo.address}<br>
                        ${orderData.customerInfo.city}, ${
            orderData.customerInfo.state
        } ${orderData.customerInfo.zipCode}<br>
                        ${orderData.customerInfo.country}<br>
                        Phone: ${orderData.customerInfo.phone}<br>
                        Email: ${orderData.customerInfo.email}
                    </div>

                    <div class="section">
                        <div class="section-title">Order Items</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>SKU</th>
                                    <th>Size</th>
                                    <th>Color</th>
                                    <th>Qty</th>
                                    <th class="text-right">Unit Price</th>
                                    <th class="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderData.orderItems
                                    .map(
                                        (item) => `
                                    <tr>
                                        <td>${item.product_name}</td>
                                        <td>${item.product_sku || "N/A"}</td>
                                        <td>${item.size || "N/A"}</td>
                                        <td>${item.color || "N/A"}</td>
                                        <td>${item.quantity}</td>
                                        <td class="text-right">Rs. ${formatPrice(
                                            item.price
                                        )}</td>
                                        <td class="text-right">Rs. ${formatPrice(
                                            item.price * item.quantity
                                        )}</td>
                                    </tr>
                                `
                                    )
                                    .join("")}
                            </tbody>
                        </table>
                    </div>

                    <div class="totals">
                        <div class="totals-row">
                            <span>Subtotal:</span>
                            <span>Rs. ${formatPrice(subtotal)}</span>
                        </div>
                        <div class="totals-row">
                            <span>Shipping:</span>
                            <span>Rs. ${formatPrice(shipping)}</span>
                        </div>
                        <div class="totals-row">
                            <span>Tax (13%):</span>
                            <span>Rs. ${formatPrice(tax)}</span>
                        </div>
                        <div class="totals-row total-row">
                            <span>Total Amount:</span>
                            <span>Rs. ${formatPrice(total)}</span>
                        </div>
                    </div>

                    <div class="footer">
                        <div class="thank-you">Thank you for your business!</div>
                        <div>If you have any questions about this invoice, please contact our customer service.</div>
                        <div style="margin-top: 20px;">
                            This is a computer-generated invoice. No signature required.
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    };

    const handleDownloadInvoice = async () => {
        if (!orderData) {
            alert("No order data available to generate invoice");
            return;
        }

        setIsGeneratingInvoice(true);

        try {
            // Method 1: Using html2pdf (recommended - you'll need to install the package)
            await downloadWithHtml2Pdf();
        } catch (error) {
            console.error("Error generating PDF:", error);
            // Fallback method
            await downloadWithPrintMethod();
        } finally {
            setIsGeneratingInvoice(false);
        }
    };

    // Method 1: Using html2pdf.js (recommended - better formatting)
    const downloadWithHtml2Pdf = async () => {
        // Check if html2pdf is available
        if (typeof window.html2pdf === "undefined") {
            // Load html2pdf from CDN if not available
            await loadHtml2Pdf();
        }

        const element = document.createElement("div");
        element.innerHTML = generateInvoice();

        const opt = {
            margin: 10,
            filename: `invoice-${orderData.transactionUuid || Date.now()}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        window.html2pdf().set(opt).from(element).save();
    };

    // Load html2pdf from CDN
    const loadHtml2Pdf = () => {
        return new Promise((resolve, reject) => {
            if (typeof window.html2pdf !== "undefined") {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
            script.integrity =
                "sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusVA+e4tXggjvR/qWdLpILxvr6l2p8g8O4A==";
            script.crossOrigin = "anonymous";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    // Method 2: Fallback using print method (works without external libraries)
    const downloadWithPrintMethod = () => {
        const invoiceContent = generateInvoice();
        const printWindow = window.open("", "_blank");
        printWindow.document.write(invoiceContent);
        printWindow.document.close();

        // Wait for content to load then trigger print
        setTimeout(() => {
            printWindow.print();
            // Optional: Close window after print
            // printWindow.close();
        }, 250);
    };

    // Alternative Method: Generate and download as PDF using browser print
    const downloadAsPDF = () => {
        const invoiceContent = generateInvoice();
        const blob = new Blob([invoiceContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${
            orderData.transactionUuid || Date.now()
        }.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleTrackOrder = () => {
        window.location.href = "/orders";
    };

    const handleContinueShopping = () => {
        window.location.href = "/";
    };

    const formatPrice = (price) => {
        if (typeof price !== "number" || isNaN(price)) {
            return "0.00";
        }
        return price.toFixed(2);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            Loading order details...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-full sm:max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Payment Successful
                    </h2>
                    <Link
                        href="/"
                        className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
                    >
                        <X size={24} />
                    </Link>
                </div>

                {/* Success Content */}
                <div className="space-y-6">
                    {/* Success Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-lg text-center text-white">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white rounded-full p-3">
                                <CheckCircle
                                    size={48}
                                    className="text-green-500"
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                            Payment Successful!
                        </h1>
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
                                <p className="text-white text-sm">
                                    {storageError}
                                </p>
                                {orderData?.transactionUuid && (
                                    <p className="text-white text-sm mt-1">
                                        Order ID: {orderData.transactionUuid}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Order Details */}
                    {orderData ? (
                        <div className="space-y-4">
                            {/* Order Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Order Information
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Order ID:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {orderData.transactionUuid}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Date:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(
                                                    orderData.timestamp
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Payment Method:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                eSewa (Online)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Amount Paid
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Subtotal:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                Rs. $
                                                {formatPrice(
                                                    orderData.amounts.subtotal
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Shipping:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                Rs. $
                                                {formatPrice(
                                                    orderData.amounts.shipping
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Tax (13%):
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                Rs. $
                                                {formatPrice(
                                                    orderData.amounts.tax
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-200 pt-2">
                                            <span className="font-semibold text-gray-900">
                                                Total:
                                            </span>
                                            <span className="font-bold text-orange-500">
                                                Rs. $
                                                {formatPrice(
                                                    orderData.amounts.total
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Shipping Address
                                </h3>
                                <div className="text-sm text-gray-700">
                                    <p className="font-medium">
                                        {orderData.customerInfo.fullName}
                                    </p>
                                    <p>{orderData.customerInfo.address}</p>
                                    <p>
                                        {orderData.customerInfo.city},{" "}
                                        {orderData.customerInfo.state}{" "}
                                        {orderData.customerInfo.zipCode}
                                    </p>
                                    <p>{orderData.customerInfo.country}</p>
                                    <p className="mt-2">
                                        <span className="font-medium">
                                            Phone:
                                        </span>{" "}
                                        {orderData.customerInfo.phone}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Email:
                                        </span>{" "}
                                        {orderData.customerInfo.email}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Order Items ({orderData.orderItems.length})
                                </h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {orderData.orderItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 bg-white rounded-lg border"
                                        >
                                            <img
                                                src={
                                                    item.images
                                                        ? `/storage/${item.images}`
                                                        : "https://images.pexels.com/photos/258196/pexels-photo-258196.jpeg"
                                                }
                                                alt={item.product_name}
                                                className="w-12 h-12 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://images.pexels.com/photos/258196/pexels-photo-258196.jpeg";
                                                }}
                                            />

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 text-sm truncate">
                                                    {item.product_name}
                                                </h4>
                                                <p className="text-xs text-gray-600">
                                                    Qty: {item.quantity}
                                                    {item.size &&
                                                        ` • Size: ${item.size}`}
                                                    {item.color &&
                                                        ` • Color: ${item.color}`}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-orange-500 text-sm">
                                                    Rs.{" "}
                                                    {formatPrice(
                                                        item.price *
                                                            item.quantity
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Rs.{" "}
                                                    {formatPrice(item.price)}{" "}
                                                    each
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-600 mb-4">
                                No order data found.
                            </p>
                            <button
                                onClick={handleContinueShopping}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                Return to Home
                            </button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {orderData && (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-gray-200">
                            <button
                                onClick={handleDownloadInvoice}
                                disabled={isGeneratingInvoice}
                                className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGeneratingInvoice ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download size={16} />
                                        Download Invoice
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleContinueShopping}
                                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                            >
                                <Home size={16} />
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;

// import React, { useEffect, useState } from "react";
// import { CheckCircle, Truck, Download, Home } from "lucide-react";
// import Navbar from "@/ContentWrapper/Navbar";
// import Footer from "@/ContentWrapper/Footer";
// import axios from "axios";

// const PaymentSuccess = () => {
//     const [orderData, setOrderData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isStoringOrder, setIsStoringOrder] = useState(false);
//     const [storageError, setStorageError] = useState(null);
//     const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

//     useEffect(() => {
//         const storedOrder = sessionStorage.getItem("pendingOrder");

//         if (storedOrder) {
//             try {
//                 const order = JSON.parse(storedOrder);
//                 const processedOrder = processOrderData(order);
//                 setOrderData(processedOrder);

//                 sessionStorage.removeItem("pendingOrder");

//                 // Store online payment order in database
//                 storeOnlineOrder(processedOrder);
//             } catch (error) {
//                 console.error("Error parsing order data:", error);
//                 setStorageError("Failed to process order data");
//             }
//         }

//         setIsLoading(false);
//     }, []);

//     // Store online payment order in database
//     const storeOnlineOrder = async (order) => {
//         if (!order || !order.orderItems || order.orderItems.length === 0) {
//             console.error("No order items to store");
//             setStorageError("No order items found to store");
//             return;
//         }

//         setIsStoringOrder(true);
//         setStorageError(null);

//         try {
//             const orderItemsData = order.orderItems.map(item => ({
//                 user_name: `${order.customerInfo.fullName} `,
//                 product_id: item.product_id || item.id,
//                 product_name: item.product_name || item.name,
//                 payment_method: "Online", // Fixed field name
//                 product_sku: item.product_sku,
//                 product_brand: item.product_brand ,
//                 quantity: item.quantity,
//                 price: item.price,
//                 discounted_price: item.discounted_price || item.discountedPrice || item.price,
//                 size: item.size || "",
//                 color: item.color || "",
//             }));

//             console.log("Sending order data to backend:", orderItemsData);

//             // Send each order item to the backend
//             const orderPromises = orderItemsData.map(orderItem =>
//                 axios.post(route('ourorder.store'), orderItem)
//             );

//             const results = await Promise.all(orderPromises);
//             console.log("Order storage results:", results);

//             console.log("Online order stored successfully");

//         } catch (error) {
//             console.error("Error storing online order:", error);
//             console.error("Error details:", error.response?.data);
//             setStorageError("Failed to save order details. Please contact support.");
//         } finally {
//             setIsStoringOrder(false);
//         }
//     };

//     const processOrderData = (order) => {
//         if (!order) return null;

//         const processedOrder = JSON.parse(JSON.stringify(order));

//         // Ensure amounts are numbers
//         if (processedOrder.amounts) {
//             processedOrder.amounts.subtotal = parseFloat(processedOrder.amounts.subtotal) || 0;
//             processedOrder.amounts.shipping = parseFloat(processedOrder.amounts.shipping) || 0;
//             processedOrder.amounts.tax = parseFloat(processedOrder.amounts.tax) || 0;
//             processedOrder.amounts.total = parseFloat(processedOrder.amounts.total) || 0;
//         }

//         // Ensure order items have proper structure
//         if (processedOrder.orderItems && Array.isArray(processedOrder.orderItems)) {
//             processedOrder.orderItems = processedOrder.orderItems.map(item => ({
//                 ...item,
//                 product_id: item.product_id || item.id,
//                 product_name: item.product_name || item.name,
//                 price: parseFloat(item.price) || 0,
//                 discounted_price: parseFloat(item.discounted_price || item.discountedPrice || item.price) || 0,
//                 quantity: parseInt(item.quantity) || 1,
//                 product_sku: item.product_sku ,
//                 product_brand: item.product_brand,
//                 size: item.size || "",
//                 color: item.color || "",
//             }));
//         }

//         return processedOrder;
//     };

//     const generateInvoiceHTML = () => {
//         if (!orderData) return '';

//         const invoiceNumber = orderData.transactionUuid || `INV-${Date.now()}`;
//         const invoiceDate = new Date().toLocaleDateString();
//         const orderDate = new Date(orderData.timestamp).toLocaleDateString();

//         const customerName = `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`;

//         return `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta charset="UTF-8">
//                 <title>Invoice - ${invoiceNumber}</title>
//                 <style>
//                     body {
//                         font-family: 'Arial', sans-serif;
//                         margin: 0;
//                         padding: 20px;
//                         color: #333;
//                         background: #f8f9fa;
//                     }
//                     .invoice-container {
//                         max-width: 800px;
//                         margin: 0 auto;
//                         background: white;
//                         padding: 40px;
//                         box-shadow: 0 0 20px rgba(0,0,0,0.1);
//                         border-radius: 8px;
//                     }
//                     .header {
//                         text-align: center;
//                         margin-bottom: 40px;
//                         border-bottom: 3px solid #f97316;
//                         padding-bottom: 20px;
//                     }
//                     .company-name {
//                         font-size: 28px;
//                         font-weight: bold;
//                         color: #f97316;
//                         margin-bottom: 10px;
//                     }
//                     .invoice-title {
//                         font-size: 36px;
//                         font-weight: bold;
//                         margin: 20px 0;
//                         color: #1f2937;
//                     }
//                     .invoice-details {
//                         display: flex;
//                         justify-content: space-between;
//                         margin-bottom: 30px;
//                         background: #f8f9fa;
//                         padding: 20px;
//                         border-radius: 8px;
//                     }
//                     .section {
//                         margin-bottom: 25px;
//                     }
//                     .section-title {
//                         font-size: 20px;
//                         font-weight: bold;
//                         margin-bottom: 15px;
//                         color: #f97316;
//                         border-bottom: 2px solid #e5e7eb;
//                         padding-bottom: 8px;
//                     }
//                     table {
//                         width: 100%;
//                         border-collapse: collapse;
//                         margin: 25px 0;
//                         background: white;
//                     }
//                     th {
//                         background-color: #f97316;
//                         color: white;
//                         text-align: left;
//                         padding: 15px;
//                         font-weight: bold;
//                     }
//                     td {
//                         padding: 15px;
//                         border-bottom: 1px solid #e5e7eb;
//                     }
//                     .text-right {
//                         text-align: right;
//                     }
//                     .text-center {
//                         text-align: center;
//                     }
//                     .totals {
//                         width: 350px;
//                         margin-left: auto;
//                         background: #f8f9fa;
//                         padding: 20px;
//                         border-radius: 8px;
//                     }
//                     .totals-row {
//                         display: flex;
//                         justify-content: space-between;
//                         margin-bottom: 12px;
//                         padding: 8px 0;
//                     }
//                     .total-row {
//                         font-weight: bold;
//                         font-size: 20px;
//                         border-top: 3px solid #1f2937;
//                         padding-top: 12px;
//                         margin-top: 12px;
//                         color: #f97316;
//                     }
//                     .footer {
//                         text-align: center;
//                         margin-top: 50px;
//                         padding-top: 30px;
//                         border-top: 2px solid #e5e7eb;
//                         color: #6b7280;
//                     }
//                     .thank-you {
//                         font-size: 18px;
//                         font-weight: bold;
//                         color: #f97316;
//                         margin: 25px 0;
//                     }
//                     .status-badge {
//                         background: #10b981;
//                         color: white;
//                         padding: 8px 16px;
//                         border-radius: 20px;
//                         font-weight: bold;
//                         display: inline-block;
//                     }
//                     .customer-info {
//                         background: #f8f9fa;
//                         padding: 20px;
//                         border-radius: 8px;
//                         margin-bottom: 20px;
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="invoice-container">
//                     <div class="header">
//                         <div class="company-name">NEPCART</div>
//                         <div class="invoice-title">INVOICE</div>
//                         <div>Kathmandu, Nepal</div>
//                         <div>Phone: +977 1-1234567 | Email: support@nepcart.com</div>
//                     </div>

//                     <div class="invoice-details">
//                         <div>
//                             <strong>Invoice Number:</strong> ${invoiceNumber}<br>
//                             <strong>Invoice Date:</strong> ${invoiceDate}<br>
//                             <strong>Order Date:</strong> ${orderDate}<br>
//                             <strong>Status:</strong> <span class="status-badge">PAID</span>
//                         </div>
//                         <div>
//                             <strong>Payment Method:</strong> eSewa (Online)<br>
//                             <strong>Payment Status:</strong> Completed<br>
//                             <strong>Transaction ID:</strong> ${orderData.transactionUuid || 'N/A'}
//                         </div>
//                     </div>

//                     <div class="customer-info">
//                         <div class="section-title">Bill To</div>
//                         <strong>${customerName}</strong><br>
//                         ${orderData.customerInfo.address}<br>
//                         ${orderData.customerInfo.city}, ${orderData.customerInfo.state} ${orderData.customerInfo.zipCode}<br>
//                         ${orderData.customerInfo.country}<br>
//                         Phone: ${orderData.customerInfo.phone}<br>
//                         Email: ${orderData.customerInfo.email}
//                     </div>

//                     <div class="section">
//                         <div class="section-title">Order Items</div>
//                         <table>
//                             <thead>
//                                 <tr>
//                                     <th>Item Description</th>
//                                     <th>SKU</th>
//                                     <th>Size</th>
//                                     <th>Color</th>
//                                     <th>Qty</th>
//                                     <th class="text-right">Unit Price</th>
//                                     <th class="text-right">Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${orderData.orderItems.map(item => `
//                                     <tr>
//                                         <td><strong>${item.product_name}</strong></td>
//                                         <td>${item.product_sku || 'N/A'}</td>
//                                         <td>${item.size || 'N/A'}</td>
//                                         <td>${item.color || 'N/A'}</td>
//                                         <td>${item.quantity}</td>
//                                         <td class="text-right">Rs. ${formatPrice(item.price)}</td>
//                                         <td class="text-right">Rs. ${formatPrice(item.price * item.quantity)}</td>
//                                     </tr>
//                                 `).join('')}
//                             </tbody>
//                         </table>
//                     </div>

//                     <div class="totals">
//                         <div class="totals-row">
//                             <span>Subtotal:</span>
//                             <span>Rs. ${formatPrice(orderData.amounts.subtotal)}</span>
//                         </div>
//                         <div class="totals-row">
//                             <span>Shipping Fee:</span>
//                             <span>Rs. ${formatPrice(orderData.amounts.shipping)}</span>
//                         </div>
//                         <div class="totals-row">
//                             <span>Tax (13%):</span>
//                             <span>Rs. ${formatPrice(orderData.amounts.tax)}</span>
//                         </div>
//                         <div class="totals-row total-row">
//                             <span>Total Amount:</span>
//                             <span>Rs. ${formatPrice(orderData.amounts.total)}</span>
//                         </div>
//                     </div>

//                     <div class="footer">
//                         <div class="thank-you">Thank you for shopping with us!</div>
//                         <div>If you have any questions about this invoice, please contact our customer service.</div>
//                         <div style="margin-top: 20px; font-style: italic;">
//                             This is a computer-generated invoice. No signature required.
//                         </div>
//                     </div>
//                 </div>
//             </body>
//             </html>
//         `;
//     };

//     const handleDownloadInvoice = async () => {
//         if (!orderData) {
//             alert("No order data available to generate invoice");
//             return;
//         }

//         setIsGeneratingInvoice(true);

//         try {
//             // Method 1: Try using html2pdf if available
//             if (typeof window.html2pdf !== 'undefined') {
//                 await downloadWithHtml2Pdf();
//             } else {
//                 // Method 2: Load html2pdf from CDN
//                 await loadHtml2Pdf();
//                 await downloadWithHtml2Pdf();
//             }
//         } catch (error) {
//             console.error("Error generating PDF:", error);
//             // Method 3: Fallback to print method
//             await downloadWithPrintMethod();
//         } finally {
//             setIsGeneratingInvoice(false);
//         }
//     };

//     const downloadWithHtml2Pdf = async () => {
//         const element = document.createElement('div');
//         element.innerHTML = generateInvoiceHTML();

//         const opt = {
//             margin: 10,
//             filename: `invoice-${orderData.transactionUuid || Date.now()}.pdf`,
//             image: { type: 'jpeg', quality: 0.98 },
//             html2canvas: {
//                 scale: 2,
//                 useCORS: true,
//                 logging: false
//             },
//             jsPDF: {
//                 unit: 'mm',
//                 format: 'a4',
//                 orientation: 'portrait'
//             }
//         };

//         await window.html2pdf().set(opt).from(element).save();
//     };

//     const loadHtml2Pdf = () => {
//         return new Promise((resolve, reject) => {
//             if (typeof window.html2pdf !== 'undefined') {
//                 resolve();
//                 return;
//             }

//             const script = document.createElement('script');
//             script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
//             script.integrity = 'sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusVA+e4tXggjvR/qWdLpILxvr6l2p8g8O4A==';
//             script.crossOrigin = 'anonymous';
//             script.onload = resolve;
//             script.onerror = reject;
//             document.head.appendChild(script);
//         });
//     };

//     const downloadWithPrintMethod = () => {
//         const invoiceContent = generateInvoiceHTML();
//         const printWindow = window.open('', '_blank');
//         printWindow.document.write(invoiceContent);
//         printWindow.document.close();

//         setTimeout(() => {
//             printWindow.print();
//         }, 500);
//     };

//     const handleTrackOrder = () => {
//         window.location.href = '/orders';
//     };

//     const handleContinueShopping = () => {
//         window.location.href = '/';
//     };

//     const handleReturnHome = () => {
//         window.location.href = '/';
//     };

//     const formatPrice = (price) => {
//         if (typeof price !== 'number' || isNaN(price)) {
//             return '0.00';
//         }
//         return price.toFixed(2);
//     };

//     if (isLoading) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                     <div className="text-center">
//                         <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                         <p className="text-gray-600">Loading order details...</p>
//                     </div>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     return (
//         <>
//             <Navbar />

//             {/* Hero Section */}
//             <div className="relative h-48 md:h-64 overflow-hidden mb-8">
//                 <img
//                     src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"
//                     alt="Success hero"
//                     className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/40"></div>
//                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
//                     <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
//                         Payment Successful!
//                     </h1>
//                     <p className="text-lg md:text-xl text-center max-w-2xl">
//                         Thank you for your purchase
//                     </p>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="min-h-screen bg-gray-50 py-8">
//                 <div className="max-w-4xl mx-auto px-4">
//                     {/* Success Card */}
//                     <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//                         {/* Success Header */}
//                         <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
//                             <div className="flex justify-center mb-4">
//                                 <div className="bg-white rounded-full p-3">
//                                     <CheckCircle size={48} className="text-green-500" />
//                                 </div>
//                             </div>
//                             <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
//                             <p className="text-green-100 text-lg">
//                                 Your order has been confirmed and is being processed
//                             </p>

//                             {/* Storage Status */}
//                             {isStoringOrder && (
//                                 <div className="mt-4 flex items-center justify-center gap-2">
//                                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                     <span>Saving order details...</span>
//                                 </div>
//                             )}

//                             {storageError && (
//                                 <div className="mt-4 p-3 bg-red-500/80 rounded-lg">
//                                     <p className="text-white text-sm">{storageError}</p>
//                                     {orderData?.transactionUuid && (
//                                         <p className="text-white text-sm mt-1">
//                                             Order ID: {orderData.transactionUuid}
//                                         </p>
//                                     )}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Order Details */}
//                         <div className="p-8">
//                             {orderData ? (
//                                 <div className="space-y-6">
//                                     {/* Order Summary */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="bg-gray-50 p-6 rounded-lg">
//                                             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                                                 Order Information
//                                             </h3>
//                                             <div className="space-y-3 text-sm">
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Order ID:</span>
//                                                     <span className="font-medium text-gray-900">
//                                                         {orderData.transactionUuid}
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Date:</span>
//                                                     <span className="font-medium text-gray-900">
//                                                         {new Date(orderData.timestamp).toLocaleDateString()}
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Time:</span>
//                                                     <span className="font-medium text-gray-900">
//                                                         {new Date(orderData.timestamp).toLocaleTimeString()}
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Payment Method:</span>
//                                                     <span className="font-medium text-gray-900">eSewa (Online)</span>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="bg-gray-50 p-6 rounded-lg">
//                                             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                                                 Amount Paid
//                                             </h3>
//                                             <div className="space-y-3 text-sm">
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Subtotal:</span>
//                                                     <span className="font-medium text-gray-900">
//                                                         Rs. {formatPrice(orderData.amounts.subtotal)}
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Shipping:</span>
//                                                     <span className="font-medium text-gray-900">
//                                                         Rs. {formatPrice(orderData.amounts.shipping)}
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Tax (13%):</span>
//                                                     <span className="font-medium text-gray-900">
//                                                         Rs. {formatPrice(orderData.amounts.tax)}
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between border-t border-gray-200 pt-2">
//                                                     <span className="text-lg font-semibold text-gray-900">Total:</span>
//                                                     <span className="text-lg font-bold text-orange-500">
//                                                         Rs. {formatPrice(orderData.amounts.total)}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Shipping Information */}
//                                     <div className="bg-gray-50 p-6 rounded-lg">
//                                         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                                             Shipping Address
//                                         </h3>
//                                         <div className="text-sm text-gray-700">
//                                             <p className="font-medium">
//                                                 {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}
//                                             </p>
//                                             <p>{orderData.customerInfo.address}</p>
//                                             <p>
//                                                 {orderData.customerInfo.city}, {orderData.customerInfo.state} {orderData.customerInfo.zipCode}
//                                             </p>
//                                             <p>{orderData.customerInfo.country}</p>
//                                             <p className="mt-2">
//                                                 <span className="font-medium">Phone:</span> {orderData.customerInfo.phone}
//                                             </p>
//                                             <p>
//                                                 <span className="font-medium">Email:</span> {orderData.customerInfo.email}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     {/* Order Items */}
//                                     <div className="bg-gray-50 p-6 rounded-lg">
//                                         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                                             Order Items
//                                         </h3>
//                                         <div className="space-y-4">
//                                             {orderData.orderItems.map((item, index) => (
//                                                 <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border">
//                                                     <img
//                                                         src={item.images?.[0]}
//                                                         alt={item.product_name}
//                                                         className="w-16 h-16 object-cover rounded"
//                                                     />
//                                                     <div className="flex-1">
//                                                         <h4 className="font-medium text-gray-900">{item.product_name}</h4>
//                                                         <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                                                         {item.size && (
//                                                             <p className="text-sm text-gray-600">Size: {item.size}</p>
//                                                         )}
//                                                         {item.color && (
//                                                             <p className="text-sm text-gray-600">Color: {item.color}</p>
//                                                         )}
//                                                     </div>
//                                                     <div className="text-right">
//                                                         <p className="font-semibold text-orange-500">
//                                                             Rs. {formatPrice(item.price * item.quantity)}
//                                                         </p>
//                                                         <p className="text-sm text-gray-600">Rs. {formatPrice(item.price)} each</p>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-8">
//                                     <p className="text-gray-600 mb-4">No order data found.</p>
//                                     <button
//                                         onClick={handleReturnHome}
//                                         className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
//                                     >
//                                         Return to Home
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Action Buttons */}
//                         {orderData && (
//                             <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
//                                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                                     <button
//                                         onClick={handleDownloadInvoice}
//                                         disabled={isGeneratingInvoice}
//                                         className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         {isGeneratingInvoice ? (
//                                             <>
//                                                 <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
//                                                 Generating Invoice...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Download size={20} />
//                                                 Download Invoice
//                                             </>
//                                         )}
//                                     </button>
//                                     <button
//                                         onClick={handleTrackOrder}
//                                         className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
//                                     >
//                                         <Truck size={20} />
//                                         Track Your Order
//                                     </button>
//                                     <button
//                                         onClick={handleContinueShopping}
//                                         className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
//                                     >
//                                         <Home size={20} />
//                                         Continue Shopping
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <Footer />
//         </>
//     );
// };

// export default PaymentSuccess;
