import AdminWrapper from "@/AdminComponents/AdminWrapper";
import {
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    Trash2,
    Mail,
    UserCheck,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import axios from "axios";
import { usePage } from "@inertiajs/react";

const AdminMessage = () => {
    const { auth } = usePage().props;
    const currentUser = auth.user;

    // Check if current user has admin or super admin role
    const isAdmin =
        currentUser?.role === "admin" || currentUser?.role === "super admin";
    const isSuperAdmin = currentUser?.role === "super admin";

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        // Check authorization before fetching
        if (!isAdmin) {
            setError("You don't have permission to access admin applications.");
            setLoading(false);
            return;
        }

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourmessage.index"));

                const responseData = response.data;

                if (Array.isArray(responseData)) {
                    setMessages(responseData);
                } else {
                    console.error(
                        "Unexpected response structure:",
                        responseData
                    );
                    setMessages([]);
                    setError("Unexpected data format received from server.");
                }
            } catch (error) {
                console.error("Error fetching admin applications:", error);
                if (error.response?.status === 403) {
                    setError(
                        "You don't have permission to view admin applications."
                    );
                } else {
                    setError(
                        "Failed to fetch admin applications. Please try again later."
                    );
                }
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [isAdmin]);

    const openModal = (message) => {
        if (!isAdmin) {
            alert("You don't have permission to view application details.");
            return;
        }
        setSelectedMessage(message);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMessage(null);
        setIsModalOpen(false);
    };

    // Handle application approval (only for super admin)
    const handleApproveApplication = async (applicationId) => {
        if (!isSuperAdmin) {
            alert("Only super admins can approve admin applications.");
            return;
        }

        if (
            !confirm("Are you sure you want to approve this admin application?")
        )
            return;

        try {
            setActionLoading(true);
            const response = await axios.post(
                route("ourmessage.approve", { id: applicationId })
            );

            if (response.data.success) {
                // Update the local state to reflect the approval
                setMessages(
                    messages.map((msg) =>
                        msg.id === applicationId
                            ? {
                                  ...msg,
                                  status: "approved",
                                  approved_at: new Date().toISOString(),
                              }
                            : msg
                    )
                );
                alert("Application approved successfully!");

                // Close modal if open
                if (selectedMessage?.id === applicationId) {
                    closeModal();
                }
            }
        } catch (error) {
            console.error("Error approving application:", error);
            if (error.response?.status === 403) {
                alert("You don't have permission to approve applications.");
            } else {
                alert("Error approving application. Please try again.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Handle application rejection (only for super admin)
    const handleRejectApplication = async (applicationId) => {
        if (!isSuperAdmin) {
            alert("Only super admins can reject admin applications.");
            return;
        }

        if (!confirm("Are you sure you want to reject this admin application?"))
            return;

        try {
            setActionLoading(true);
            const response = await axios.post(
                route("ourmessage.reject", { id: applicationId })
            );

            if (response.data.success) {
                // Update the local state to reflect the rejection
                setMessages(
                    messages.map((msg) =>
                        msg.id === applicationId
                            ? {
                                  ...msg,
                                  status: "rejected",
                                  rejected_at: new Date().toISOString(),
                              }
                            : msg
                    )
                );
                alert("Application rejected successfully!");

                // Close modal if open
                if (selectedMessage?.id === applicationId) {
                    closeModal();
                }
            }
        } catch (error) {
            console.error("Error rejecting application:", error);
            if (error.response?.status === 403) {
                alert("You don't have permission to reject applications.");
            } else {
                alert("Error rejecting application. Please try again.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Handle application deletion (only for super admin)
    const handleDeleteApplication = async (applicationId) => {
        if (!isSuperAdmin) {
            alert("Only super admins can delete admin applications.");
            return;
        }

        if (
            !confirm(
                "Are you sure you want to delete this admin application? This action cannot be undone."
            )
        )
            return;

        try {
            setActionLoading(true);
            await axios.delete(
                route("ourmessage.destroy", { id: applicationId })
            );

            // Remove the application from local state
            setMessages(messages.filter((msg) => msg.id !== applicationId));
            alert("Application deleted successfully!");

            // Close modal if open
            if (selectedMessage?.id === applicationId) {
                closeModal();
            }
        } catch (error) {
            console.error("Error deleting application:", error);
            if (error.response?.status === 403) {
                alert("You don't have permission to delete applications.");
            } else {
                alert("Error deleting application. Please try again.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Name",
                accessor: "user_name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Subject",
                accessor: "subject",
                Cell: ({ value }) => {
                    return value && value.length > 25
                        ? `${value.substring(0, 25)}...`
                        : value;
                },
            },
            {
                Header: "Message",
                accessor: "message",
                Cell: ({ value }) => {
                    return value && value.length > 30
                        ? `${value.substring(0, 30)}...`
                        : value;
                },
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => {
                    const statusColors = {
                        pending: "bg-yellow-100 text-yellow-800",
                        approved: "bg-green-100 text-green-800",
                        rejected: "bg-red-100 text-red-800",
                    };

                    const colorClass =
                        statusColors[value] || "bg-gray-100 text-gray-800";

                    return (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
                        >
                            {value
                                ? value.charAt(0).toUpperCase() + value.slice(1)
                                : "Pending"}
                        </span>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => {
                    const application = row.original;
                    const isPending =
                        !application.status || application.status === "pending";

                    return (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => openModal(application)}
                                className="flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
                                title="View Application Details"
                            >
                                <Eye size={18} />
                            </button>

                            <button
                                onClick={() =>
                                    handleDeleteApplication(application.id)
                                }
                                disabled={actionLoading}
                                className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors duration-200 disabled:opacity-50"
                                title="Delete Application"
                            >
                                <Trash2 size={18} className="text-red-600" />
                            </button>
                        </div>
                    );
                },
                width: isSuperAdmin ? 180 : 80,
                sortable: false,
            },
        ],
        [isSuperAdmin, actionLoading]
    );

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
            data: messages,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useSortBy,
        usePagination
    );

    // If user is not authorized, show access denied message
    if (!isAdmin) {
        return (
            <AdminWrapper>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-center py-8">
                        <div className="text-red-500 text-xl font-semibold mb-4">
                            Access Denied
                        </div>
                        <p className="text-gray-600">
                            You don't have permission to access admin
                            applications.
                        </p>
                    </div>
                </div>
            </AdminWrapper>
        );
    }

    return (
        <AdminWrapper>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Applications
                            </h1>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">
                            Loading applications...
                        </p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">{error}</div>
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
                                    {page.length > 0 ? (
                                        page.map((row) => {
                                            prepareRow(row);
                                            return (
                                                <tr
                                                    {...row.getRowProps()}
                                                    className="hover:bg-gray-50"
                                                >
                                                    {row.cells.map((cell) => (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            className="px-6 py-4 whitespace-nowrap text-sm"
                                                        >
                                                            {cell.render(
                                                                "Cell"
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                <div>
                                                    No admin applications found.
                                                </div>
                                                <div className="text-sm text-gray-400 mt-1">
                                                    Customers can apply for
                                                    admin privileges through the
                                                    application form.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {messages.length > 0 && (
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
                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                    >
                                        {[5, 10, 20, 50].map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-sm text-gray-700 ml-2">
                                        entries
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-700">
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
                        )}
                    </>
                )}
            </div>

            {/* Application Details Modal */}
            {isModalOpen && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center">
                                <UserCheck
                                    className="mr-3 text-blue-600"
                                    size={24}
                                />
                                <h2 className="text-xl font-bold text-gray-800">
                                    Admin Application Details
                                </h2>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Application Status */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            Application Status
                                        </h3>
                                        <p
                                            className={`text-sm font-medium ${
                                                selectedMessage.status ===
                                                "approved"
                                                    ? "text-green-600"
                                                    : selectedMessage.status ===
                                                      "rejected"
                                                    ? "text-red-600"
                                                    : "text-yellow-600"
                                            }`}
                                        >
                                            {selectedMessage.status
                                                ? selectedMessage.status
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  selectedMessage.status.slice(
                                                      1
                                                  )
                                                : "Pending"}
                                        </p>
                                    </div>
                                    {isSuperAdmin &&
                                        (!selectedMessage.status ||
                                            selectedMessage.status ===
                                                "pending") && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleApproveApplication(
                                                            selectedMessage.id
                                                        )
                                                    }
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 flex items-center"
                                                >
                                                    <UserCheck
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRejectApplication(
                                                            selectedMessage.id
                                                        )
                                                    }
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center"
                                                >
                                                    <Trash2
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Applicant Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Applicant Name
                                    </label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md border">
                                        {selectedMessage.user_name || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Email Address
                                    </label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md border">
                                        {selectedMessage.email || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Application Details */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Application Subject
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-md border font-medium">
                                    {selectedMessage.subject || "N/A"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Application Message
                                </label>
                                <div className="text-gray-900 bg-gray-50 p-4 rounded-md border whitespace-pre-wrap">
                                    {selectedMessage.message || "N/A"}
                                </div>
                            </div>

                            {selectedMessage.content && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Additional Information
                                    </label>
                                    <div className="text-gray-900 bg-gray-50 p-4 rounded-md border whitespace-pre-wrap">
                                        {selectedMessage.content}
                                    </div>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Application Date
                                    </label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md border">
                                        {selectedMessage.created_at
                                            ? new Date(
                                                  selectedMessage.created_at
                                              ).toLocaleString()
                                            : "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Last Updated
                                    </label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md border">
                                        {selectedMessage.updated_at
                                            ? new Date(
                                                  selectedMessage.updated_at
                                              ).toLocaleString()
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Approval/Rejection Timestamps */}
                            {selectedMessage.approved_at && (
                                <div>
                                    <label className="block text-sm font-medium text-green-600 mb-2">
                                        Approved On
                                    </label>
                                    <p className="text-green-900 bg-green-50 p-3 rounded-md border">
                                        {new Date(
                                            selectedMessage.approved_at
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {selectedMessage.rejected_at && (
                                <div>
                                    <label className="block text-sm font-medium text-red-600 mb-2">
                                        Rejected On
                                    </label>
                                    <p className="text-red-900 bg-red-50 p-3 rounded-md border">
                                        {new Date(
                                            selectedMessage.rejected_at
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between p-6 border-t">
                            {isSuperAdmin && (
                                <button
                                    onClick={() =>
                                        handleDeleteApplication(
                                            selectedMessage.id
                                        )
                                    }
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete Application
                                </button>
                            )}
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminWrapper>
    );
};

export default AdminMessage;
