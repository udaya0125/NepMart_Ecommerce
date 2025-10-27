import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddProductForm = ({ showForm, onCancel, allCategory, onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
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

    // Stock options
    const stockOptions = [
        { value: "true", label: "In Stock" },
        { value: "false", label: "Out of Stock" },
    ];

    // Shipping options
    const shippingOptions = [
        { value: "false", label: "No" },
        { value: "true", label: "Yes" },
    ];

    // Extract unique categories from allCategory
    const categoryOptions = allCategory.map((item) => ({
        value: item.id,
        label: item.category,
    }));

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
            name: "",
            price: "",
            discount: "",
            short_description: "",
            long_description: "",
            sizes: "",
            colors: "",
            in_stock: null,
            stock_quantity: "",
            estimated_delivery: "",
            free_shipping: null,
            returns: "",
            features: "",
            brand: "",
            sku: "",
            category: null,
            sub_category: null,
            images: [],
        },
    });

    const watchedCategory = watch("category");
    const watchedImages = watch("images");

    // Get subcategories based on selected category
    const getSubCategoryOptions = (selectedCategory) => {
        if (!selectedCategory) return [];
        const selectedCategoryData = allCategory.find(
            (item) => item.id === selectedCategory.value
        );
        if (
            selectedCategoryData &&
            selectedCategoryData.sub_categories.length > 0
        ) {
            return selectedCategoryData.sub_categories.map((sub) => ({
                value: sub.id,
                label: sub.sub_category,
            }));
        }
        return [];
    };

    // Generate image previews when images change
    useEffect(() => {
        if (!watchedImages || watchedImages.length === 0) {
            setImagePreviews([]);
            return;
        }
        const newImagePreviews = [];
        const files = Array.from(watchedImages);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newImagePreviews.push(e.target.result);
                if (newImagePreviews.length === files.length) {
                    setImagePreviews(newImagePreviews);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [watchedImages]);

    const removeImage = (index) => {
        const newFiles = Array.from(watchedImages || []);
        newFiles.splice(index, 1);
        const dataTransfer = new DataTransfer();
        newFiles.forEach((file) => dataTransfer.items.add(file));
        setValue("images", dataTransfer.files);
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const formData = new FormData();

            // Append basic fields
            Object.keys(data).forEach((key) => {
                if (key === "images") {
                    if (data.images && data.images.length > 0) {
                        const files = Array.from(data.images);
                        files.forEach((file, index) => {
                            formData.append(`images[${index}]`, file);
                        });
                    }
                } else if (key === "category") {
                    if (data[key]) {
                        formData.append("category_id", data[key].value);
                    }
                } else if (key === "sub_category") {
                    if (data[key]) {
                        formData.append("sub_category_id", data[key].value);
                    }
                } else if (key === "in_stock" || key === "free_shipping") {
                    if (data[key]) {
                        formData.append(key, data[key].value === "true" ? "1" : "0");
                    } else {
                        // Set default values if not selected
                        formData.append(key, key === "in_stock" ? "1" : "0");
                    }
                } else if (key !== "images") {
                    const value = data[key];
                    if (value !== null && value !== undefined && value !== "") {
                        formData.append(key, String(value));
                    }
                }
            });

            await axios.post(route("ourproducts.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            onSuccess();
            reset();
            setImagePreviews([]);
        } catch (error) {
            console.error("Error saving product", error);
            alert(
                "Error saving product: " +
                    (error.response?.data?.message || error.message)
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        setImagePreviews([]);
        onCancel();
    };

    // Clear subcategory when category changes
    useEffect(() => {
        if (watchedCategory) {
            setValue("sub_category", null);
        }
    }, [watchedCategory, setValue]);

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 ${
                showForm ? "block" : "hidden"
            }`}
        >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-full sm:max-w-2xl md:max-w-4xl max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                        Add Product
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
                        {/* Product Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                {...register("name", {
                                    required: "Product name is required",
                                })}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("price", {
                                    required: "Price is required",
                                    min: { value: 0, message: "Price must be positive" }
                                })}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>

                        {/* Discount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                {...register("discount")}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            />
                        </div>

                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU
                            </label>
                            <input
                                type="text"
                                {...register("sku")}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand
                            </label>
                            <input
                                type="text"
                                {...register("brand")}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={categoryOptions}
                                        className="react-select-container text-sm"
                                        classNamePrefix="react-select"
                                        isClearable
                                        placeholder="Select category..."
                                        menuPortalTarget={document.body}
                                        styles={
                                            isMobile
                                                ? {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                      control: (base) => ({
                                                          ...base,
                                                          fontSize: "14px",
                                                          minHeight: "36px",
                                                      }),
                                                  }
                                                : {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                  }
                                        }
                                    />
                                )}
                            />
                        </div>

                        {/* Sub Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sub Category
                            </label>
                            <Controller
                                name="sub_category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={getSubCategoryOptions(watchedCategory)}
                                        className="react-select-container text-sm"
                                        classNamePrefix="react-select"
                                        isDisabled={!watchedCategory}
                                        isClearable
                                        placeholder="Select sub category..."
                                        menuPortalTarget={document.body}
                                        styles={
                                            isMobile
                                                ? {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                      control: (base) => ({
                                                          ...base,
                                                          fontSize: "14px",
                                                          minHeight: "36px",
                                                      }),
                                                  }
                                                : {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                  }
                                        }
                                    />
                                )}
                            />
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                min="0"
                                {...register("stock_quantity")}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            />
                        </div>

                        {/* Estimated Delivery */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estimated Delivery
                            </label>
                            <input
                                type="text"
                                {...register("estimated_delivery")}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="e.g., 3-5 business days"
                            />
                        </div>

                        {/* In Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                In Stock
                            </label>
                            <Controller
                                name="in_stock"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={stockOptions}
                                        className="react-select-container text-sm"
                                        classNamePrefix="react-select"
                                        isClearable
                                        placeholder="Select stock status..."
                                        menuPortalTarget={document.body}
                                        styles={
                                            isMobile
                                                ? {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                      control: (base) => ({
                                                          ...base,
                                                          fontSize: "14px",
                                                          minHeight: "36px",
                                                      }),
                                                  }
                                                : {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                  }
                                        }
                                    />
                                )}
                            />
                        </div>

                        {/* Free Shipping */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Free Shipping
                            </label>
                            <Controller
                                name="free_shipping"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={shippingOptions}
                                        className="react-select-container text-sm"
                                        classNamePrefix="react-select"
                                        isClearable
                                        placeholder="Select shipping option..."
                                        menuPortalTarget={document.body}
                                        styles={
                                            isMobile
                                                ? {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                      control: (base) => ({
                                                          ...base,
                                                          fontSize: "14px",
                                                          minHeight: "36px",
                                                      }),
                                                  }
                                                : {
                                                      menuPortal: (base) => ({
                                                          ...base,
                                                          zIndex: 9999,
                                                      }),
                                                  }
                                        }
                                    />
                                )}
                            />
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sizes
                            </label>
                            <input
                                type="text"
                                {...register("sizes")}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="e.g., S, M, L, XL"
                            />
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Colors
                            </label>
                            <input
                                type="text"
                                {...register("colors")}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="e.g., Red, Blue, Green"
                            />
                        </div>

                        {/* Short Description */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Short Description
                            </label>
                            <textarea
                                {...register("short_description")}
                                rows="3"
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            />
                        </div>

                        {/* Long Description */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Long Description
                            </label>
                            <Controller
                                name="long_description"
                                control={control}
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
                        </div>

                        {/* Features */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Features
                            </label>
                            <Controller
                                name="features"
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

                        {/* Returns Policy */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Returns Policy
                            </label>
                            <input
                                type="text"
                                {...register("returns")}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                placeholder="e.g., 30 days return policy"
                            />
                        </div>

                        {/* Image File */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Images *
                            </label>
                            <input
                                type="file"
                                {...register("images", {
                                    required: "At least one image is required",
                                })}
                                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                                accept="image/*"
                                multiple
                            />
                            {errors.images && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.images.message}
                                </p>
                            )}
                            {imagePreviews.length > 0 && (
                                <div className="mt-3 sm:mt-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Selected Images:
                                    </p>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-md border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1"
                                                >
                                                    <X size={isMobile ? 10 : 14} />
                                                </button>
                                            </div>
                                        ))}
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
                            {submitting ? "Saving..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;