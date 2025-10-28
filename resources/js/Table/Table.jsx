import React, { useMemo, useState, useEffect } from "react";
import {
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useTable, useSortBy, usePagination } from "react-table";
import orderData from "../../JsonData/Order.json";

const Table = () => {
    const [orders, setOrders] = useState([]);
    const [topSoldProducts, setTopSoldProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to calculate top sold products from orders
    const calculateTopSoldProducts = (orders) => {
        const productCount = {};
        
        // Count occurrences of each product
        orders.forEach(order => {
            if (productCount[order.product]) {
                productCount[order.product]++;
            } else {
                productCount[order.product] = 1;
            }
        });
        
        const totalOrders = orders.length;
        const colorPalette = [
            "bg-purple-500", "bg-red-500", "bg-orange-500", 
            "bg-green-500", "bg-blue-500", "bg-indigo-500"
        ];
        
        // Convert to array, sort by count (descending), and take top 5
        return Object.entries(productCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([product, count], index) => ({
                name: product,
                color: colorPalette[index] || "bg-gray-500",
                percent: Math.round((count / totalOrders) * 100),
                sales: count
            }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const ordersData = orderData.orders || [];
                setOrders(ordersData);
                
                // Calculate top sold products from orders
                const topProducts = calculateTopSoldProducts(ordersData);
                setTopSoldProducts(topProducts);
                
            } catch (err) {
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "Product",
                accessor: "product",
                Cell: ({ row }) => {
                    const { product, image } = row.original;
                    if (!product) return product;
                    
                    return (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10  rounded-lg flex items-center justify-center overflow-hidden">
                                <img 
                                    src={image} 
                                    alt={product}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />                             
                            </div>
                            <span className="text-sm">{product}</span>
                        </div>
                    );
                },
            },
            {
                Header: "Order ID",
                accessor: "order_id",
            },
            {
                Header: "Customer",
                accessor: "customer",
            },
            {
                Header: "Date",
                accessor: "date",
                Cell: ({ value }) => {
                    try {
                        return new Date(value).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                        });
                    } catch {
                        return value;
                    }
                },
            },
            {
                Header: "Price",
                accessor: "price",
                Cell: ({ value }) => `$${value}`,
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => {
                    const colorMap = {
                        completed: "bg-green-100 text-green-700",
                        pending: "bg-orange-100 text-orange-700",
                        cancelled: "bg-red-100 text-red-700",
                    };
                    return (
                        <span
                            className={`px-3 py-1 rounded-full text-xs capitalize ${
                                colorMap[value] || "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {value}
                        </span>
                    );
                },
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
            data: orders,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        useSortBy,
        usePagination
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm ">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    All Orders
                </h3>

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg">
                            <table
                                {...getTableProps()}
                                className="min-w-full divide-y divide-gray-200"
                            >
                                <thead className="bg-gray-50">
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th
                                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    <div className="flex items-center">
                                                        {column.render("Header")}
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <ChevronDown size={16} className="ml-1" />
                                                            ) : (
                                                                <ChevronUp size={16} className="ml-1" />
                                                            )
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
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
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    {row.cells.map((cell) => (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                                                        >
                                                            {cell.render("Cell")}
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
                                                No orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between flex-col md:flex-row mt-4">
                            <div className="flex items-center">
                                <span className="text-sm text-gray-700 mr-2">Show</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                >
                                    {[5, 10, 20].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-sm text-gray-700 ml-2">entries</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-3 md:mt-0">
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

            {/* Top Sold Items - Dynamically calculated from orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20 self-start">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Top Sold Items
                </h3>
                <div className="space-y-5">
                    {topSoldProducts.length > 0 ? (
                        topSoldProducts.map((item) => (
                            <div key={item.name}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">
                                        {item.name}
                                    </span>
                                    <span className="text-sm font-medium">{item.percent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${item.color} h-2 rounded-full transition-all duration-500 ease-out`}
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                                {/* Additional sales information */}
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{item.sales} {item.sales === 1 ? 'sale' : 'sales'}</span>
                                    <span>{Math.round(item.percent)}% of total</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && (
                            <div className="text-center text-gray-500 py-4">
                                No sales data available
                            </div>
                        )
                    )}
                </div>
                
                {/* Summary Stats */}
                {topSoldProducts.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">
                                    {orders.length}
                                </div>
                                <div className="text-gray-500">Total Orders</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">
                                    {topSoldProducts.length}
                                </div>
                                <div className="text-gray-500">Top Products</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;