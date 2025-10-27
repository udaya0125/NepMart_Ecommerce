import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AddSubCategoryForm = ({ 
    showForm, 
    setShowForm, 
    allCategory, 
    setReloadTrigger,
    editingSubCategory, // New prop for edit mode
    setEditingSubCategory // New prop to clear edit state
}) => {
    const [subCategoryForm, setSubCategoryForm] = useState({
        category_id: "",
        sub_category: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    // Determine if we're in edit mode
    const isEditMode = Boolean(editingSubCategory);

    useEffect(() => {
        if (showForm) {
            if (isEditMode && editingSubCategory) {
                // Pre-fill form with existing data for edit
                setSubCategoryForm({
                    category_id: editingSubCategory.category_id || "",
                    sub_category: editingSubCategory.sub_category || "",
                });
            } else {
                // Reset form for add mode
                setSubCategoryForm({
                    category_id: "",
                    sub_category: "",
                });
            }
            setErrors({});
        }
    }, [showForm, isEditMode, editingSubCategory]);

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSubCategoryForm((prev) => ({
            ...prev,
            category_id: value,
        }));

        if (errors.category_id) {
            setErrors(prev => ({
                ...prev,
                category_id: null
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleCreate = async (formData) => {
        try {
            await axios.post(route("subcategory.store"), formData);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            console.error(
                "Error creating subcategory:",
                error.response?.data || error.message
            );
            throw error;
        }
    };

    const handleUpdate = async (formData, id) => {
        try {
            await axios.put(route("subcategory.update", { id }), formData);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            console.error(
                "Error updating subcategory:",
                error.response?.data || error.message
            );
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setErrors({});

        const formData = {
            category_id: subCategoryForm.category_id,
            sub_category: subCategoryForm.sub_category
        };

        try {
            if (isEditMode) {
                await handleUpdate(formData, editingSubCategory.id);
            } else {
                await handleCreate(formData);
            }
            
            setSubCategoryForm({ category_id: "", sub_category: "" });
            setShowForm(false);
            setEditingSubCategory(null); // Clear edit state
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'saving'} subcategory:`, error);
        } finally {
            setIsSubmitted(false);
        }
    };

    const handleClose = () => {
        setSubCategoryForm({ category_id: "", sub_category: "" });
        setErrors({});
        setShowForm(false);
        setEditingSubCategory(null); // Clear edit state when closing
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[50rem] p-6 ">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isEditMode ? "Edit Sub-Category" : "Add New Sub-Category"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={subCategoryForm.category_id}
                            onChange={handleCategoryChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.category_id 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        >
                            <option value="">Select Category</option>
                            {allCategory.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.category}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.category_id[0]}</p>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sub Category Name
                        </label>
                        <input
                            type="text"
                            name="sub_category"
                            value={subCategoryForm.sub_category}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.sub_category 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Enter sub category name"
                        />
                        {errors.sub_category && (
                            <p className="mt-1 text-sm text-red-600">{errors.sub_category[0]}</p>
                        )}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitted}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitted 
                                ? (isEditMode ? "Updating..." : "Saving...") 
                                : (isEditMode ? "Update" : "Save")
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategoryForm;