import React, { useState } from "react";
import {
    Save,
    User,
    Camera,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { usePage } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AdminWrapper from "@/AdminComponents/AdminWrapper";

const AdminSetting = () => {
    const { auth } = usePage().props;
    const currentUser = auth.user;
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);

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
        },
    });

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

        // Append all form data
        Object.keys(data).forEach((key) => {
            if (
                data[key] !== null &&
                data[key] !== "" &&
                data[key] !== undefined
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

    const handleCancel = () => {
        // Reset form to original user data
        reset({
            name: currentUser.name || "",
            email: currentUser.email || "",
            current_password: "",
            new_password: "",
            new_password_confirmation: "",
            image: null,
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

    return (
        <div>
            <AdminWrapper>
                <div className="">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Account Settings
                            </h1>
                            <p className="text-gray-600">
                                Manage your profile information and security
                                settings
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
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
                                                    {imagePreview ? (
                                                        <img
                                                            src={imagePreview}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={
                                                                currentUser.image
                                                                    ? `storage/${currentUser.image}`
                                                                    : "user/user3.png"
                                                            }
                                                            alt={
                                                                currentUser.name
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
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
                                                Click camera icon to change
                                                photo
                                            </p>
                                            <p className="text-blue-100 text-xs mt-1">
                                                JPG, PNG or GIF. Max size 2MB
                                            </p>
                                            {errors.image && (
                                                <p className="text-red-200 text-sm mt-2">
                                                    {errors.image.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
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
                                                    {...register("name", {
                                                        required:
                                                            "Name is required",
                                                        minLength: {
                                                            value: 2,
                                                            message:
                                                                "Name must be at least 2 characters",
                                                        },
                                                    })}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                        errors.name
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Enter your full name"
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.name.message}
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
                                                        {...register("email", {
                                                            required:
                                                                "Email is required",
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message:
                                                                    "Invalid email address",
                                                            },
                                                        })}
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
                                                        {errors.email.message}
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
                                                        currentUser.role || ""
                                                    }
                                                    disabled
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                                    placeholder="e.g., Administrator, Manager, Editor"
                                                />
                                                <p className="text-gray-500 text-xs mt-1">
                                                    Role cannot be changed
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200"></div>

                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsPasswordSectionOpen(
                                                    !isPasswordSectionOpen
                                                )
                                            }
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Lock
                                                    className="text-blue-600"
                                                    size={24}
                                                />
                                                <h2 className="text-xl font-semibold text-gray-900">
                                                    Change Password
                                                </h2>
                                            </div>
                                            {isPasswordSectionOpen ? (
                                                <ChevronUp
                                                    className="text-gray-600"
                                                    size={24}
                                                />
                                            ) : (
                                                <ChevronDown
                                                    className="text-gray-600"
                                                    size={24}
                                                />
                                            )}
                                        </button>

                                        {isPasswordSectionOpen && (
                                            <div className="mt-6">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
                                                    <p className="text-sm text-blue-800">
                                                        Leave password fields
                                                        empty if you don't want
                                                        to change your password
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
                                                            Confirm New Password
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
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
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
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </AdminWrapper>
        </div>
    );
};

export default AdminSetting;
