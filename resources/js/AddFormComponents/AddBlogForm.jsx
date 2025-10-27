import { X } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddBlogForm = ({ 
    showForm, 
    onCancel, 
    allCategory, 
    onSuccess, 
    editingBlog 
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(
        window.innerWidth >= 768 && window.innerWidth < 1024
    );

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // React Quill modules configuration
    const quillModules = {
        toolbar: isMobile
            ? [["bold", "italic", "underline"], ["link"]]
            : [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["link"],
                  ["clean"],
              ],
    };

    const quillFormats = isMobile
        ? ["bold", "italic", "underline", "link"]
        : [
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "list",
              "bullet",
              "indent",
              "link",
          ];

    // Category options - memoized to prevent unnecessary re-renders
    const categoryOptions = useMemo(() => 
        allCategory.map((item) => ({
            value: item.id,
            label: item.category,
        })),
        [allCategory]
    );

    const {
        control,
        handleSubmit,
        watch,
        reset,
        register,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            author: "",
            excerpt: "",
            category_id: null,
            read_time: "",
            image: null,
            introduction: "",
            key_features: "",
        },
    });

    const watchedImage = watch("image");

    // Generate image preview when image changes
    useEffect(() => {
        if (!watchedImage || watchedImage.length === 0) {
            setImagePreview(null);
            return;
        }

        const file = watchedImage[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }, [watchedImage]);

    // Set form values when editing - fixed dependency array
    useEffect(() => {
        if (editingBlog) {
            const selectedCategory = categoryOptions.find(
                cat => cat.value === editingBlog.category_id
            );

            reset({
                title: editingBlog.title || "",
                author: editingBlog.author || "",
                excerpt: editingBlog.excerpt || "",
                category_id: selectedCategory || null,
                read_time: editingBlog.read_time || "",
                introduction: editingBlog.introduction || "",
                key_features: editingBlog.key_features || "",
                image: null, // Don't pre-fill image file input
            });
            
            if (editingBlog.image) {
                setImagePreview(editingBlog.image);
            }
        } else {
            reset({
                title: "",
                author: "",
                excerpt: "",
                category_id: null,
                read_time: "",
                image: null,
                introduction: "",
                key_features: "",
            });
            setImagePreview(null);
        }
    }, [editingBlog, reset]); // Removed categoryOptions from dependencies

    const removeImage = () => {
        setValue("image", null);
        setImagePreview(null);
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const formData = new FormData();

            // Append basic fields
            formData.append('title', data.title);
            formData.append('author', data.author);
            formData.append('excerpt', data.excerpt);
            formData.append('read_time', data.read_time);
            formData.append('introduction', data.introduction);
            formData.append('key_features', data.key_features || '');
            
            if (data.category_id) {
                formData.append('category_id', data.category_id.value);
            }

            // Handle image
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            } else if (!editingBlog) {
                // For new blog, image is required
                throw new Error("Image is required");
            }

            if (editingBlog) {
                // For update, use PUT method
                formData.append("_method", "PUT");
                await axios.post(
                    route("ourblog.update", { id: editingBlog.id }),
                    formData,
                    {
                        headers: { 
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                // For create
                await axios.post(route("ourblog.store"), formData, {
                    headers: { 
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            onSuccess();
            reset();
            setImagePreview(null);
        } catch (error) {
            console.error("Error saving blog", error);
            alert(
                "Error saving blog: " +
                    (error.response?.data?.message || error.message)
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        setImagePreview(null);
        onCancel();
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-full sm:max-w-2xl md:max-w-4xl max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                        {editingBlog ? "Edit Blog" : "Add New Blog"}
                    </h1>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
                    >
                        <X size={isMobile ? 20 : 24} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3 sm:space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {/* Blog Title */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Blog Title *
                            </label>
                            <input
                                type="text"
                                {...register("title", {
                                    required: "Blog title is required",
                                })}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="Enter blog title"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Author *
                            </label>
                            <input
                                type="text"
                                {...register("author", {
                                    required: "Author is required",
                                })}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="Enter author name"
                            />
                            {errors.author && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.author.message}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <Controller
                                name="category_id"
                                control={control}
                                rules={{ required: "Category is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={categoryOptions}
                                        className="react-select-container text-sm"
                                        classNamePrefix="react-select"
                                        isClearable
                                        placeholder="Select category..."
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                            }),
                                            control: (base) => ({
                                                ...base,
                                                fontSize: isMobile ? "14px" : "16px",
                                                minHeight: isMobile ? "36px" : "40px",
                                            }),
                                        }}
                                    />
                                )}
                            />
                            {errors.category_id && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.category_id.message}
                                </p>
                            )}
                        </div>

                        {/* Read Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Read Time *
                            </label>
                            <input
                                type="text"
                                {...register("read_time", {
                                    required: "Read time is required",
                                })}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="e.g., 5 min"
                            />
                            {errors.read_time && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.read_time.message}
                                </p>
                            )}
                        </div>

                        {/* Excerpt */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Excerpt *
                            </label>
                            <textarea
                                {...register("excerpt", {
                                    required: "Excerpt is required",
                                })}
                                rows="3"
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="Enter brief excerpt"
                            />
                            {errors.excerpt && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.excerpt.message}
                                </p>
                            )}
                        </div>

                        {/* Introduction */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Introduction *
                            </label>
                            <Controller
                                name="introduction"
                                control={control}
                                rules={{ required: "Introduction is required" }}
                                render={({ field }) => (
                                    <ReactQuill
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        className="h-32 sm:h-40 mb-8 sm:mb-12"
                                    />
                                )}
                            />
                            {errors.introduction && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.introduction.message}
                                </p>
                            )}
                        </div>

                        {/* Key Features */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Key Features
                            </label>
                            <Controller
                                name="key_features"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        theme="snow"
                                        className="h-28 sm:h-32 mb-8 sm:mb-10"
                                    />
                                )}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Featured Image {!editingBlog && "*"}
                            </label>
                            <input
                                type="file"
                                {...register("image", {
                                    required: !editingBlog ? "Image is required" : false,
                                })}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                                accept="image/*"
                            />
                            {errors.image && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.image.message}
                                </p>
                            )}
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-3 sm:mt-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Image Preview:
                                    </p>
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-md border"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3 pt-3 sm:pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 mb-2 sm:mb-0"
                        >
                            {submitting 
                                ? "Saving..." 
                                : editingBlog 
                                    ? "Update Blog" 
                                    : "Add Blog"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBlogForm;