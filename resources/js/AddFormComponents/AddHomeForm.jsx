import { X, Upload, Image } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddHomeForm = ({
    showForm,
    setShowForm,
    onSuccess,
    onClose,
    editingHome = null,
    setEditingHome = null,
}) => {
    const [previewImage, setPreviewImage] = useState(null); 
    const [selectedFile, setSelectedFile] = useState(null); 
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        formState: { errors },
        reset,
        setError,
        clearErrors,
        handleSubmit: rhfHandleSubmit,
        setValue,
        watch,
    } = useForm();

    // Reset form when component mounts or showForm changes
    useEffect(() => {
        if (!showForm) {
            resetForm();
        }
    }, [showForm]);

    // Handle editing mode - populate form with existing data
    useEffect(() => {
        if (editingHome && showForm) {
            setValue("title", editingHome.title || "");
            setValue("sub_title", editingHome.sub_title || "");
            setValue("description", editingHome.description || "");
            setSelectedFile(null);
            setPreviewImage(null);
        }
    }, [editingHome, showForm, setValue]);

    const resetForm = () => {
        // Revoke preview URL to prevent memory leaks
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(null);
        setSelectedFile(null);
        setServerError("");
        reset({
            title: "",
            sub_title: "",
            description: ""
        });
    };

    // Handle Create - Single image upload
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(route("ourhome.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Error creating image", error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                throw new Error(errorMessages.join(', '));
            }
            throw new Error(error.response?.data?.message || "Failed to upload image");
        }
    };

    // Handle Update - Single image update
    const handleUpdate = async (id, data) => {
        try {
            const formData = new FormData();
            
            // Append all fields
            formData.append("title", data.title || "");
            formData.append("sub_title", data.sub_title || "");
            formData.append("description", data.description || "");
            
            // Append image if selected
            if (data.image) {
                formData.append("image", data.image);
            }
            
            // Use POST method with _method=PUT for Laravel
            const response = await axios.post(route("ourhome.update", { id }), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Error updating image", error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                throw new Error(errorMessages.join(', '));
            }
            throw new Error(error.response?.data?.message || "Failed to update image");
        }
    };

    // Handle Form Submit - Single image
    const onSubmit = async (data) => {
        if (!selectedFile && !editingHome) {
            setError("image", {
                type: "manual",
                message: "Please select an image",
            });
            return;
        }

        try {
            setSubmitting(true);
            setServerError("");
            
            let result;
            if (editingHome) {
                result = await handleUpdate(editingHome.id, data);
            } else {
                const formData = new FormData();
                formData.append("title", data.title || "");
                formData.append("sub_title", data.sub_title || "");
                formData.append("description", data.description || "");
                formData.append("image", data.image);
                
                result = await handleCreate(formData);
            }
            
            // Notify parent component of success
            if (onSuccess) {
                onSuccess(result);
            }
            resetForm();
            setShowForm(false);
        } catch (error) {
            console.log("Error saving data", error);
            setServerError(error.message || `Failed to ${editingHome ? 'update' : 'upload'} image. Please try again.`);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Image Selection - Single image only
    const handleImageChange = (e) => {
        const files = e.target.files;
        clearErrors("image");
        setServerError("");

        if (!files || files.length === 0) {
            setError("image", {
                type: "manual",
                message: "Please select an image",
            });
            setValue("image", null);
            return;
        }

        const file = files[0]; // Take only the first file

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("image", {
                type: "manual",
                message: "Please select a valid image file",
            });
            setValue("image", null);
            return;
        }

        // Validate file size
        if (file.size > 2 * 1024 * 1024) {
            setError("image", {
                type: "manual",
                message: "Image must be smaller than 2MB",
            });
            setValue("image", null);
            return;
        }

        // Revoke previous preview URL
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setSelectedFile(file);

        setValue("image", file, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // Remove image
    const removeImage = () => {
        // Revoke the URL for the removed image
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        
        setPreviewImage(null);
        setSelectedFile(null);
        
        setValue("image", null);
        setError("image", {
            type: "manual",
            message: "Please select an image",
        });
    };

    // Handle Modal Close
    const handleClose = () => {
        resetForm();
        if (onClose) {
            onClose();
        }
        setShowForm(false);
        if (setEditingHome) {
            setEditingHome(null);
        }
    };

    if (!showForm) return null;

    return (
        <div
            className={`min-h-screen py-12 px-4 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
                showForm
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
            }`}
            onClick={handleClose}
        >
            <div
                className="mx-auto relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {editingHome ? "Edit Home Image" : "Add Home Image"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close form"
                        disabled={submitting}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-6 p-6">
                    {/* Server Error Display */}
                    {serverError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{serverError}</p>
                        </div>
                    )}

                    {/* Text Fields Section */}
                    <div className="space-y-4">                     
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                {...register("title", {
                                    maxLength: {
                                        value: 255,
                                        message: "Title must be less than 255 characters"
                                    }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter title (optional)"
                                disabled={submitting}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="sub_title" className="block text-sm font-medium text-gray-700 mb-1">
                                Sub Title
                            </label>
                            <input
                                type="text"
                                id="sub_title"
                                {...register("sub_title", {
                                    maxLength: {
                                        value: 255,
                                        message: "Sub title must be less than 255 characters"
                                    }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter sub title (optional)"
                                disabled={submitting}
                            />
                            {errors.sub_title && (
                                <p className="text-red-500 text-sm mt-1">{errors.sub_title.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                {...register("description")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter description (optional)"
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                        <input
                            type="file"
                            id="home-image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={submitting}
                        />
                        <label 
                            htmlFor="home-image" 
                            className={`cursor-pointer ${submitting ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-indigo-600">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, GIF, WebP up to 2MB (Single image only)
                            </p>
                        </label>
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-3">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {/* Preview Section */}
                    {previewImage && (
                        <div>
                            <h3 className="text-md font-medium text-gray-700 mb-3">
                                Preview
                            </h3>
                            <div className="flex justify-center">
                                <div className="relative group">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full max-w-xs h-32 object-cover rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center rounded-md">
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            disabled={submitting}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        <Image className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show current image when editing */}
                    {editingHome && !previewImage && (
                        <div>
                            <h3 className="text-md font-medium text-gray-700 mb-3">Current Image</h3>
                            <div className="flex justify-center">
                                <div className="relative">
                                    <img
                                        src={`${import.meta.env.VITE_IMAGE_PATH}/${editingHome.image_path}`}
                                        alt="Current home image"
                                        className="w-full max-w-xs h-32 object-cover rounded-md"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                        }}
                                    />
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        Current image - select a new one to replace
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || (!editingHome && !selectedFile)}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-md transition-colors disabled:cursor-not-allowed flex items-center"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {editingHome ? 'Updating...' : 'Uploading...'}
                                </>
                            ) : (
                                editingHome ? 'Update Image' : 'Upload Image'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHomeForm;