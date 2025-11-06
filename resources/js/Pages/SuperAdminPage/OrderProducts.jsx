import AdminWrapper from "@/AdminComponents/AdminWrapper";
import {
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Trash2,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import axios from "axios";

const OrderProducts = () => {
    const [orderProducts, setOrderProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderProducts();
    }, []);

    const fetchOrderProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route("ourorder.index"));

            const responseData = response.data;

            if (responseData.success && Array.isArray(responseData.data)) {
                setOrderProducts(responseData.data);
            } else {
                console.error("Unexpected response structure:", responseData);
                setOrderProducts([]);
                setError("Unexpected data format received from server.");
            }
        } catch (error) {
            console.error("Error fetching order products:", error);
            setError("Failed to fetch order products. Please try again later.");
            setOrderProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this order product?")) {
            try {
                await axios.delete(route("ourorder.destroy", { id }));
                await fetchOrderProducts();
            } catch (error) {
                console.error("Error deleting order product:", error);
                setError("Failed to delete order product.");
            }
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
                Header: "Order ID",
                accessor: "order_id",
            },
            {
                Header: "User Name",
                accessor: "user_name",
            },
            {
                Header: "Product Name",
                accessor: "product_name",
            },
            {
                Header: "SKU",
                accessor: "product_sku",
            },
            {
                Header: "Brand",
                accessor: "product_brand",
            },
            {
                Header: "Quantity",
                accessor: "quantity",
                width: 100,
            },
            {
                Header: "Price",
                accessor: "price",
                Cell: ({ value }) => `$${parseFloat(value).toFixed(2)}`,
                width: 100,
            },
            {
                Header: "Discounted Price",
                accessor: "discounted_price",
                Cell: ({ value }) => value ? `$${parseFloat(value).toFixed(2)}` : '-',
                width: 120,
            },
            {
                Header: "Total",
                accessor: "total_price",
                Cell: ({ row }) => {
                    const price = row.original.discounted_price || row.original.price;
                    const total = price * row.original.quantity;
                    return `$${total.toFixed(2)}`;
                },
                width: 100,
            },
            {
                Header: "Payment Method",
                accessor: "payment_method",
            },
            {
                Header: "Size",
                accessor: "size",
                Cell: ({ value }) => value || '-',
                width: 80,
            },
            {
                Header: "Color",
                accessor: "color",
                Cell: ({ value }) => value || '-',
                width: 80,
            },
            {
                Header: "Date",
                accessor: "created_at",
                Cell: ({ value }) => {
                    return new Date(value).toLocaleString();
                },
                width: 180,
            },
            {
                Header: "Actions",
                id: "actions",
                width: 80,
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        []
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
            data: orderProducts,
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
                            Order Products
                        </h1>
                    </div>
                    {/* Add button removed */}
                </div>

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
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
                                                        style={{ width: column.width }}
                                                    >
                                                        <div className="flex items-center">
                                                            {column.render(
                                                                "Header"
                                                            )}
                                                            {column.isSorted ? (
                                                                column.isSortedDesc ? (
                                                                    <ChevronDown
                                                                        size={16}
                                                                        className="ml-1"
                                                                    />
                                                                ) : (
                                                                    <ChevronUp
                                                                        size={16}
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
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                No order products found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between flex-col md:flex-row mt-4">
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
                                    className={`px-3 py-1 rounded ${
                                        !canPreviousPage
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                    }`}
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page <strong>{pageIndex + 1}</strong> of{" "}
                                    <strong>{pageOptions.length}</strong>
                                </span>
                                <button
                                    onClick={() => nextPage()}
                                    disabled={!canNextPage}
                                    className={`px-3 py-1 rounded ${
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

export default OrderProducts;