import AdminWrapper from "@/AdminComponents/AdminWrapper";
import { Edit, Plus, Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import AddHomeForm from "@/AddFormComponents/AddHomeForm";

const Home = () => {
    const [allImage, setAllImage] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 9;

    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    useEffect(() => {
        const fetchImage = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await axios.get(route("ourhome.index"));
                
                // Handle different response structures
                let images = [];
                
                if (Array.isArray(response.data)) {
                    // If response.data is directly an array
                    images = response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    // If response has data property that's an array (common in Laravel pagination)
                    images = response.data.data;
                } else if (response.data && response.data.images) {
                    // If response has images property
                    images = response.data.images;
                } else {
                    // If it's an object, convert to array
                    images = Object.values(response.data);
                }
                
                // Ensure we have an array
                setAllImage(Array.isArray(images) ? images : []);
            } catch (error) {
                console.error("Fetching error ", error);
                setError("Failed to load images");
                setAllImage([]);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [reloadTrigger]);

    // Calculate pagination values - with safety checks
    const safeAllImage = Array.isArray(allImage) ? allImage : [];
    const offset = currentPage * itemsPerPage;
    const currentItems = safeAllImage.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(safeAllImage.length / itemsPerPage);

    // Handle page change
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
        setShowAddForm(false);
        setEditingImage(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this image?")) {
            return;
        }

        try {
            await axios.delete(route("ourhome.destroy", { id: id }));
            setReloadTrigger((prev) => !prev);

            // Adjust current page if we deleted the last item on the page
            const newTotalItems = safeAllImage.length - 1;
            const newPageCount = Math.ceil(newTotalItems / itemsPerPage);
            if (currentPage >= newPageCount && newPageCount > 0) {
                setCurrentPage(newPageCount - 1);
            }
        } catch (error) {
            console.log(error);
            alert("Failed to delete image");
        }
    };

    const handleEdit = (image) => {
        setEditingImage(image);
        setShowAddForm(true); // Use the same form for editing
    };

    const handleAddNew = () => {
        setEditingImage(null);
        setShowAddForm(true);
    };

    const handleAddSuccess = () => {
        setReloadTrigger((prev) => !prev);
        setShowAddForm(false);
        setEditingImage(null);

        // If we're adding a new item, potentially go to the last page
        const newTotalItems = safeAllImage.length + 1;
        const newPageCount = Math.ceil(newTotalItems / itemsPerPage);
        if (newPageCount > pageCount) {
            setCurrentPage(newPageCount - 1);
        }
    };

    const handleCloseForms = () => {
        setShowAddForm(false);
        setEditingImage(null);
    };

    const getImageUrl = (image) => {
        if (!image) return "";
        return image.image_path ? `${imgurl}/${image.image_path}` : "";
    };

    return (
        <AdminWrapper>
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Home
                        </h1>
                        {safeAllImage.length > 0 && (
                            <p className="text-gray-600 mt-1">
                                {safeAllImage.length} image(s) total
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="w-full sm:w-auto py-2.5 px-4 sm:px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                        <Plus size={18} className="hidden sm:block" />
                        <span>Add Image</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                        <p className="mt-2 text-gray-600">Loading images...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Add/Edit Form */}
                <AddHomeForm
                    showForm={showAddForm}
                    setShowForm={setShowAddForm}
                    onSuccess={handleAddSuccess}
                    onClose={handleCloseForms}
                    editingHome={editingImage}
                    setEditingHome={setEditingImage}
                />

                {/* Image Grid */}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {currentItems.map((image, index) => (
                                <div
                                    key={image.id || index}
                                    className="relative group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={getImageUrl(image)}
                                            alt={`Home image ${offset + index + 1}`}
                                            className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                            }}
                                        />

                                        {/* Action Buttons */}
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => handleEdit(image)}
                                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-md"
                                                aria-label="Edit image"
                                            >
                                                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(image.id)}
                                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-md"
                                                aria-label="Delete image"
                                            >
                                                <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="p-4">
                                        {image.title && (
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                                {image.title}
                                            </h3>
                                        )}
                                        {image.sub_title && (
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                {image.sub_title}
                                            </p>
                                        )}
                                        {image.description && (
                                            <p className="text-sm text-gray-500 line-clamp-3">
                                                {image.description}
                                            </p>
                                        )}
                                        
                                        {/* Show placeholder if no text content */}
                                        {!image.title && !image.sub_title && !image.description && (
                                            <p className="text-sm text-gray-400 italic">
                                                No text content added
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pageCount > 1 && (
                            <div className="flex justify-center mt-8">
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel="Next ›"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={1}
                                    pageCount={pageCount}
                                    previousLabel="‹ Previous"
                                    renderOnZeroPageCount={null}
                                    forcePage={currentPage}
                                    className="flex items-center space-x-1"
                                    pageClassName="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                    activeClassName="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md"
                                    previousClassName="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                    nextClassName="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                    disabledClassName="px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed rounded-md"
                                    breakClassName="px-3 py-2 text-sm font-medium text-gray-500"
                                />
                            </div>
                        )}

                        {/* Empty State */}
                        {safeAllImage.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500">
                                No images added yet. Click "Add Image" to get started.
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminWrapper>
    );
};

export default Home;