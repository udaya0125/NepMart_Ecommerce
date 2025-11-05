import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    ChevronDown,
    Truck,
    Lock,
    ArrowRight,
    AlertCircle,
} from "lucide-react";
import { useCart } from "../../Contexts/CartContext";
import Navbar from "@/ContentWrapper/Navbar";
import Footer from "@/ContentWrapper/Footer";

const CheckOutPage = () => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const { cart, clearCart } = useCart();

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        getValues,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        },
    });

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
            const taxAmount = Math.round(subtotal * 0.13); // 13% VAT in Nepal
            const totalAmount = subtotal + shipping + taxAmount;

            // Generate unique transaction UUID with timestamp and random string
            const transactionUuid = `TXN-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)
                .toUpperCase()}`;

            // eSewa Configuration
            // IMPORTANT: In production, move secret key to backend API
            const isProduction = false; // Set to true for production
            const secretKey = isProduction
                ? "YOUR_PRODUCTION_SECRET_KEY"
                : "8gBm/:&EnhH.1/q";
            const esewaUrl = isProduction
                ? "https://epay.esewa.com.np/api/epay/main/v2/form"
                : "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
            const productCode = isProduction ? "YOUR_PRODUCT_CODE" : "EPAYTEST";

            // Get current origin for callback URLs
            const baseUrl = window.location.origin;

            // eSewa payment parameters (v2 API)
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

            // Generate signature using signed field names
            const message = `total_amount=${esewaParams.total_amount},transaction_uuid=${esewaParams.transaction_uuid},product_code=${esewaParams.product_code}`;
            const signature = await generateSignature(message, secretKey);
            esewaParams.signature = signature;

            // Store order details in session storage for verification after payment
            const orderData = {
                transactionUuid,
                orderItems: cart.items,
                customerInfo: getValues(),
                amounts: {
                    subtotal,
                    shipping,
                    tax: taxAmount,
                    total: totalAmount,
                },
                timestamp: new Date().toISOString(),
            };
            sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));

            // Clear cart after successful payment initialization
            clearCart();

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
            form.submit();
        } catch (error) {
            console.error("Payment initialization error:", error);
            alert("Failed to initialize payment. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleNextStep = async () => {
        let isValid = false;

        if (step === 1) {
            isValid = await trigger([
                "firstName",
                "lastName",
                "email",
                "phone",
                "address",
                "city",
                "state",
                "zipCode",
                "country",
            ]);
        }

        if (isValid) {
            setStep(step + 1);
        }
    };

    // Calculate order totals
    const subtotal = cart.items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
        0
    );
    const shipping = 200;
    const tax = Math.round(subtotal * 0.13); // Updated to 13% VAT
    const total = subtotal + shipping + tax;

    if (cart.items.length === 0) {
        return (
            <>
                <Navbar />

                {/* Hero Section */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                        src="https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
                        alt="Checkout hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                            Secure Checkout
                        </h1>
                        <p className="text-xl md:text-2xl text-center max-w-2xl">
                            Complete your purchase safely and securely with
                            eSewa
                        </p>
                    </div>
                </div>

                {/* Empty Cart Section */}
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Add some products to your cart before checkout.
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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
                <div className="relative h-64 md:h-80 overflow-hidden mb-8">
                    <img
                        src="https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
                        alt="Checkout hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                            Secure Checkout
                        </h1>
                        <p className="text-xl md:text-2xl text-center max-w-2xl">
                            Complete your purchase safely and securely with
                            eSewa
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl sticky top-24 self-start">
                            {/* Steps */}
                            <div className="bg-white rounded-lg p-6 mb-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center flex-1">
                                        <div
                                            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                                                step >= 1
                                                    ? "bg-orange-500 text-white"
                                                    : "bg-gray-300 text-gray-600"
                                            }`}
                                        >
                                            1
                                        </div>
                                        <div
                                            className={`flex-1 h-1 mx-2 ${
                                                step >= 2
                                                    ? "bg-orange-500"
                                                    : "bg-gray-300"
                                            }`}
                                        ></div>
                                    </div>
                                    <div
                                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                                            step >= 2
                                                ? "bg-orange-500 text-white"
                                                : "bg-gray-300 text-gray-600"
                                        }`}
                                    >
                                        2
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
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

                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Step 1: Shipping Information */}
                                {step === 1 && (
                                    <div className="bg-white rounded-lg p-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                            Shipping Information
                                        </h2>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="col-span-2 sm:col-span-1">
                                                <input
                                                    type="text"
                                                    placeholder="First Name"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
                                                        errors.firstName
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    {...register("firstName", {
                                                        required:
                                                            "First name is required",
                                                        minLength: {
                                                            value: 2,
                                                            message:
                                                                "First name must be at least 2 characters",
                                                        },
                                                    })}
                                                />
                                                {errors.firstName && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {
                                                            errors.firstName
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <input
                                                    type="text"
                                                    placeholder="Last Name"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
                                                        errors.lastName
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    {...register("lastName", {
                                                        required:
                                                            "Last name is required",
                                                        minLength: {
                                                            value: 2,
                                                            message:
                                                                "Last name must be at least 2 characters",
                                                        },
                                                    })}
                                                />
                                                {errors.lastName && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {
                                                            errors.lastName
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="col-span-2 sm:col-span-1">
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
                                                        errors.email
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    {...register("email", {
                                                        required:
                                                            "Email is required",
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message:
                                                                "Invalid email address",
                                                        },
                                                    })}
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.email.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <input
                                                    type="tel"
                                                    placeholder="Phone Number (e.g., 9800000000)"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
                                                        errors.phone
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    {...register("phone", {
                                                        required:
                                                            "Phone number is required",
                                                        pattern: {
                                                            value: /^[9][0-9]{9}$/,
                                                            message:
                                                                "Invalid Nepali phone number (must start with 9 and be 10 digits)",
                                                        },
                                                    })}
                                                />
                                                {errors.phone && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.phone.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <input
                                                type="text"
                                                placeholder="Street Address"
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
                                                    errors.address
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                {...register("address", {
                                                    required:
                                                        "Address is required",
                                                    minLength: {
                                                        value: 5,
                                                        message:
                                                            "Address must be at least 5 characters",
                                                    },
                                                })}
                                            />
                                            {errors.address && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.address.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="col-span-2 sm:col-span-1">
                                                <input
                                                    type="text"
                                                    placeholder="City"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
                                                        errors.city
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    {...register("city", {
                                                        required:
                                                            "City is required",
                                                        minLength: {
                                                            value: 2,
                                                            message:
                                                                "City must be at least 2 characters",
                                                        },
                                                    })}
                                                />
                                                {errors.city && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.city.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <input
                                                    type="text"
                                                    placeholder="State/Province"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
                                                        errors.state
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    {...register("state", {
                                                        required:
                                                            "State is required",
                                                        minLength: {
                                                            value: 2,
                                                            message:
                                                                "State must be at least 2 characters",
                                                        },
                                                    })}
                                                />
                                                {errors.state && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.state.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="col-span-2 sm:col-span-1">
                                                <input
                                                    type="text"
                                                    placeholder="ZIP Code"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
                                                        errors.zipCode
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    {...register("zipCode", {
                                                        required:
                                                            "ZIP code is required",
                                                        pattern: {
                                                            value: /^[0-9]{5}$/,
                                                            message:
                                                                "ZIP code must be exactly 5 digits",
                                                        },
                                                    })}
                                                />
                                                {errors.zipCode && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.zipCode.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <select
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 appearance-none ${
                                                        errors.country
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    {...register("country", {
                                                        required:
                                                            "Country is required",
                                                    })}
                                                >
                                                    <option value="">
                                                        Select Country
                                                    </option>
                                                    <option value="nepal">
                                                        Nepal
                                                    </option>
                                                    <option value="india">
                                                        India
                                                    </option>
                                                    <option value="pakistan">
                                                        Pakistan
                                                    </option>
                                                </select>
                                                {errors.country && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.country.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            Continue to Payment{" "}
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                )}

                                {/* Step 2: eSewa Payment */}
                                {step === 2 && (
                                    <div className="bg-white rounded-lg p-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                            Payment Information
                                        </h2>

                                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                                            <Lock
                                                size={20}
                                                className="text-blue-600 mt-1 flex-shrink-0"
                                            />
                                            <p className="text-sm text-blue-800">
                                                Your payment is secure and
                                                encrypted through eSewa. You
                                                will be redirected to eSewa's
                                                secure payment gateway.
                                            </p>
                                        </div>

                                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                                            <AlertCircle
                                                size={20}
                                                className="text-amber-600 mt-1 flex-shrink-0"
                                            />
                                            <div className="text-sm text-amber-800">
                                                <p className="font-semibold mb-1">
                                                    Test Mode Active
                                                </p>
                                                <p>
                                                    This is a test transaction.
                                                    Use eSewa test credentials
                                                    to complete payment.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg text-center">
                                            <div className="h-16 w-full mx-auto mb-4 flex items-center justify-center bg-white rounded shadow-sm">
                                                <span className="text-3xl font-bold text-green-600">
                                                    eSewa
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                Pay with eSewa
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Nepal's most trusted digital
                                                payment solution
                                            </p>
                                            <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                                                <p className="text-sm text-gray-600 mb-1">
                                                    Total Amount
                                                </p>
                                                <p className="text-3xl font-bold text-orange-500">
                                                    Rs. {total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
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

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                disabled={isProcessing}
                                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isProcessing}
                                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        Pay with eSewa{" "}
                                                        <ArrowRight size={20} />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                    {cart.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3"
                                        >
                                            <img
                                                src={item.images?.[0]}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-sm font-bold text-orange-500">
                                                    Rs. {Number(item.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
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

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-orange-500">
                                        Rs. {total.toFixed(2)}
                                    </span>
                                </div>

                                <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-xs text-blue-800">
                                    <Truck
                                        size={16}
                                        className="mt-1 flex-shrink-0"
                                    />
                                    <p>
                                        Estimated delivery in 3-5 business days
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckOutPage;