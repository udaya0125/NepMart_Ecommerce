import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
    ChevronDown,
    Truck,
    Lock,
    ArrowRight,
    AlertCircle,
    X,
} from "lucide-react";
import { useCart } from "../../Contexts/CartContext";
import Navbar from "@/ContentWrapper/Navbar";
import Footer from "@/ContentWrapper/Footer";
import ShippingInformation from "./ShippingInformation";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";

const CheckOutPage = () => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const { cart, clearCart } = useCart();

    const methods = useForm({
        mode: "onChange",
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        trigger,
        getValues,
    } = methods;

    // Generate HMAC SHA256 signature
    const generateSignature = async (message, secret) => {
        try {
            const encoder = new TextEncoder();
            const keyData = encoder.encode(secret);
            const messageData = encoder.encode(message);

            const cryptoKey = await crypto.subtle.importKey(
                "raw",
                keyData,
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            );

            const signature = await crypto.subtle.sign(
                "HMAC",
                cryptoKey,
                messageData
            );
            const hashArray = Array.from(new Uint8Array(signature));
            const hashBase64 = btoa(String.fromCharCode(...hashArray));

            return hashBase64;
        } catch (error) {
            console.error("Signature generation error:", error);
            throw new Error("Failed to generate payment signature");
        }
    };

    const onSubmit = async (data) => {
        await handleEsewaPayment(data);
    };

    const handleEsewaPayment = async (data) => {
        if (cart.items.length === 0) {
            alert("No items in cart");
            return;
        }

        setIsProcessing(true);

        try {
            const subtotal = cart.items.reduce(
                (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
                0
            );
            const shipping = 200;
            const taxAmount = Math.round(subtotal * 0.13);
            const totalAmount = subtotal + shipping + taxAmount;

            // Generate unique transaction UUID
            const transactionUuid = `TXN-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)
                .toUpperCase()}`;

            // eSewa Configuration
            const isProduction = false;
            const secretKey = isProduction
                ? "YOUR_PRODUCTION_SECRET_KEY"
                : "8gBm/:&EnhH.1/q";
            const esewaUrl = isProduction
                ? "https://epay.esewa.com.np/api/epay/main/v2/form"
                : "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
            const productCode = isProduction ? "YOUR_PRODUCT_CODE" : "EPAYTEST";

            const baseUrl = window.location.origin;

            // eSewa payment parameters
            const esewaParams = {
                amount: subtotal.toFixed(2),
                tax_amount: taxAmount.toFixed(2),
                total_amount: totalAmount.toFixed(2),
                transaction_uuid: transactionUuid,
                product_code: productCode,
                product_service_charge: "0",
                product_delivery_charge: shipping.toFixed(2),
                success_url: `${baseUrl}/payment/success`,
                failure_url: `${baseUrl}/payment/failure`,
                signed_field_names:
                    "total_amount,transaction_uuid,product_code",
            };

            // Generate signature
            const message = `total_amount=${esewaParams.total_amount},transaction_uuid=${esewaParams.transaction_uuid},product_code=${esewaParams.product_code}`;
            const signature = await generateSignature(message, secretKey);
            esewaParams.signature = signature;

            // Store order details
            const orderData = {
                transactionUuid,
                orderItems: cart.items.map((item) => ({
                    id: item.id,
                    product_id: item.id,
                    product_name: item.name,
                    price: Number(item.price) || 0,
                    discounted_price:
                        item.discountedPrice || Number(item.price) || 0,
                    quantity: item.quantity,
                    size: item.size || "",
                    color: item.color || "",
                    product_sku: item.product_sku,
                    product_brand: item.product_brand,
                    images: item.images || [],
                })),
                customerInfo: {
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                    country: data.country,
                },
                amounts: {
                    subtotal,
                    shipping,
                    tax: taxAmount,
                    total: totalAmount,
                },
                timestamp: new Date().toISOString(),
            };
            sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));

            // Create and submit form to eSewa
            const form = document.createElement("form");
            form.method = "POST";
            form.action = esewaUrl;

            Object.keys(esewaParams).forEach((key) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = esewaParams[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);

            // Clear cart after successful payment initialization
            clearCart();
            form.submit();
        } catch (error) {
            console.error("Payment initialization error:", error);
            alert("Failed to initialize payment. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    // Calculate order totals
    const subtotal = cart.items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
        0
    );
    const shipping = 200;
    const tax = Math.round(subtotal * 0.13);
    const total = subtotal + shipping + tax;

    if (cart.items.length === 0) {
        return (
            <>
                <Navbar />
                {/* Hero Section */}
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden">
                    <img
                        src="https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
                        alt="Checkout hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-3 md:mb-4">
                            Secure Checkout
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-center max-w-2xl">
                            Complete your purchase safely and securely with
                            eSewa
                        </p>
                    </div>
                </div>

                {/* Empty Cart Section */}
                <div className="min-h-[50vh] bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
                    <div className="text-center max-w-md w-full">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                            Add some products to your cart before checkout.
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors w-full text-sm sm:text-base"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden mb-4 sm:mb-6">
                    <img
                        src="https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
                        alt="Checkout hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-3 md:mb-4">
                            Secure Checkout
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-center max-w-2xl">
                            Complete your purchase safely and securely with
                            eSewa
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-8 sm:pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Right Column - Order Summary Sidebar */}
                        <div className="lg:col-span-1 order-2 lg:order-1">
                            <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-lg sticky top-4 sm:top-6 lg:top-20">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 md:mb-6 pb-3 sm:pb-4 md:pb-6 border-b border-gray-200 max-h-64 sm:max-h-72 md:max-h-96 overflow-y-auto">
                                    {cart.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-2 sm:gap-3"
                                        >
                                            <img
                                                src={`storage/${item.images}`}
                                                alt={item.name}
                                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 break-words">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-xs sm:text-sm font-bold text-orange-500 mt-1">
                                                    Rs.{" "}
                                                    {Number(item.price).toFixed(
                                                        2
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 md:mb-6 pb-3 sm:pb-4 md:pb-6 border-b border-gray-200 text-xs sm:text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Subtotal
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            Rs. {subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Shipping
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            Rs. {shipping.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Tax (13% VAT)
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            Rs. {tax.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
                                    <span className="text-base sm:text-lg font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-orange-500">
                                        Rs. {total.toFixed(2)}
                                    </span>
                                </div>

                                <div className="bg-blue-50 p-2 sm:p-3 rounded-lg flex items-start gap-2 text-xs text-blue-800">
                                    <Truck
                                        size={14}
                                        className="mt-0.5 flex-shrink-0"
                                    />
                                    <p className="leading-tight">
                                        Estimated delivery in 3-5 business days
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Left Column - Checkout Form */}
                        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl order-1 lg:order-2">
                            {/* Steps */}
                            <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
                                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-8">
                                    <div className="flex items-center flex-1">
                                        <div
                                            className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full font-bold text-xs sm:text-sm md:text-base ${
                                                step >= 1
                                                    ? "bg-orange-500 text-white"
                                                    : "bg-gray-300 text-gray-600"
                                            }`}
                                        >
                                            1
                                        </div>
                                        <div
                                            className={`flex-1 h-1 mx-1 sm:mx-2 ${
                                                step >= 2
                                                    ? "bg-orange-500"
                                                    : "bg-gray-300"
                                            }`}
                                        ></div>
                                    </div>
                                    <div
                                        className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full font-bold text-xs sm:text-sm md:text-base ${
                                            step >= 2
                                                ? "bg-orange-500 text-white"
                                                : "bg-gray-300 text-gray-600"
                                        }`}
                                    >
                                        2
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm font-medium">
                                    <span
                                        className={
                                            step >= 1
                                                ? "text-orange-500"
                                                : "text-gray-500"
                                        }
                                    >
                                        Shipping
                                    </span>
                                    <span
                                        className={
                                            step >= 2
                                                ? "text-orange-500"
                                                : "text-gray-500"
                                        }
                                    >
                                        Payment
                                    </span>
                                </div>
                            </div>

                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Step 1: Shipping Information */}
                                    {step === 1 && (
                                        <ShippingInformation
                                            onNextStep={handleNextStep}
                                            isProcessing={isProcessing}
                                        />
                                    )}

                                    {/* Step 2: eSewa Payment */}
                                    {step === 2 && (
                                        <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6">
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                                                Payment Information
                                            </h2>

                                            <div className="mb-3 sm:mb-4 md:mb-6 p-2 sm:p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                                                <Lock
                                                    size={14}
                                                    className="text-blue-600 mt-0.5 flex-shrink-0"
                                                />
                                                <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                                                    Your payment is secure and
                                                    encrypted through eSewa. You
                                                    will be redirected to
                                                    eSewa's secure payment
                                                    gateway.
                                                </p>
                                            </div>

                                            <div className="mb-3 sm:mb-4 md:mb-6 p-2 sm:p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                                                <AlertCircle
                                                    size={14}
                                                    className="text-amber-600 mt-0.5 flex-shrink-0"
                                                />
                                                <div className="text-xs sm:text-sm text-amber-800">
                                                    <p className="font-semibold mb-1">
                                                        Test Mode Active
                                                    </p>
                                                    <p className="leading-relaxed">
                                                        This is a test
                                                        transaction. Use eSewa
                                                        test credentials to
                                                        complete payment.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg text-center">
                                                <div className="h-8 sm:h-10 md:h-12 w-full max-w-xs mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center bg-white rounded shadow-sm">
                                                    <span className="text-lg sm:text-xl md:text-3xl font-bold text-green-600">
                                                        eSewa
                                                    </span>
                                                </div>
                                                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                                                    Pay with eSewa
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4">
                                                    Nepal's most trusted digital
                                                    payment solution
                                                </p>
                                                <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg inline-block shadow-sm">
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                                        Total Amount
                                                    </p>
                                                    <p className="text-lg sm:text-xl md:text-3xl font-bold text-orange-500">
                                                        Rs. {total.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 md:mb-6 pb-3 sm:pb-4 md:pb-6 border-b border-gray-200 text-xs sm:text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Subtotal
                                                    </span>
                                                    <span className="font-semibold text-gray-900">
                                                        Rs.{" "}
                                                        {subtotal.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Shipping
                                                    </span>
                                                    <span className="font-semibold text-gray-900">
                                                        Rs.{" "}
                                                        {shipping.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Tax (13% VAT)
                                                    </span>
                                                    <span className="font-semibold text-gray-900">
                                                        Rs. {tax.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    disabled={isProcessing}
                                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 sm:py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isProcessing}
                                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 sm:py-3 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Pay with eSewa{" "}
                                                            <ArrowRight
                                                                size={14}
                                                                className="sm:w-4 sm:h-4"
                                                            />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </FormProvider>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Success Popup - This will be shown when redirected from eSewa */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-gray-700 z-10"
                        >
                            <X size={18} className="sm:w-5 sm:h-5" />
                        </button>
                        <PaymentSuccess
                            setShowForm={setShowForm}
                            showForm={showForm}
                        />
                    </div>
                </div>
            )}

            {/* Payment Failure Popup - This will be shown when redirected from eSewa */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-gray-700 z-10"
                        >
                            <X size={18} className="sm:w-5 sm:h-5" />
                        </button>
                        <PaymentFailure
                            setShowForm={setShowForm}
                            showForm={showForm}
                            onRetry={() => {
                                setShowForm(false);
                                setStep(2);
                            }}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default CheckOutPage;