import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown, Truck, Lock, ArrowRight } from "lucide-react";
import Navbar from "@/ContentWrapper/Navbar";
import Footer from "@/ContentWrapper/Footer";


const CheckOutPage = () => {
    const [step, setStep] = useState(1);
    const [orderItems] = useState([
        {
            id: 1,
            name: "FANTECH (HQ56-BLACK) - TONE II WIRED GAMING HEADSET",
            image: "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg",
            price: 1138,
            quantity: 1,
        },
        {
            id: 2,
            name: "I-phone 20W Charger For 14 Pro Max USB-C TO Lightning",
            image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
            price: 475,
            quantity: 1,
        },
    ]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
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

    // Function to generate HMAC SHA256 signature
    const generateSignature = async (message, secret) => {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const messageData = encoder.encode(message);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        const hashArray = Array.from(new Uint8Array(signature));
        const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
        
        return hashBase64;
    };

    const onSubmit = async (data) => {
        // eSewa payment integration
        await handleEsewaPayment(data);
    };

    const handleEsewaPayment = async (data) => {
        const subtotal = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const shipping = 200;
        const taxAmount = Math.round(subtotal * 0.1);
        const total = subtotal + shipping + taxAmount;

        // Generate unique transaction UUID
        const transactionUuid = `TXN-${Date.now()}`;
        
        // eSewa secret key (for testing - in production, this should be on backend)
        const secretKey = "8gBm/:&EnhH.1/q";
        
        // eSewa payment parameters (v2 API format)
        const esewaParams = {
            amount: subtotal.toString(),
            tax_amount: taxAmount.toString(),
            total_amount: total.toString(),
            transaction_uuid: transactionUuid,
            product_code: "EPAYTEST", 
            product_service_charge: "0",
            product_delivery_charge: shipping.toString(),
            success_url: `${window.location.origin}/success`,
            failure_url: `${window.location.origin}/failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code"
        };

        // Generate signature
        const message = `total_amount=${esewaParams.total_amount},transaction_uuid=${esewaParams.transaction_uuid},product_code=${esewaParams.product_code}`;
        const signature = await generateSignature(message, secretKey);
        esewaParams.signature = signature;

        // Create form and submit to eSewa
        const form = document.createElement("form");
        form.method = "POST";
        // Testing URL - for production use: https://epay.esewa.com.np/api/epay/main/v2/form
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        Object.keys(esewaParams).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = esewaParams[key];
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
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

    const subtotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shipping = 200;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
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
                        Complete your purchase safely and securely with eSewa
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 bg-white shadow-lg rounded-xl">
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
                                                    {errors.firstName.message}
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
                                                    {errors.lastName.message}
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
                                                placeholder="Phone Number"
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
                                                    errors.phone
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                {...register("phone", {
                                                    required:
                                                        "Phone number is required",
                                                    pattern: {
                                                        value: /^[0-9+\-\s()]+$/,
                                                        message:
                                                            "Invalid phone number",
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
                                                required: "Address is required",
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
                                                        value: /^[0-9]+$/,
                                                        message:
                                                            "ZIP code must contain only numbers",
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
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
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
                                            className="text-blue-600 mt-1"
                                        />
                                        <p className="text-sm text-blue-800">
                                            Your payment is secure and encrypted
                                            through eSewa.
                                        </p>
                                    </div>

                                    <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg text-center">
                                        <div className="h-16 w-full mx-auto mb-4 flex items-center justify-center bg-white rounded">
                                            <span className="text-2xl font-bold text-green-600">eSewa</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            Pay with eSewa
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Fast, secure, and trusted payment
                                            gateway in Nepal
                                        </p>
                                        <div className="bg-white p-4 rounded-lg inline-block">
                                            <p className="text-sm text-gray-600">
                                                Total Amount
                                            </p>
                                            <p className="text-3xl font-bold text-orange-500">
                                                Rs. {total}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Subtotal
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                Rs. {subtotal}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Shipping
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                Rs. {shipping}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Tax (10%)
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                Rs. {tax}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                                        >
                                            Pay with eSewa{" "}
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 sticky top-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <img
                                            src={item.image}
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
                                                Rs. {item.price}
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
                                        Rs. {subtotal}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Shipping
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        Rs. {shipping}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Tax (10%)
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        Rs. {tax}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-900">
                                    Total
                                </span>
                                <span className="text-2xl font-bold text-orange-500">
                                    Rs. {total}
                                </span>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-xs text-blue-800">
                                <Truck
                                    size={16}
                                    className="mt-1 flex-shrink-0"
                                />
                                <p>Estimated delivery in 3-5 business days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default CheckOutPage;

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { ChevronDown, Truck, Lock, ArrowRight } from 'lucide-react';
// import Navbar from '@/ContentWrapper/Navbar';

// const CheckOutPage = () => {
//   const [step, setStep] = useState(1);
//   const [orderItems] = useState([
//     {
//       id: 1,
//       name: 'FANTECH (HQ56-BLACK) - TONE II WIRED GAMING HEADSET',
//       image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg',
//       price: 1138,
//       quantity: 1
//     },
//     {
//       id: 2,
//       name: 'I-phone 20W Charger For 14 Pro Max USB-C TO Lightning',
//       image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
//       price: 475,
//       quantity: 1
//     }
//   ]);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     trigger
//   } = useForm({
//     mode: 'onChange',
//     defaultValues: {
//       // Shipping Info
//       firstName: '',
//       lastName: '',
//       email: '',
//       phone: '',
//       address: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: '',
//       // Payment Info
//       cardName: '',
//       cardNumber: '',
//       expiry: '',
//       cvv: ''
//     }
//   });

//   const onSubmit = (data) => {
//     console.log('Form submitted:', data);
//     alert('Order placed successfully!');
//   };

//   const handleNextStep = async () => {
//     let isValid = false;

//     if (step === 1) {
//       isValid = await trigger([
//         'firstName', 'lastName', 'email', 'phone',
//         'address', 'city', 'state', 'zipCode', 'country'
//       ]);
//     } else if (step === 2) {
//       isValid = await trigger(['cardName', 'cardNumber', 'expiry', 'cvv']);
//     }

//     if (isValid) {
//       setStep(step + 1);
//     }
//   };

//   const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const shipping = 200;
//   const tax = Math.round(subtotal * 0.1);
//   const total = subtotal + shipping + tax;

//   return (
//     <div>
//         <Navbar/>
//       {/* Hero Section */}
//       <div className="relative h-64 md:h-80 overflow-hidden mb-8">
//         <img
//           src="https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
//           alt="Checkout hero"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/40"></div>
//         <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
//           <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
//             Secure Checkout
//           </h1>
//           <p className="text-xl md:text-2xl text-center max-w-2xl">
//             Complete your purchase safely and securely
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 pb-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Checkout Form */}
//           <div className="lg:col-span-2">
//             {/* Steps */}
//             <div className="bg-white rounded-lg p-6 mb-6">
//               <div className="flex items-center justify-between mb-8">
//                 <div className="flex items-center flex-1">
//                   <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
//                     1
//                   </div>
//                   <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
//                 </div>
//                 <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
//                   2
//                 </div>
//                 <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
//                 <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
//                   3
//                 </div>
//               </div>
//               <div className="flex justify-between text-sm font-medium">
//                 <span className={step >= 1 ? 'text-orange-500' : 'text-gray-500'}>Shipping</span>
//                 <span className={step >= 2 ? 'text-orange-500' : 'text-gray-500'}>Payment</span>
//                 <span className={step >= 3 ? 'text-orange-500' : 'text-gray-500'}>Confirmation</span>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)}>
//               {/* Step 1: Shipping Information */}
//               {step === 1 && (
//                 <div className="bg-white rounded-lg p-6">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div className="col-span-2 sm:col-span-1">
//                       <input
//                         type="text"
//                         placeholder="First Name"
//                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                           errors.firstName ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         {...register('firstName', {
//                           required: 'First name is required',
//                           minLength: {
//                             value: 2,
//                             message: 'First name must be at least 2 characters'
//                           }
//                         })}
//                       />
//                       {errors.firstName && (
//                         <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
//                       )}
//                     </div>
//                     <div className="col-span-2 sm:col-span-1">
//                       <input
//                         type="text"
//                         placeholder="Last Name"
//                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                           errors.lastName ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         {...register('lastName', {
//                           required: 'Last name is required',
//                           minLength: {
//                             value: 2,
//                             message: 'Last name must be at least 2 characters'
//                           }
//                         })}
//                       />
//                       {errors.lastName && (
//                         <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div className="col-span-2 sm:col-span-1">
//                       <input
//                         type="email"
//                         placeholder="Email Address"
//                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                           errors.email ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         {...register('email', {
//                           required: 'Email is required',
//                           pattern: {
//                             value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                             message: 'Invalid email address'
//                           }
//                         })}
//                       />
//                       {errors.email && (
//                         <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//                       )}
//                     </div>
//                     <div className="col-span-2 sm:col-span-1">
//                       <input
//                         type="tel"
//                         placeholder="Phone Number"
//                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                           errors.phone ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         {...register('phone', {
//                           required: 'Phone number is required',
//                           pattern: {
//                             value: /^[0-9+\-\s()]+$/,
//                             message: 'Invalid phone number'
//                           }
//                         })}
//                       />
//                       {errors.phone && (
//                         <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <input
//                       type="text"
//                       placeholder="Street Address"
//                       className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                         errors.address ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       {...register('address', {
//                         required: 'Address is required',
//                         minLength: {
//                           value: 5,
//                           message: 'Address must be at least 5 characters'
//                         }
//                       })}
//                     />
//                     {errors.address && (
//                       <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div className="col-span-2 sm:col-span-1">
//                       <input
//                         type="text"
//                         placeholder="City"
//                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                           errors.city ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         {...register('city', {
//                           required: 'City is required',
//                           minLength: {
//                             value: 2,
//                             message: 'City must be at least 2 characters'
//                           }
//                         })}
//                       />
//                       {errors.city && (
//                         <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
//                       )}
//                     </div>
//                     <div className="col-span-2 sm:col-span-1">
//                       <input
//                         type="text"
//                         placeholder="State/Province"
//                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                           errors.state ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         {...register('state', {
//                           required: 'State is required',
//                           minLength: {
//                             value: 2,
//                             message: 'State must be at least 2 characters'
//                           }
//                         })}
//                       />
//                       {errors.state && (
//                         <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 mb-6">
//                     <div className="col-span-2 sm:col-span-1">
//                       <input
//                         type="text"
//                         placeholder="ZIP Code"
//                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                           errors.zipCode ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         {...register('zipCode', {
//                           required: 'ZIP code is required',
//                           pattern: {
//                             value: /^[0-9]+$/,
//                             message: 'ZIP code must contain only numbers'
//                           }
//                         })}
//                       />
//                       {errors.zipCode && (
//                         <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
//                       )}
//                     </div>
//                     <div className="col-span-2 sm:col-span-1">
//                       <select
//                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 appearance-none ${
//                           errors.country ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         {...register('country', {
//                           required: 'Country is required'
//                         })}
//                       >
//                         <option value="">Select Country</option>
//                         <option value="nepal">Nepal</option>
//                         <option value="india">India</option>
//                         <option value="pakistan">Pakistan</option>
//                       </select>
//                       {errors.country && (
//                         <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={handleNextStep}
//                     className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
//                   >
//                     Continue to Payment <ArrowRight size={20} />
//                   </button>
//                 </div>
//               )}

//               {/* Step 2: Payment Information */}
//               {step === 2 && (
//                 <div className="bg-white rounded-lg p-6">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>

//                   <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
//                     <Lock size={20} className="text-blue-600 mt-1" />
//                     <p className="text-sm text-blue-800">Your payment is secure and encrypted. We never store your full card details.</p>
//                   </div>

//                   <div className="mb-4">
//                     <input
//                       type="text"
//                       placeholder="Cardholder Name"
//                       className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                         errors.cardName ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       {...register('cardName', {
//                         required: 'Cardholder name is required',
//                         minLength: {
//                           value: 2,
//                           message: 'Cardholder name must be at least 2 characters'
//                         }
//                       })}
//                     />
//                     {errors.cardName && (
//                       <p className="text-red-500 text-sm mt-1">{errors.cardName.message}</p>
//                     )}
//                   </div>

//                   <div className="mb-4">
//                     <input
//                       type="text"
//                       placeholder="Card Number (16 digits)"
//                       className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                         errors.cardNumber ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       {...register('cardNumber', {
//                         required: 'Card number is required',
//                         pattern: {
//                           value: /^[0-9]{16}$/,
//                           message: 'Card number must be 16 digits'
//                         }
//                       })}
//                     />
//                     {errors.cardNumber && (
//                       <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 mb-6">
//                     <div>
//                       <input
//                         type="text"
//                         placeholder="MM/YY"
//                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                           errors.expiry ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         {...register('expiry', {
//                           required: 'Expiry date is required',
//                           pattern: {
//                             value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
//                             message: 'Format must be MM/YY'
//                           }
//                         })}
//                       />
//                       {errors.expiry && (
//                         <p className="text-red-500 text-sm mt-1">{errors.expiry.message}</p>
//                       )}
//                     </div>
//                     <div>
//                       <input
//                         type="text"
//                         placeholder="CVV"
//                         className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
//                           errors.cvv ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         {...register('cvv', {
//                           required: 'CVV is required',
//                           pattern: {
//                             value: /^[0-9]{3,4}$/,
//                             message: 'CVV must be 3 or 4 digits'
//                           }
//                         })}
//                       />
//                       {errors.cvv && (
//                         <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex gap-4">
//                     <button
//                       type="button"
//                       onClick={() => setStep(1)}
//                       className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg"
//                     >
//                       Back
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleNextStep}
//                       className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
//                     >
//                       Review Order <ArrowRight size={20} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Step 3: Order Confirmation */}
//               {step === 3 && (
//                 <div className="bg-white rounded-lg p-6">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

//                   <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//                     <h3 className="font-bold text-green-900 mb-2">Order Ready for Confirmation</h3>
//                     <p className="text-sm text-green-800">Please review your information before placing the order.</p>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                     <h3 className="font-bold text-gray-900 mb-4">Shipping To:</h3>
//                     <p className="text-gray-700">{watch('firstName')} {watch('lastName')}</p>
//                     <p className="text-gray-700">{watch('address')}</p>
//                     <p className="text-gray-700">{watch('city')}, {watch('state')} {watch('zipCode')}</p>
//                     <p className="text-gray-700">{watch('country')}</p>
//                   </div>

//                   <div className="flex gap-4">
//                     <button
//                       type="button"
//                       onClick={() => setStep(2)}
//                       className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg"
//                     >
//                       Back
//                     </button>
//                     <button
//                       type="submit"
//                       className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg"
//                     >
//                       Place Order
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </form>
//           </div>

//           {/* Order Summary Sidebar */}
//           <div className="lg:col-span-1 sticky top-56 self-start">
//             <div className="bg-white rounded-lg p-6 sticky top-4">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

//               <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
//                 {orderItems.map(item => (
//                   <div key={item.id} className="flex gap-3">
//                     <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
//                       <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                       <p className="text-sm font-bold text-orange-500">Rs. {item.price}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-semibold text-gray-900">Rs. {subtotal}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping</span>
//                   <span className="font-semibold text-gray-900">Rs. {shipping}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Tax (10%)</span>
//                   <span className="font-semibold text-gray-900">Rs. {tax}</span>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center mb-6">
//                 <span className="text-lg font-bold text-gray-900">Total</span>
//                 <span className="text-2xl font-bold text-orange-500">Rs. {total}</span>
//               </div>

//               <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-xs text-blue-800">
//                 <Truck size={16} className="mt-1 flex-shrink-0" />
//                 <p>Estimated delivery in 3-5 business days</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CheckOutPage;
