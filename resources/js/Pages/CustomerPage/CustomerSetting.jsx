import React, { useState } from "react";
import {
    Save,
    User,
    Camera,
    Mail,
    Lock,
    Eye,
    EyeOff,
    MapPin,
    Phone,
    Trash2,
    AlertTriangle,
    Crown,
    Send,
} from "lucide-react";
import { usePage } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Navbar from "@/ContentWrapper/Navbar";

const CustomerSetting = () => {
    const { auth } = usePage().props;
    const currentUser = auth.user;
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
    const [isDeleteSectionOpen, setIsDeleteSectionOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAdminApplicationOpen, setIsAdminApplicationOpen] = useState(false);
    const [isSubmittingApplication, setIsSubmittingApplication] =
        useState(false);
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);
    const [activePage, setActivePage] = useState("personal");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors,
        setValue,
    } = useForm({
        defaultValues: {
            name: currentUser.name || "",
            email: currentUser.email || "",
            current_password: "",
            new_password: "",
            new_password_confirmation: "",
            image: null,
            street_address: currentUser.street_address || "",
            city: currentUser.city || "",
            zip_code: currentUser.zip_code || "",
            state_province: currentUser.state_province || "",
            phone_no: currentUser.phone_no || "",
            admin_application_reason: "",
            admin_application_skills: "",
            admin_application_experience: "",
        },
    });

    // Navigation items
    const navItems = [
        {
            id: "personal",
            label: "Personal Information",
            icon: User,
            description: "Manage your basic profile information",
        },
        {
            id: "address",
            label: "Address Information",
            icon: MapPin,
            description: "Update your contact address",
        },
        {
            id: "security",
            label: "Security",
            icon: Lock,
            description: "Change password and account security",
        },
    ];

    // Add admin application to nav items if user is not admin
    if (currentUser.role !== "admin") {
        navItems.push({
            id: "admin",
            label: "Become an Admin",
            icon: Crown,
            description: "Apply for administrator privileges",
        });
    }

    // Watch password fields for validation
    const watchNewPassword = watch("new_password");
    const watchConfirmPassword = watch("new_password_confirmation");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError("image", {
                    type: "manual",
                    message: "Image size must be less than 2MB",
                });
                return;
            }

            setValue("image", file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            clearErrors("image");
        }
    };

    // Real-time validation for confirm password
    React.useEffect(() => {
        if (watchConfirmPassword && watchNewPassword !== watchConfirmPassword) {
            setError("new_password_confirmation", {
                type: "manual",
                message: "Passwords do not match",
            });
        } else {
            clearErrors("new_password_confirmation");
        }
    }, [watchNewPassword, watchConfirmPassword, setError, clearErrors]);

    const handleFormSubmit = async (data) => {
        // Clear any existing confirm password errors
        clearErrors("new_password_confirmation");

        // Validate that passwords match if any password field is filled
        if (
            data.current_password ||
            data.new_password ||
            data.new_password_confirmation
        ) {
            if (data.new_password !== data.new_password_confirmation) {
                setError("new_password_confirmation", {
                    type: "manual",
                    message: "Passwords do not match",
                });
                return;
            }

            if (data.new_password && data.new_password.length < 8) {
                setError("new_password", {
                    type: "manual",
                    message: "Password must be at least 8 characters",
                });
                return;
            }
        }

        setIsSaving(true);

        const formDataToSend = new FormData();

        // Append all form data except admin application fields
        Object.keys(data).forEach((key) => {
            if (
                data[key] !== null &&
                data[key] !== "" &&
                data[key] !== undefined &&
                !key.startsWith("admin_application_") 
            ) {
                // Skip confirm password field for backend
                if (key !== "new_password_confirmation") {
                    formDataToSend.append(key, data[key]);
                }
            }
        });

        formDataToSend.append("_method", "PUT");
        formDataToSend.append("role", currentUser.role);

        try {
            const response = await axios.post(
                route("ouruser.update", { id: currentUser.id }),
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setIsSaving(false);
            alert("Settings saved successfully!");

            // Reset password fields
            setValue("current_password", "");
            setValue("new_password", "");
            setValue("new_password_confirmation", "");
        } catch (error) {
            console.error("Update error:", error);
            setIsSaving(false);
            if (error.response?.data?.errors) {
                // Handle backend validation errors
                const backendErrors = error.response.data.errors;
                Object.keys(backendErrors).forEach((key) => {
                    setError(key, {
                        type: "manual",
                        message: backendErrors[key][0],
                    });
                });
            } else {
                alert("Error updating settings");
            }
        }
    };

    // Handle Admin Application Submission
    const handleAdminApplication = async (data) => {
        if (!data.admin_application_reason.trim()) {
            alert("Please provide a reason for wanting to become an admin.");
            return;
        }

        setIsSubmittingApplication(true);

        try {
            // Create application data with the specified field mapping
            const applicationData = {
                user_id: currentUser.id,
                user_name: currentUser.name,
                email: currentUser.email,
                subject: data.admin_application_reason, // "Why do you want to become an admin?"
                message: data.admin_application_skills || "No skills provided", // "Relevant Skills & Qualifications"
                content:
                    data.admin_application_experience ||
                    "No previous experience provided", // "Previous Experience"
            };

            // Send admin application
            const response = await axios.post(
                route("ourmessage.store"),
                applicationData
            );

            setIsSubmittingApplication(false);
            setApplicationSubmitted(true);
            alert(
                "Admin application submitted successfully! We will review your request and get back to you soon."
            );

            // Reset admin application fields
            setValue("admin_application_reason", "");
            setValue("admin_application_skills", "");
            setValue("admin_application_experience", "");
        } catch (error) {
            console.error("Admin application error:", error);
            setIsSubmittingApplication(false);

            if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors)
                    .flat()
                    .join(", ");
                alert(`Validation Error: ${errorMessages}`);
            } else {
                alert("Error submitting admin application. Please try again.");
            }
        }
    };

    const handleCancel = () => {
        // Reset form to original user data
        reset({
            name: currentUser.name || "",
            email: currentUser.email || "",
            current_password: "",
            new_password: "",
            new_password_confirmation: "",
            image: null,
            street_address: currentUser.street_address || "",
            city: currentUser.city || "",
            zip_code: currentUser.zip_code || "",
            state_province: currentUser.state_province || "",
            phone_no: currentUser.phone_no || "",
            admin_application_reason: "",
            admin_application_skills: "",
            admin_application_experience: "",
        });
        setImagePreview(null);
        clearErrors();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Handle Delete Account
    const handleDeleteAccount = async () => {
        // Prevent deleting yourself (additional safety check)
        if (currentUser.id === currentUser.id) {
            alert("You cannot delete your own account from this page.");
            return;
        }

        if (
            !confirm(
                "Are you sure you want to delete your account? This action cannot be undone!"
            )
        ) {
            return;
        }

        // Additional confirmation with email
        const confirmed = window.prompt(
            `Please type "${currentUser.email}" to confirm account deletion:`
        );

        if (confirmed !== currentUser.email) {
            alert("Email confirmation failed. Account deletion cancelled.");
            return;
        }

        setIsDeleting(true);

        try {
            await axios.delete(
                route("ouruser.destroy", { id: currentUser.id })
            );
            alert("Account deleted successfully!");
            // Redirect to login or home page after deletion
            window.location.href = "/";
        } catch (error) {
            console.error("Delete error:", error);
            setIsDeleting(false);
            if (error.response?.status === 403) {
                alert("You don't have permission to delete this account.");
            } else {
                alert("Error deleting account");
            }
        }
    };

    const handleDeleteConfirmTextChange = (e) => {
        setDeleteConfirmText(e.target.value);
    };

    const isDeleteConfirmed = deleteConfirmText === "delete my account";

    // Auto-open sections based on active page
    React.useEffect(() => {
        if (activePage === "security") {
            setIsPasswordSectionOpen(true);
        } else {
            setIsPasswordSectionOpen(false);
        }

        if (activePage === "admin") {
            setIsAdminApplicationOpen(true);
        } else {
            setIsAdminApplicationOpen(false);
        }

        if (activePage === "delete") {
            setIsDeleteSectionOpen(true);
        } else {
            setIsDeleteSectionOpen(false);
        }
    }, [activePage]);

    return (
        <div>
            <>
                <Navbar />
                <div
                    className="relative h-96 overflow-hidden bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
                    }}
                >
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-wide">
                            Account Settings
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 mb-6">
                            Manage your profile information and security
                            settings
                        </p>
                    </div>
                </div>
                <div className="mt-16 mb-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sidebar Navigation */}
                            <div className="lg:w-1/4 sticky top-20 self-start">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                    <nav className="space-y-2">
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() =>
                                                        setActivePage(item.id)
                                                    }
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                                                        activePage === item.id
                                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                            : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <Icon
                                                        size={20}
                                                        className={
                                                            activePage ===
                                                            item.id
                                                                ? "text-blue-600"
                                                                : "text-gray-400"
                                                        }
                                                    />
                                                    <div>
                                                        <div className="font-medium">
                                                            {item.label}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="lg:w-3/4">
                                <form onSubmit={handleSubmit(handleFormSubmit)}>
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                        {/* Profile Header - Only show on personal page */}
                                        {activePage === "personal" && (
                                            <div
                                                className="relative px-8 py-12 bg-cover bg-center bg-no-repeat"
                                                style={{
                                                    backgroundImage:
                                                        "url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                                                <div className="relative z-10">
                                                    <div className="flex flex-col items-center">
                                                        <div className="relative group">
                                                            <div className="w-32 h-32 rounded-full overflow-hidden bg-white shadow-xl ring-4 ring-white">
                                                                <img
                                                                    src={
                                                                        imagePreview
                                                                            ? imagePreview
                                                                            : currentUser?.image
                                                                            ? `/storage/${currentUser.image}`
                                                                            : "/user/user01.png"
                                                                    }
                                                                    alt={
                                                                        currentUser?.name ||
                                                                        "Profile"
                                                                    }
                                                                    className="w-full h-full object-cover rounded-full"
                                                                />
                                                            </div>
                                                            <label className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                                <Camera
                                                                    size={20}
                                                                    className="text-gray-700"
                                                                />
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={
                                                                        handleImageChange
                                                                    }
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        </div>
                                                        <p className="text-white text-sm mt-4">
                                                            Click camera icon to
                                                            change photo
                                                        </p>
                                                        <p className="text-blue-100 text-xs mt-1">
                                                            JPG, PNG or GIF. Max
                                                            size 2MB
                                                        </p>
                                                        {errors.image && (
                                                            <p className="text-red-200 text-sm mt-2">
                                                                {
                                                                    errors.image
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-8 space-y-8">
                                            {/* Personal Information Section - Only show when active */}
                                            {activePage === "personal" && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-6">
                                                        <User
                                                            className="text-blue-600"
                                                            size={24}
                                                        />
                                                        <h2 className="text-xl font-semibold text-gray-900">
                                                            Personal Information
                                                        </h2>
                                                    </div>

                                                    <div className="space-y-5">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Full Name{" "}
                                                                <span className="text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                {...register(
                                                                    "name",
                                                                    {
                                                                        required:
                                                                            "Name is required",
                                                                        minLength:
                                                                            {
                                                                                value: 2,
                                                                                message:
                                                                                    "Name must be at least 2 characters",
                                                                            },
                                                                    }
                                                                )}
                                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                                    errors.name
                                                                        ? "border-red-500"
                                                                        : "border-gray-300"
                                                                }`}
                                                                placeholder="Enter your full name"
                                                            />
                                                            {errors.name && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {
                                                                        errors
                                                                            .name
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Email Address{" "}
                                                                <span className="text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <div className="relative">
                                                                <Mail
                                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                                    size={20}
                                                                />
                                                                <input
                                                                    type="email"
                                                                    {...register(
                                                                        "email",
                                                                        {
                                                                            required:
                                                                                "Email is required",
                                                                            pattern:
                                                                                {
                                                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                                    message:
                                                                                        "Invalid email address",
                                                                                },
                                                                        }
                                                                    )}
                                                                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                                        errors.email
                                                                            ? "border-red-500"
                                                                            : "border-gray-300"
                                                                    }`}
                                                                    placeholder="your.email@example.com"
                                                                />
                                                            </div>
                                                            {errors.email && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {
                                                                        errors
                                                                            .email
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Phone Number
                                                            </label>
                                                            <div className="relative">
                                                                <Phone
                                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                                    size={20}
                                                                />
                                                                <input
                                                                    type="tel"
                                                                    {...register(
                                                                        "phone_no",
                                                                        {
                                                                            pattern:
                                                                                {
                                                                                    value: /^[+]?[\d\s\-()]+$/,
                                                                                    message:
                                                                                        "Please enter a valid phone number",
                                                                                },
                                                                        }
                                                                    )}
                                                                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                                        errors.phone_no
                                                                            ? "border-red-500"
                                                                            : "border-gray-300"
                                                                    }`}
                                                                    placeholder="Enter your phone number"
                                                                />
                                                            </div>
                                                            {errors.phone_no && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {
                                                                        errors
                                                                            .phone_no
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Role{" "}
                                                                <span className="text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    currentUser.role ||
                                                                    ""
                                                                }
                                                                disabled
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                                                placeholder="e.g., Administrator, Manager, Editor"
                                                            />
                                                            <p className="text-gray-500 text-xs mt-1">
                                                                Role cannot be
                                                                changed
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Address Section - Only show when active */}
                                            {activePage === "address" && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-6">
                                                        <MapPin
                                                            className="text-blue-600"
                                                            size={24}
                                                        />
                                                        <h2 className="text-xl font-semibold text-gray-900">
                                                            Address Information
                                                        </h2>
                                                    </div>

                                                    <div className="space-y-5">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Street Address
                                                            </label>
                                                            <input
                                                                type="text"
                                                                {...register(
                                                                    "street_address"
                                                                )}
                                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                                    errors.street_address
                                                                        ? "border-red-500"
                                                                        : "border-gray-300"
                                                                }`}
                                                                placeholder="Enter your street address"
                                                            />
                                                            {errors.street_address && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {
                                                                        errors
                                                                            .street_address
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    City
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    {...register(
                                                                        "city"
                                                                    )}
                                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                                        errors.city
                                                                            ? "border-red-500"
                                                                            : "border-gray-300"
                                                                    }`}
                                                                    placeholder="Enter your city"
                                                                />
                                                                {errors.city && (
                                                                    <p className="text-red-500 text-sm mt-1">
                                                                        {
                                                                            errors
                                                                                .city
                                                                                .message
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    State/Province
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    {...register(
                                                                        "state_province"
                                                                    )}
                                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                                        errors.state_province
                                                                            ? "border-red-500"
                                                                            : "border-gray-300"
                                                                    }`}
                                                                    placeholder="Enter your state/province"
                                                                />
                                                                {errors.state_province && (
                                                                    <p className="text-red-500 text-sm mt-1">
                                                                        {
                                                                            errors
                                                                                .state_province
                                                                                .message
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                ZIP/Postal Code
                                                            </label>
                                                            <input
                                                                type="text"
                                                                {...register(
                                                                    "zip_code",
                                                                    {
                                                                        pattern:
                                                                            {
                                                                                value: /^[A-Z0-9\s-]+$/,
                                                                                message:
                                                                                    "Please enter a valid postal code",
                                                                            },
                                                                    }
                                                                )}
                                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                                    errors.zip_code
                                                                        ? "border-red-500"
                                                                        : "border-gray-300"
                                                                }`}
                                                                placeholder="Enter your ZIP/postal code"
                                                            />
                                                            {errors.zip_code && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {
                                                                        errors
                                                                            .zip_code
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Password Section - Only show when active */}
                                            {activePage === "security" && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-6">
                                                        <Lock
                                                            className="text-blue-600"
                                                            size={24}
                                                        />
                                                        <h2 className="text-xl font-semibold text-gray-900">
                                                            Change Password
                                                        </h2>
                                                    </div>

                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
                                                        <p className="text-sm text-blue-800">
                                                            Leave password
                                                            fields empty if you
                                                            don't want to change
                                                            your password
                                                        </p>
                                                    </div>

                                                    <div className="space-y-5">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Current Password
                                                            </label>
                                                            <div className="relative">
                                                                <Lock
                                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                                    size={20}
                                                                />
                                                                <input
                                                                    type={
                                                                        showPassword
                                                                            ? "text"
                                                                            : "password"
                                                                    }
                                                                    {...register(
                                                                        "current_password"
                                                                    )}
                                                                    className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                                        errors.current_password
                                                                            ? "border-red-500"
                                                                            : "border-gray-300"
                                                                    }`}
                                                                    placeholder="Enter current password"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        togglePasswordVisibility
                                                                    }
                                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                                >
                                                                    {showPassword ? (
                                                                        <EyeOff
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <Eye
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    )}
                                                                </button>
                                                            </div>
                                                            {errors.current_password && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {
                                                                        errors
                                                                            .current_password
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                New Password
                                                            </label>
                                                            <div className="relative">
                                                                <Lock
                                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                                    size={20}
                                                                />
                                                                <input
                                                                    type={
                                                                        showPassword
                                                                            ? "text"
                                                                            : "password"
                                                                    }
                                                                    {...register(
                                                                        "new_password",
                                                                        {
                                                                            minLength:
                                                                                {
                                                                                    value: 8,
                                                                                    message:
                                                                                        "Password must be at least 8 characters",
                                                                                },
                                                                        }
                                                                    )}
                                                                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                                        errors.new_password
                                                                            ? "border-red-500"
                                                                            : "border-gray-300"
                                                                    }`}
                                                                    placeholder="Enter new password (min. 8 characters)"
                                                                />
                                                            </div>
                                                            {errors.new_password && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {
                                                                        errors
                                                                            .new_password
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Confirm New
                                                                Password
                                                            </label>
                                                            <div className="relative">
                                                                <Lock
                                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                                    size={20}
                                                                />
                                                                <input
                                                                    type={
                                                                        showConfirmPassword
                                                                            ? "text"
                                                                            : "password"
                                                                    }
                                                                    {...register(
                                                                        "new_password_confirmation"
                                                                    )}
                                                                    className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                                        errors.new_password_confirmation
                                                                            ? "border-red-500"
                                                                            : "border-gray-300"
                                                                    }`}
                                                                    placeholder="Confirm new password"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        toggleConfirmPasswordVisibility
                                                                    }
                                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                                >
                                                                    {showConfirmPassword ? (
                                                                        <EyeOff
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <Eye
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    )}
                                                                </button>
                                                            </div>
                                                            {errors.new_password_confirmation && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {
                                                                        errors
                                                                            .new_password_confirmation
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Delete Account Section within Security */}
                                                    <div className="mt-12 pt-8 border-t border-gray-200">
                                                        <div className="flex items-center gap-2 mb-6">
                                                            <AlertTriangle
                                                                className="text-red-600"
                                                                size={24}
                                                            />
                                                            <h2 className="text-xl font-semibold text-red-900">
                                                                Delete Account
                                                            </h2>
                                                        </div>

                                                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                                            <div className="flex items-start gap-3 mb-4">
                                                                <AlertTriangle
                                                                    className="text-red-600 mt-0.5"
                                                                    size={20}
                                                                />
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                                                                        Danger
                                                                        Zone
                                                                    </h3>
                                                                    <p className="text-red-700 text-sm">
                                                                        Once you
                                                                        delete
                                                                        your
                                                                        account,
                                                                        there is
                                                                        no going
                                                                        back.
                                                                        This
                                                                        action
                                                                        is
                                                                        permanent
                                                                        and will
                                                                        remove
                                                                        all your
                                                                        data
                                                                        from our
                                                                        system.
                                                                        Please
                                                                        be
                                                                        certain.
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-red-700 mb-2">
                                                                        Type
                                                                        "delete
                                                                        my
                                                                        account"
                                                                        to
                                                                        confirm
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            deleteConfirmText
                                                                        }
                                                                        onChange={
                                                                            handleDeleteConfirmTextChange
                                                                        }
                                                                        className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                                                        placeholder="delete my account"
                                                                    />
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleDeleteAccount
                                                                    }
                                                                    disabled={
                                                                        !isDeleteConfirmed ||
                                                                        isDeleting
                                                                    }
                                                                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                    {isDeleting
                                                                        ? "Deleting Account..."
                                                                        : "Permanently Delete Account"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Become Admin Application Section - Only show when active */}
                                            {activePage === "admin" &&
                                                currentUser.role !==
                                                    "admin" && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-6">
                                                            <Crown
                                                                className="text-purple-600"
                                                                size={24}
                                                            />
                                                            <h2 className="text-xl font-semibold text-purple-900">
                                                                Become an Admin
                                                            </h2>
                                                        </div>

                                                        {applicationSubmitted ? (
                                                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                                                <Crown
                                                                    className="text-green-600 mx-auto mb-3"
                                                                    size={48}
                                                                />
                                                                <h3 className="text-xl font-semibold text-green-900 mb-2">
                                                                    Application
                                                                    Submitted!
                                                                </h3>
                                                                <p className="text-green-700">
                                                                    Thank you
                                                                    for your
                                                                    interest in
                                                                    becoming an
                                                                    admin. We
                                                                    have
                                                                    received
                                                                    your
                                                                    application
                                                                    and will
                                                                    review it
                                                                    shortly. You
                                                                    will be
                                                                    notified via
                                                                    email once a
                                                                    decision is
                                                                    made.
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-5">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Why do
                                                                        you want
                                                                        to
                                                                        become
                                                                        an
                                                                        admin?{" "}
                                                                        <span className="text-red-500">
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <textarea
                                                                        {...register(
                                                                            "admin_application_reason",
                                                                            {
                                                                                required:
                                                                                    "Please provide a reason for your application",
                                                                            }
                                                                        )}
                                                                        rows={4}
                                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                                                            errors.admin_application_reason
                                                                                ? "border-red-500"
                                                                                : "border-gray-300"
                                                                        }`}
                                                                        placeholder="Please explain why you want to become an administrator and how you plan to contribute to the platform..."
                                                                    />
                                                                    {errors.admin_application_reason && (
                                                                        <p className="text-red-500 text-sm mt-1">
                                                                            {
                                                                                errors
                                                                                    .admin_application_reason
                                                                                    .message
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Relevant
                                                                        Skills &
                                                                        Qualifications
                                                                    </label>
                                                                    <textarea
                                                                        {...register(
                                                                            "admin_application_skills"
                                                                        )}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                                        placeholder="List any relevant skills, experience, or qualifications that make you suitable for an admin role..."
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Previous
                                                                        Experience
                                                                        (if any)
                                                                    </label>
                                                                    <textarea
                                                                        {...register(
                                                                            "admin_application_experience"
                                                                        )}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                                        placeholder="Describe any previous experience you have in administrative roles, community management, or similar responsibilities..."
                                                                    />
                                                                </div>

                                                                <div className="flex justify-end">
                                                                    <button
                                                                        type="button"
                                                                        onClick={handleSubmit(
                                                                            handleAdminApplication
                                                                        )}
                                                                        disabled={
                                                                            isSubmittingApplication
                                                                        }
                                                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                                    >
                                                                        <Send
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                        {isSubmittingApplication
                                                                            ? "Submitting..."
                                                                            : "Submit Application"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            {/* Action Buttons - Show for all pages except delete */}
                                            {activePage !== "delete" &&
                                                activePage !== "security" && (
                                                    <div className="flex justify-end gap-4 pt-6">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleCancel
                                                            }
                                                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={isSaving}
                                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                                                        >
                                                            <Save size={20} />
                                                            {isSaving
                                                                ? "Saving..."
                                                                : "Save Changes"}
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
};

export default CustomerSetting;
