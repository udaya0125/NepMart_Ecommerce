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

    // Star Rating Component
    const StarRating = ({ rating, onRatingChange }) => {
        const [hoverRating, setHoverRating] = useState(0);

        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRatingChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <svg
                            className={`w-8 h-8 ${
                                star <= (hoverRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                            }`}
                            stroke="currentColor"
                            strokeWidth="1"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                        </svg>
                    </button>
                ))}
            </div>
        );
    };

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
        
        // Validate rating
        if (!reviewForm.rating) {
            alert("Please select a rating");
            return;
        }
        
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
                        <StarRating
                            rating={parseInt(reviewForm.rating) || 0}
                            onRatingChange={(star) => {
                                setReviewForm((prev) => ({
                                    ...prev,
                                    rating: star.toString(),
                                }));
                            }}
                        />                     
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