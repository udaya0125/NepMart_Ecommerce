import AdminWrapper from '@/AdminComponents/AdminWrapper';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import AddTestimonialsForm from '@/AddFormComponents/AddTestimonialsForm';
import { useTable, useSortBy, usePagination } from 'react-table';
import {
    Plus,
    ChevronUp,
    ChevronDown,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Star
} from 'lucide-react';

// Star rating component
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={16}
                    className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                />
            ))}
        </div>
    );
};

const Testimonials = () => {
    const [showForm, setShowForm] = useState(false);
    const [allReview, setAllReview] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [loading, setLoading] = useState(true);

    // Define columns for react-table
    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "User",
                accessor: "user",
                Cell: ({ value }) => (
                    <div className="font-medium text-gray-900">{value}</div>
                ),
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <div className="max-w-xs truncate" title={value}>
                        {value}
                    </div>
                ),
            },
            {
                Header: "Comment",
                accessor: "comment",
                Cell: ({ value }) => (
                    <div className="max-w-md truncate" title={value}>
                        {value}
                    </div>
                ),
            },
            {
                Header: "Rating",
                accessor: "rating",
                Cell: ({ value }) => <StarRating rating={parseInt(value)} />,
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    // Use Effect to fetch testimonials
    useEffect(() => {
        const fetchReview = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourreview.index"));
                const reviewsData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.data || [];
                setAllReview(reviewsData);
            } catch (error) {
                console.error("fetching error ", error);
                setAllReview([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [reloadTrigger]); // This will refetch when reloadTrigger changes

    // handleDelete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
        
        try {
            await axios.delete(route("ourreview.destroy", { id }));
            setReloadTrigger((prev) => !prev); // Trigger reload after delete
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting testimonial. Please try again.");
        }
    };

    // handleEdit
    const handleEdit = (review) => {
        setEditingReview(review);
        setShowForm(true);
    };

    // HandleUpdate after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourreview.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            // Note: The reload trigger is now handled in AddTestimonialsForm
            return response.data;
        } catch (error) {
            console.log("Error updating review", error);
            throw error;
        }
    };

    const handleAddSuccess = () => {
        setShowForm(false);
        setEditingReview(null);
        // Removed the redundant setReloadTrigger call here
        // The reload is already handled in AddTestimonialsForm
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingReview(null);
    };

    // React Table instance
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: allReview,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useSortBy,
        usePagination
    );

    return (
        <AdminWrapper>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Testimonials Management
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
                        <button
                            onClick={() => {
                                setEditingReview(null);
                                setShowForm(true);
                            }}
                            className="py-2 md:py-3 px-4 md:px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={18} className="hidden md:block" />
                            <span>Add Testimonial</span>
                        </button>
                    </div>
                </div>

                {showForm && (
                    <AddTestimonialsForm
                        showForm={showForm}
                        onCancel={handleCancel}
                        onSuccess={handleAddSuccess}
                        editingReview={editingReview}
                        handleUpdate={handleUpdate}
                        setReloadTrigger={setReloadTrigger}
                    />
                )}

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading testimonials...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg shadow">
                            <table
                                {...getTableProps()}
                                className="min-w-full divide-y divide-gray-200"
                            >
                                <thead className="bg-gray-50">
                                    {headerGroups.map((headerGroup) => (
                                        <tr
                                            {...headerGroup.getHeaderGroupProps()}
                                        >
                                            {headerGroup.headers.map(
                                                (column) => (
                                                    <th
                                                        {...column.getHeaderProps(
                                                            column.getSortByToggleProps()
                                                        )}
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        <div className="flex items-center">
                                                            {column.render(
                                                                "Header"
                                                            )}
                                                            {column.isSorted ? (
                                                                column.isSortedDesc ? (
                                                                    <ChevronDown
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="ml-1"
                                                                    />
                                                                ) : (
                                                                    <ChevronUp
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="ml-1"
                                                                    />
                                                                )
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </th>
                                                )
                                            )}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody
                                    {...getTableBodyProps()}
                                    className="bg-white divide-y divide-gray-200"
                                >
                                    {page.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="px-6 py-8 text-center text-sm text-gray-500"
                                            >
                                                No testimonials found. Create your first testimonial!
                                            </td>
                                        </tr>
                                    ) : (
                                        page.map((row) => {
                                            prepareRow(row);
                                            return (
                                                <tr
                                                    {...row.getRowProps()}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    {row.cells.map(
                                                        (cell) => (
                                                            <td
                                                                {...cell.getCellProps()}
                                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                            >
                                                                {cell.render(
                                                                    "Cell"
                                                                )}
                                                            </td>
                                                        )
                                                    )}
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="flex items-center justify-between flex-col md:flex-row mt-4 space-y-4 md:space-y-0">
                            <div className="flex items-center">
                                <span className="text-sm text-gray-700 mr-2">
                                    Show
                                </span>
                                <select
                                    value={pageSize}
                                    onChange={(e) =>
                                        setPageSize(Number(e.target.value))
                                    }
                                    className="border border-gray-300 rounded-md px-2 py-1 text-xs md:text-sm"
                                >
                                    {[5, 10, 20, 50].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-xs md:text-sm text-gray-700 ml-2">
                                    entries
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <span className="text-xs md:text-sm text-gray-700">
                                    Page <strong>{pageIndex + 1}</strong> of{" "}
                                    <strong>{pageOptions.length}</strong>
                                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => gotoPage(0)}
                                    disabled={!canPreviousPage}
                                    className={`p-1 rounded ${
                                        !canPreviousPage
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                    }`}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => previousPage()}
                                    disabled={!canPreviousPage}
                                    className={`px-3 py-1 rounded text-sm ${
                                        !canPreviousPage
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => nextPage()}
                                    disabled={!canNextPage}
                                    className={`px-3 py-1 rounded text-sm ${
                                        !canNextPage
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                    }`}
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => gotoPage(pageCount - 1)}
                                    disabled={!canNextPage}
                                    className={`p-1 rounded ${
                                        !canNextPage
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                    }`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminWrapper>
    );
}

export default Testimonials;