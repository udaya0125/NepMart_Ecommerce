import React, { useState, useEffect } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import {
    User,
    Package,
    MapPin,
    CreditCard,
    Heart,
    Bell,
    Shield,
    LogOut,
    ChevronRight,
    Edit,
    Plus,
    Check,
    X,
    Camera,
} from "lucide-react";
import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";
import axios from "axios";

const MyAccount = () => {
    const { auth } = usePage().props;
    const currentUser = auth.user;

    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Profile form using Inertia's form helper
    const {
        data: profileData,
        setData: setProfileData,
        post: updateProfile,
        processing: isSaving,
        errors: profileErrors,
    } = useForm({
        name: "",
        email: "",
        phone_no: "",
        street_address: "",
        city: "",
        zip_code: "",
        state_province: "",
        image: null,
    });

    // Password form using Inertia's form helper
    const {
        data: passwordData,
        setData: setPasswordData,
        put: updatePassword,
        processing: isUpdatingPassword,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    // Initialize profile data with user data
    useEffect(() => {
        if (currentUser) {
            setProfileData({
                name: currentUser.name || "",
                email: currentUser.email || "",
                phone_no: currentUser.phone_no || "",
                street_address: currentUser.street_address || "",
                city: currentUser.city || "",
                zip_code: currentUser.zip_code || "",
                state_province: currentUser.state_province || "",
                image: null,
            });

            if (currentUser.image) {
                setImagePreview(`/storage/${currentUser.image}`);
            } else {
                setImagePreview("user/user01.png");
            }
        }
    }, [currentUser]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Image size must be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Set the image file in the form data
            setProfileData("image", file);
        }
    };

    const handleProfileUpdate = async () => {
        const formDataToSend = new FormData();

        // Append all form data
        Object.keys(profileData).forEach((key) => {
            if (
                profileData[key] !== null &&
                profileData[key] !== "" &&
                profileData[key] !== undefined
            ) {
                formDataToSend.append(key, profileData[key]);
            }
        });

        formDataToSend.append("_method", "PUT");

        try {
            const response = await axios.post(
                route("ouruser.update", { id: currentUser.id }),
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            if (error.response?.data?.errors) {
                // Handle backend validation errors
                const backendErrors = error.response.data.errors;
                alert(
                    "Error updating profile: " +
                        Object.values(backendErrors).join(", ")
                );
            } else {
                alert("Error updating profile");
            }
        }
    };

    const handlePasswordUpdate = async () => {
        if (
            passwordData.new_password !== passwordData.new_password_confirmation
        ) {
            alert("Passwords don't match");
            return;
        }

        if (passwordData.new_password && passwordData.new_password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append(
            "current_password",
            passwordData.current_password
        );
        formDataToSend.append("new_password", passwordData.new_password);
        formDataToSend.append("_method", "PUT");

        try {
            const response = await axios.post(
                route("ouruser.update", { id: currentUser.id }),
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            resetPassword();
            alert("Password updated successfully!");
        } catch (error) {
            console.error("Password update error:", error);
            if (error.response?.data?.errors) {
                // Handle backend validation errors
                const backendErrors = error.response.data.errors;
                alert(
                    "Error updating password: " +
                        Object.values(backendErrors).join(", ")
                );
            } else {
                alert("Error updating password");
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (
            !confirm(
                "Are you sure you want to delete your account? This action cannot be undone!"
            )
        ) {
            return;
        }

        const confirmed = window.prompt(
            `Please type "${currentUser.email}" to confirm account deletion:`
        );

        if (confirmed !== currentUser.email) {
            alert("Email confirmation failed. Account deletion cancelled.");
            return;
        }

        try {
            await axios.delete(
                route("ouruser.destroy", { id: currentUser.id })
            );
            alert("Account deleted successfully!");
            // Redirect to home page after deletion
            window.location.href = "/";
        } catch (error) {
            console.error("Delete error:", error);
            if (error.response?.status === 403) {
                alert("You don't have permission to delete this account.");
            } else {
                alert("Error deleting account");
            }
        }
    };

    const handleLogout = () => {
        axios
            .post(route("logout"))
            .then((response) => {
                if (response.data.redirect) {
                    window.location.href = response.data.redirect;
                } else {
                    window.location.href = "/login";
                }
            })
            .catch((error) => {
                console.error("Logout error:", error);
                window.location.href = "/login";
            });
    };

    const menuItems = [
        { id: "profile", icon: User, label: "Profile" },
        { id: "orders", icon: Package, label: "Orders" },
        { id: "payment", icon: CreditCard, label: "Payment Methods" },
        { id: "wishlist", icon: Heart, label: "Wishlist" },
        { id: "notifications", icon: Bell, label: "Notifications" },
        { id: "security", icon: Shield, label: "Security" },
    ];

    const recentOrders = [
        {
            id: "#12345",
            image: "product1.png",
            product_name: "Wireless Headphones",
            date: "Nov 10, 2025",
            total: "$159.99",
            items: 3,
        },
        {
            id: "#12344",
            image: "product1.png",
            product_name: "Smart Watch",
            date: "Nov 5, 2025",
            total: "$89.50",
            items: 2,
        },
        {
            id: "#12343",
            image: "product1.png",
            product_name: "Bluetooth Speaker",
            date: "Oct 28, 2025",
            total: "$234.00",
            items: 5,
        },
    ];

    const paymentMethods = [
        {
            id: 1,
            type: "eSewa",
            last4: "9841",
            isDefault: true,
            phone: "9841******",
        },
    ];

    const wishlistItems = [
        { id: 1, name: "Wireless Headphones", price: "$149.99", image: "🎧" },
        { id: 2, name: "Smart Watch", price: "$299.99", image: "⌚" },
        { id: 3, name: "Laptop Bag", price: "$79.99", image: "💼" },
    ];

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="mt-10 mb-10">
                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900 mb-1">
                                    My Account
                                </h1>
                                <p className="text-gray-600">
                                    Manage your profile and preferences
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">
                                    Sign Out
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-4 space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() =>
                                                setActiveTab(item.id)
                                            }
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                                activeTab === item.id
                                                    ? "bg-gray-900 text-white"
                                                    : "text-gray-700 hover:bg-[#EFE9E3]"
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">
                                                {item.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Profile Tab */}
                            {activeTab === "profile" && (
                                <div className="bg-white rounded-2xl p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-light text-gray-900">
                                            Profile Information
                                        </h2>
                                        {!isEditing ? (
                                            <button
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                                className="flex items-center gap-2 px-4 py-2 bg-[#EFE9E3] text-gray-900 rounded-full hover:bg-gray-300 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={
                                                        handleProfileUpdate
                                                    }
                                                    disabled={isSaving}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    {isSaving
                                                        ? "Saving..."
                                                        : "Save"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        // Reset form data
                                                        setProfileData({
                                                            name:
                                                                currentUser.name ||
                                                                "",
                                                            email:
                                                                currentUser.email ||
                                                                "",
                                                            phone_no:
                                                                currentUser.phone_no ||
                                                                "",
                                                            street_address:
                                                                currentUser.street_address ||
                                                                "",
                                                            city:
                                                                currentUser.city ||
                                                                "",
                                                            zip_code:
                                                                currentUser.zip_code ||
                                                                "",
                                                            state_province:
                                                                currentUser.state_province ||
                                                                "",
                                                            image: null,
                                                        });
                                                        if (currentUser.image) {
                                                            setImagePreview(
                                                                `/storage/${currentUser.image} `
                                                            );
                                                        } else {
                                                            setImagePreview(
                                                                "user/user01.png"
                                                            );
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Display profile errors */}
                                    {Object.keys(profileErrors).length > 0 && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                            <h3 className="text-red-800 font-medium mb-2">
                                                Please fix the following errors:
                                            </h3>
                                            <ul className="list-disc list-inside text-red-700 text-sm">
                                                {Object.entries(
                                                    profileErrors
                                                ).map(([key, error]) => (
                                                    <li key={key}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                                        {/* Profile Image */}
                                        <div className="flex flex-col items-center">
                                            <div className="relative">
                                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                    {imagePreview ? (
                                                        <img
                                                            src={imagePreview}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="w-16 h-16 text-gray-400" />
                                                    )}
                                                </div>
                                                {isEditing && (
                                                    <label
                                                        htmlFor="image-upload"
                                                        className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors"
                                                    >
                                                        <Camera className="w-4 h-4" />
                                                        <input
                                                            id="image-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={
                                                                handleImageChange
                                                            }
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        {/* Profile Form */}
                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    disabled={!isEditing}
                                                    onChange={(e) =>
                                                        setProfileData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-50 disabled:text-gray-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    disabled={!isEditing}
                                                    onChange={(e) =>
                                                        setProfileData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-50 disabled:text-gray-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={profileData.phone_no}
                                                    disabled={!isEditing}
                                                    onChange={(e) =>
                                                        setProfileData(
                                                            "phone_no",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-50 disabled:text-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="border-t pt-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Address Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Street Address
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        profileData.street_address
                                                    }
                                                    disabled={!isEditing}
                                                    onChange={(e) =>
                                                        setProfileData(
                                                            "street_address",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-50 disabled:text-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.city}
                                                    disabled={!isEditing}
                                                    onChange={(e) =>
                                                        setProfileData(
                                                            "city",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-50 disabled:text-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ZIP Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.zip_code}
                                                    disabled={!isEditing}
                                                    onChange={(e) =>
                                                        setProfileData(
                                                            "zip_code",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-50 disabled:text-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    State/Province
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        profileData.state_province
                                                    }
                                                    disabled={!isEditing}
                                                    onChange={(e) =>
                                                        setProfileData(
                                                            "state_province",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-50 disabled:text-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === "orders" && (
                                <div className="bg-white rounded-2xl p-8">
                                    <h2 className="text-2xl font-light text-gray-900 mb-6">
                                        Order History
                                    </h2>
                                    <div className="space-y-4">
                                        {recentOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-gray-600">
                                                        <span>
                                                            {order.items} items
                                                        </span>
                                                        <span className="mx-2">
                                                            •
                                                        </span>
                                                        <span className="font-medium text-gray-900">
                                                            {order.total}
                                                        </span>
                                                    </div>
                                                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Payment Methods Tab */}
                            {activeTab === "payment" && (
                                <div className="bg-white rounded-2xl p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-light text-gray-900">
                                            Payment Methods
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                                            >
                                                {/* Decorative gradient highlight on hover */}
                                                {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-green-50 via-green-100/50 to-white transition-opacity duration-300"></div> */}

                                                <div className="relative z-10 flex items-center justify-between p-6">
                                                    {/* Left Section - eSewa Info */}
                                                    <div className="flex items-center gap-5">
                                                        <div className="relative w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center shadow-inner ring-2 ring-green-200/40">
                                                            <img
                                                                src="payment/esewa2.png"
                                                                alt="eSewa"
                                                                className="w-11 h-11 object-contain"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-lg font-semibold text-gray-900">
                                                                    {
                                                                        method.type
                                                                    }
                                                                </p>
                                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                                                    Active
                                                                </span>
                                                            </div>

                                                            <p className="text-sm text-gray-500 font-mono tracking-wide">
                                                                •••• •••• ••••{" "}
                                                                {method.last4}
                                                            </p>

                                                            <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                                                                <svg
                                                                    className="w-4 h-4 text-green-600"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                                    />
                                                                </svg>
                                                                <span>
                                                                    {
                                                                        method.phone
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right Section - Status Icon */}
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600 border border-green-200 group-hover:bg-green-100 transition-all">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Wishlist Tab */}
                            {activeTab === "wishlist" && (
                                <div className="bg-white rounded-2xl p-8">
                                    <h2 className="text-2xl font-light text-gray-900 mb-6">
                                        My Wishlist
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {wishlistItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                                            >
                                                <div className="text-5xl mb-4 text-center">
                                                    {item.image}
                                                </div>
                                                <h3 className="font-medium text-gray-900 mb-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    {item.price}
                                                </p>
                                                <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
                                                    Add to Cart
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === "notifications" && (
                                <div className="bg-white rounded-2xl p-8">
                                    <h2 className="text-2xl font-light text-gray-900 mb-6">
                                        Notification Preferences
                                    </h2>
                                    <div className="space-y-6">
                                        {[
                                            "Order updates",
                                            "Promotions and offers",
                                            "New arrivals",
                                            "Newsletter",
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0"
                                            >
                                                <span className="text-gray-700">
                                                    {item}
                                                </span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        defaultChecked={
                                                            index < 2
                                                        }
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === "security" && (
                                <div className="bg-white rounded-2xl p-8">
                                    <h2 className="text-2xl font-light text-gray-900 mb-6">
                                        Security Settings
                                    </h2>

                                    {/* Display password errors */}
                                    {Object.keys(passwordErrors).length > 0 && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                            <h3 className="text-red-800 font-medium mb-2">
                                                Please fix the following errors:
                                            </h3>
                                            <ul className="list-disc list-inside text-red-700 text-sm">
                                                {Object.entries(
                                                    passwordErrors
                                                ).map(([key, error]) => (
                                                    <li key={key}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-4">
                                                Change Password
                                            </h3>
                                            <div className="space-y-4">
                                                <input
                                                    type="password"
                                                    placeholder="Current Password"
                                                    value={
                                                        passwordData.current_password
                                                    }
                                                    onChange={(e) =>
                                                        setPasswordData(
                                                            "current_password",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="New Password"
                                                    value={
                                                        passwordData.new_password
                                                    }
                                                    onChange={(e) =>
                                                        setPasswordData(
                                                            "new_password",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="Confirm New Password"
                                                    value={
                                                        passwordData.new_password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        setPasswordData(
                                                            "new_password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                />
                                                <button
                                                    onClick={
                                                        handlePasswordUpdate
                                                    }
                                                    disabled={
                                                        isUpdatingPassword
                                                    }
                                                    className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
                                                >
                                                    {isUpdatingPassword
                                                        ? "Updating..."
                                                        : "Update Password"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-gray-900 mb-1">
                                                        Two-Factor
                                                        Authentication
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Add an extra layer of
                                                        security to your account
                                                    </p>
                                                </div>
                                                <button className="px-6 py-3 bg-[#EFE9E3] text-gray-900 rounded-full hover:bg-gray-300 transition-colors">
                                                    Enable
                                                </button>
                                            </div>
                                        </div>

                                        {/* Account Deletion */}
                                        <div className="pt-6 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-red-900 mb-1">
                                                        Delete Account
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Permanently delete your
                                                        account and all data
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={
                                                        handleDeleteAccount
                                                    }
                                                    className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                                >
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyAccount;
