import AdminWrapper from "@/AdminComponents/AdminWrapper";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import {
  Edit2,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import AddUserForm from "@/AddFormComponents/AddUserForm";
import EditUserForm from "@/EditFormComponents/EditUserForm";


const UserManagement = () => {
  const { auth } = usePage().props;
  const currentUser = auth.user;
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if current user is super admin
  const isSuperAdmin = currentUser?.role === 'super admin';

  // Fetch users
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(route("ouruser.index"));
        setAllUser(response.data.data || response.data || []);
      } catch (error) {
        console.error("Fetching error:", error);
        setError("Failed to load users. Please try again.");
        setAllUser([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [reloadTrigger]);

  // Handle Delete
  const handleDelete = async (id) => {
    // Prevent deleting yourself
    if (id === currentUser.id) {
      alert("You cannot delete your own account.");
      return;
    }

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(route("ouruser.destroy", { id }));
      setReloadTrigger((prev) => !prev);
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response?.status === 403) {
        alert("You don't have permission to delete this user.");
      } else {
        alert("Error deleting user");
      }
    }
  };

  // Handle Edit
  const handleEdit = useCallback((user) => {
    // Prevent editing your own role
    if (user.id === currentUser.id) {
      alert("You cannot edit your own account from here. Use profile settings instead.");
      return;
    }
    setEditingUser(user);
    setShowEditForm(true);
  }, [currentUser.id]);

  // Handle Update
  const handleUpdate = async (formData, id) => {
    formData.append("_method", "PUT");
    const response = await axios.post(route("ouruser.update", { id }), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  // Handle Create
  const handleCreate = async (formData) => {
    const response = await axios.post(route("ouruser.store"), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  // Combined Submit Handler for Add
  const handleAddSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await handleCreate(formData);
      setReloadTrigger((prev) => !prev);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating user", error);
      if (error.response?.status === 403) {
        alert("You don't have permission to create users.");
      } else {
        alert("Error creating user");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Combined Submit Handler for Edit
  const handleEditSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await handleUpdate(formData, editingUser.id);
      setReloadTrigger((prev) => !prev);
      setShowEditForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user", error);
      if (error.response?.status === 403) {
        alert("You don't have permission to update this user.");
      } else {
        alert("Error updating user");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Add New
  const handleAddNew = () => {
    setEditingUser(null);
    setShowAddForm(true);
  };

  // Handle Cancel for both forms
  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingUser(null);
  };

  // React Table
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: (row, i) => i + 1,
        id: "rowIndex",
        width: 60,
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center justify-center">
              {user.image ? (
                <img
                  src={`/storage/${user.image}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="rounded-full flex items-center justify-center">
                  <img
                    src="/user/user01.png"
                    alt="Default user"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
            </div>
          );
        },
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value, row }) => (
          <div className="font-medium text-gray-900">
            {value || "N/A"}
            {row.original.id === currentUser.id && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                You
              </span>
            )}
          </div>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ value }) => (
          <div className="text-sm text-gray-600">{value || "N/A"}</div>
        ),
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === "admin"
                ? "bg-purple-100 text-purple-800"
                : value === "super admin"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {value || "user"}
          </span>
        ),
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => {
          if (!value)
            return <div className="text-sm text-gray-600">N/A</div>;
          const date = new Date(value);
          return (
            <div className="text-sm text-gray-600">
              {date.toLocaleDateString()}
            </div>
          );
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => {
          const user = row.original;
          const isCurrentUser = user.id === currentUser.id;
          
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(user)}
                disabled={isCurrentUser}
                className={`text-blue-600 hover:text-blue-900 transition-colors p-1 rounded ${
                  isCurrentUser 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-blue-50"
                }`}
                title={isCurrentUser ? "Cannot edit your own account" : "Edit"}
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                disabled={isCurrentUser}
                className={`text-red-600 hover:text-red-900 transition-colors p-1 rounded ${
                  isCurrentUser 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-red-50"
                }`}
                title={isCurrentUser ? "Cannot delete your own account" : "Delete"}
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        },
      },
    ],
    [currentUser.id, handleEdit]
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
      data: allUser,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <AdminWrapper>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              User Management
            </h1>
          </div>
          {/* <button
            onClick={handleAddNew}
            className="py-2 md:py-3 px-4 md:px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2 text-sm md:text-base"
          >
            <Plus size={18} className="hidden md:block" />
            <span>Add User</span>
          </button> */}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Add User Form */}
        {showAddForm && (
          <AddUserForm
            onCancel={handleCancel}
            onSubmit={handleAddSubmit}
            submitting={submitting}
            currentUser={currentUser}
          />
        )}

        {/* Edit User Form */}
        {showEditForm && (
          <EditUserForm
            editingUser={editingUser}
            onCancel={handleCancel}
            onSubmit={handleEditSubmit}
            submitting={submitting}
            currentUser={currentUser}
          />
        )}

        {/* User Count */}
        <div className="text-sm text-gray-600 mb-4">
          Total: {allUser.length} users
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading users...</p>
          </div>
        ) : (
          <>
            {/* Users Table */}
            <div className="overflow-x-auto rounded-lg shadow">
              <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {headerGroups.map((headerGroup) => (
                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          key={column.id}
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center">
                            {column.render("Header")}
                            {column.isSorted && (
                              column.isSortedDesc ? (
                                <ChevronDown size={16} className="ml-1" />
                              ) : (
                                <ChevronUp size={16} className="ml-1" />
                              )
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                  {page.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No users found. Create your first user!
                      </td>
                    </tr>
                  ) : (
                    page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr key={row.id} {...row.getRowProps()} className="hover:bg-gray-50 transition-colors">
                          {row.cells.map((cell) => (
                            <td
                              key={cell.column.id}
                              {...cell.getCellProps()}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {allUser.length > 0 && (
              <div className="flex items-center justify-between flex-col md:flex-row mt-4 space-y-4 md:space-y-0">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      gotoPage(0);
                    }}
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
            )}
          </>
        )}
      </div>
    </AdminWrapper>
  );
};

export default UserManagement;