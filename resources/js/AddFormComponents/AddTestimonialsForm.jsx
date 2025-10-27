import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const AddTestimonialsForm = ({ 
    showForm, 
    onCancel, 
    onSuccess, 
    editingReview,
    handleUpdate,
    setReloadTrigger
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        user: "",
        comment: "",
        rating: "",
        title: "",
    });

    // Use Effect
    useEffect(() => {
        if (editingReview) {
            setReviewForm({
                user: editingReview.user || "",
                comment: editingReview.comment || "",
                rating: editingReview.rating || "",
                title: editingReview.title || "",
            });
        } else {
            setReviewForm({
                user: "",
                comment: "",
                rating: "",
                title: "",
            });
        }
    }, [editingReview]);

    // Handle Create Review
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourreview.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev); // Trigger reload after create
        } catch (error) {
            console.log("Error creating review", error);
            throw error;
        }
    };

    // Handle Update Review
    const handleEdit = async (formData, id) => {
        try {
            await handleUpdate(formData, id);
            setReloadTrigger((prev) => !prev); // Trigger reload after edit
        } catch (error) {
            console.log("Error updating review", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Append all form data
        for (const key in reviewForm) {
            if (reviewForm[key] !== null && reviewForm[key] !== "") {
                formData.append(key, reviewForm[key]);
            }
        }

        try {
            setSubmitting(true);

            if (editingReview) {
                // Editing existing review
                await handleEdit(formData, editingReview.id);
            } else {
                // Creating new review
                await handleCreate(formData);
            }

            setReviewForm({
                user: "",
                comment: "",
                rating: "",
                title: "",
            });

            onSuccess();
        } catch (error) {
            console.log("Error saving data", error);
            alert("Error saving testimonial. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-800">
                        {editingReview ? "Edit Testimonial" : "Add New Testimonial"}
                    </h1>
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            User Name *
                        </label>
                        <input
                            type="text"
                            name="user"
                            value={reviewForm.user}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter user name"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={reviewForm.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter title"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating *
                        </label>
                        <select
                            name="rating"
                            value={reviewForm.rating}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select rating</option>
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                        </select>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comment *
                        </label>
                        <textarea
                            name="comment"
                            value={reviewForm.comment}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter comment"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting 
                                ? "Saving..." 
                                : editingReview 
                                    ? "Update Testimonial" 
                                    : "Add Testimonial"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTestimonialsForm;