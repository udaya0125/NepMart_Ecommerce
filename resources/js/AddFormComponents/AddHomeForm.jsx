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
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
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
    } = useForm();

    // Reset form when component mounts or showForm changes
    useEffect(() => {
        if (!showForm) {
            resetForm();
        }
    }, [showForm]);

    // Handle editing mode
    useEffect(() => {
        if (editingHome) {
            // If editing, you might want to handle it differently
            // For now, we'll just log it
            console.log("Editing home:", editingHome);
        }
    }, [editingHome]);

    const resetForm = () => {
        // Revoke preview URLs to prevent memory leaks
        previewImages.forEach((url) => URL.revokeObjectURL(url));
        setPreviewImages([]);
        setSelectedFiles([]);
        setServerError("");
        reset();
    };

    // Handle Create - Updated for multiple images
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(route("ourhome.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Error creating images", error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                throw new Error(errorMessages.join(', '));
            }
            throw new Error(error.response?.data?.message || "Failed to upload images");
        }
    };

    // Handle Update - For editing single image
    const handleUpdate = async (id, formData) => {
        try {
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

    // Handle Form Submit - FIXED: Use images[] for array format to match Laravel controller
    const onSubmit = async (data) => {
        if (selectedFiles.length === 0) {
            setError("images", {
                type: "manual",
                message: "Please select at least one image",
            });
            return;
        }

        const formData = new FormData();

        if (editingHome) {
            // Editing mode - single image
            formData.append("image", selectedFiles[0]); // Use 'image' for single file update
        } else {
            // Create mode - multiple images
            selectedFiles.forEach((file) => {
                formData.append("images[]", file); // Use 'images[]' for multiple files
            });
        }

        try {
            setSubmitting(true);
            setServerError("");
            
            let result;
            if (editingHome) {
                result = await handleUpdate(editingHome.id, formData);
            } else {
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
            setServerError(error.message || `Failed to ${editingHome ? 'update' : 'upload'} image(s). Please try again.`);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Image Selection
    const handleImageChange = (e) => {
        const files = e.target.files;
        clearErrors("images");
        setServerError("");

        if (!files || files.length === 0) {
            setError("images", {
                type: "manual",
                message: "Please select at least one image",
            });
            setValue("images", null);
            return;
        }

        const validFiles = [];
        const invalidFiles = [];

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                invalidFiles.push(file.name);
            } else if (file.size > 2 * 1024 * 1024) {
                invalidFiles.push(`${file.name} (too large)`);
            } else {
                validFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {
            setError("images", {
                type: "manual",
                message: `Some files were invalid: ${invalidFiles.join(", ")}`,
            });
        }

        if (validFiles.length > 0) {
            // Revoke previous preview URLs
            previewImages.forEach((url) => URL.revokeObjectURL(url));
            
            const previewUrls = validFiles.map((file) => URL.createObjectURL(file));
            setPreviewImages(previewUrls);
            setSelectedFiles(validFiles);

            setValue("images", validFiles, {
                shouldValidate: true,
                shouldDirty: true,
            });
        } else {
            setValue("images", null);
            setSelectedFiles([]);
            setPreviewImages([]);
        }
    };

    // Remove single image
    const removeImage = (index) => {
        // Revoke the URL for the removed image
        URL.revokeObjectURL(previewImages[index]);
        
        const newPreviewImages = previewImages.filter((_, i) => i !== index);
        const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
        
        setPreviewImages(newPreviewImages);
        setSelectedFiles(newSelectedFiles);
        
        if (newSelectedFiles.length === 0) {
            setValue("images", null);
            setError("images", {
                type: "manual",
                message: "Please select at least one image",
            });
        } else {
            setValue("images", newSelectedFiles);
        }
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
                className="mx-auto relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {editingHome ? "Edit Home Image" : "Add Home Images"}
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

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                        <input
                            type="file"
                            id="home-images"
                            multiple={!editingHome} // Only allow multiple if not editing
                            accept="image/*"
                            className="hidden"
                            {...register("images", {
                                validate: {
                                    atLeastOne: (files) => 
                                        files && files.length > 0 || "Please select at least one image"
                                }
                            })}
                            onChange={handleImageChange}
                            disabled={submitting}
                        />
                        <label 
                            htmlFor="home-images" 
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
                                PNG, JPG, GIF, WebP up to 2MB 
                                {!editingHome && " (Multiple images allowed)"}
                                {editingHome && " (Select one image to replace the current one)"}
                            </p>
                        </label>
                        {errors.images && (
                            <p className="text-red-500 text-sm mt-3">
                                {errors.images.message}
                            </p>
                        )}
                    </div>

                    {previewImages.length > 0 && (
                        <div>
                            <h3 className="text-md font-medium text-gray-700 mb-3">
                                Preview ({previewImages.length} image{previewImages.length !== 1 ? 's' : ''})
                                {editingHome && previewImages.length > 1 && (
                                    <span className="text-orange-600 text-sm ml-2">
                                        Only the first image will be used for update
                                    </span>
                                )}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {previewImages.map((src, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={src}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-md"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center rounded-md">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                disabled={submitting}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <Image className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Show current image when editing */}
                    {editingHome && !previewImages.length && (
                        <div>
                            <h3 className="text-md font-medium text-gray-700 mb-3">Current Image</h3>
                            <div className="relative">
                                <img
                                    src={`${import.meta.env.VITE_IMAGE_PATH}/${editingHome.image_path}`}
                                    alt="Current home image"
                                    className="w-full max-w-xs h-32 object-cover rounded-md"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                    }}
                                />
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
                            disabled={submitting || selectedFiles.length === 0}
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
                                editingHome 
                                    ? `Update Image` 
                                    : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHomeForm;