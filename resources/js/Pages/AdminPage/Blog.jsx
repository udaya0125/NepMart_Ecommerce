import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import {
    Plus,
    ChevronUp,
    ChevronDown,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Search,
} from "lucide-react";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import AddBlogForm from "@/AddFormComponents/AddBlogForm";

// Global filter component for search
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
            </div>
            <input
                type="text"
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value || undefined)}
                placeholder="Search by blog title or author..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 text-sm"
            />
        </div>
    );
};

const Blog = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [allBlogs, setAllBlogs] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
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
                Header: "Author",
                accessor: "author",
            },
            {
                Header: "Category",
                Cell: ({ row }) => (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {row.original?.category?.category || "-"}
                    </span>
                ),
            },
            {
                Header: "Read Time",
                accessor: "read_time",
            },
            {
                Header: "Excerpt",
                accessor: "excerpt",
                Cell: ({ value }) => (
                    <div className="max-w-xs truncate" title={value}>
                        {value || "-"}
                    </div>
                ),
            },
            {
                Header: "Image",
                accessor: "image",
                Cell: ({ value }) => 
                    value ? (
                        <img 
                            src={value} 
                            alt="Blog" 
                            className="w-10 h-10 object-cover rounded"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No Image
                        </div>
                    ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
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

    // Custom filter function for global search
    const globalFilterFunction = useMemo(() => 
        (rows, columnIds, filterValue) => {
            if (!filterValue) return rows;

            const searchTerm = filterValue.toLowerCase();
            return rows.filter(row => {
                const blogTitle = row.original.title?.toLowerCase() || "";
                const authorName = row.original.author?.toLowerCase() || "";
                
                return blogTitle.includes(searchTerm) || authorName.includes(searchTerm);
            });
        },
        []
    );

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourblog.index"));
                const blogsData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.data || [];
                setAllBlogs(blogsData);
            } catch (error) {
                console.error("Fetching error", error);
                setAllBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();

        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("ourcategory.index"));
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllCategory([]);
            }
        };
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?"))
            return;
        try {
            await axios.delete(route("ourblog.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting blog. Please try again.");
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setShowAddForm(true);
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        setEditingBlog(null);
        setReloadTrigger((prev) => !prev);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingBlog(null);
    };

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
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data: allBlogs,
            initialState: { pageIndex: 0, pageSize: 5 },
            globalFilter: globalFilterFunction,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <AdminWrapper>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Blog Management
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
                        <GlobalFilter 
                            globalFilter={globalFilter} 
                            setGlobalFilter={setGlobalFilter} 
                        />
                        <button
                            onClick={() => {
                                setEditingBlog(null);
                                setShowAddForm(true);
                            }}
                            className="py-2 md:py-3 px-4 md:px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={18} className="hidden md:block" />
                            <span>Add Blog</span>
                        </button>
                    </div>
                </div>

                {showAddForm && (
                    <AddBlogForm
                        showForm={showAddForm}
                        onCancel={handleCancel}
                        allCategory={allCategory}
                        onSuccess={handleAddSuccess}
                        editingBlog={editingBlog}
                    />
                )}

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading blogs...</p>
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
                                                {globalFilter 
                                                    ? "No blogs match your search." 
                                                    : "No blogs found. Create your first blog!"
                                                }
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
                                    {[5, 10, 20].map((size) => (
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
                                    {globalFilter && (
                                        <span className="ml-2 text-gray-500">
                                            (Filtered)
                                        </span>
                                    )}
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
};

export default Blog;