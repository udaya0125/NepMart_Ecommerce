import React, { useEffect, useRef } from "react";
import { Users, Package, ShoppingCart, TrendingUp } from "lucide-react";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import Table from "@/Table/Table";
import GraphChart from "@/Table/GraphChart";

const Dashboard = () => {
    return (
        <>
            <AdminWrapper>
                <div className="min-h-screen bg-gray-100 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">
                                            Total Customers
                                        </p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">
                                            2000+
                                        </p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">
                                            Total Products
                                        </p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">
                                            140+
                                        </p>
                                    </div>
                                    <div className="bg-yellow-100 p-3 rounded-lg">
                                        <Package className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">
                                            Total Orders
                                        </p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">
                                            1600+
                                        </p>
                                    </div>
                                    <div className="bg-red-100 p-3 rounded-lg">
                                        <ShoppingCart className="w-6 h-6 text-red-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">
                                            Total Sales
                                        </p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">
                                            2000+
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}

                        <GraphChart />

                        {/* Table Section */}

                        <Table />
                    </div>
                </div>
            </AdminWrapper>
        </>
    );
};

export default Dashboard;