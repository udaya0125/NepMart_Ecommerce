import React from "react";
import { useFormContext } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { usePage } from "@inertiajs/react";
import axios from "axios";

const ShippingInformation = ({ onNextStep, isProcessing }) => {
    const {
        register,
        formState: { errors },
        trigger,
        setValue,
    } = useFormContext();

    const handleNextStep = async () => {
        const isValid = await trigger([
            "fullName",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "zipCode",
            "country",
        ]);
        
        if (isValid) {
            onNextStep();
        }
    };

    const { auth } = usePage().props;

    const handleAutoFill = async () => {
        if (!auth.user) {
            alert("Please log in to use auto-fill");
            return;
        }

        try {
            const response = await axios(route("ouruser.index"));
            const users = response.data.data;
            
            // Find current user in the list
            const currentUser = users.find(user => user.id === auth.user.id);
            
            if (currentUser) {
                // Set form values
                setValue("fullName", currentUser.name || '');
                setValue("email", currentUser.email || '');
                setValue("phone", currentUser.phone_no || '');
                setValue("address", currentUser.street_address || '');
                setValue("city", currentUser.city || '');
                setValue("state", currentUser.state_province || '');
                setValue("zipCode", currentUser.zip_code || '');
                setValue("country", "Nepal"); // Default to Nepal

                // Trigger validation to clear any existing errors
                trigger([
                    "fullName",
                    "email",
                    "phone",
                    "address",
                    "city",
                    "state",
                    "zipCode",
                    "country",
                ]);
            } else {
                alert("User information not found");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Failed to auto-fill information");
        }
    };

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Shipping Information
                </h2>
                {auth.user && (
                    <button
                        type="button"
                        onClick={handleAutoFill}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-6"
                    >
                        Auto Fill
                    </button>
                )}
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
                        errors.fullName
                            ? "border-red-500"
                            : "border-gray-300"
                    }`}
                    {...register("fullName", {
                        required: "Full name is required",
                        minLength: {
                            value: 2,
                            message: "Full name must be at least 2 characters",
                        },
                    })}
                />
                {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.fullName.message}
                    </p>
                )}
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
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
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
                            required: "Phone number is required",
                            pattern: {
                                value: /^[9][0-9]{9}$/,
                                message: "Invalid Nepali phone number (must start with 9 and be 10 digits)",
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
                            message: "Address must be at least 5 characters",
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
                            required: "City is required",
                            minLength: {
                                value: 2,
                                message: "City must be at least 2 characters",
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
                            required: "State is required",
                            minLength: {
                                value: 2,
                                message: "State must be at least 2 characters",
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
                            required: "ZIP code is required",
                            pattern: {
                                value: /^[0-9]{5}$/,
                                message: "ZIP code must be exactly 5 digits",
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
                            required: "Country is required",
                        })}
                    >
                        <option value="">Select Country</option>
                        <option value="Nepal">Nepal</option>
                        <option value="India">India</option>
                        <option value="Pakistan">Pakistan</option>
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
                disabled={isProcessing}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Continue to Payment <ArrowRight size={20} />
            </button>
        </div>
    );
};

export default ShippingInformation;