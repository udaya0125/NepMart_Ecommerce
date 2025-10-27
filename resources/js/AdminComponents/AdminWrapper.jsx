import React, { useState, useEffect, useCallback } from "react";
import AdminNavBar from "./AdminNavBar";
import AdminSideBar from "./AdminSideBar";

const AdminWrapper = ({ children, user }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleMobileSidebar = useCallback(() => {
        setIsMobileSidebarOpen((prev) => !prev);
    }, []);

    const toggleSidebar = useCallback(
        () => setIsCollapsed((prev) => !prev),
        []
    );

    // Close mobile sidebar when resizing to larger screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isMobileSidebarOpen) {
                setIsMobileSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isMobileSidebarOpen]);

    return (
        <div className="min-h-screen">
            <AdminNavBar
                onMenuToggle={toggleMobileSidebar}
                toggleSidebar={toggleSidebar}
            />

            <div className="flex">
                <AdminSideBar
                    toggleSidebar={toggleSidebar}
                    isCollapsed={isCollapsed}
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileToggle={toggleMobileSidebar}
                    user={user}
                />

                <main
                    className={`py-4 md:py-6 w-full px-4 md:px-6 lg:px-20 mt-16 md:mt-0 pt-8 md:pt-24 lg:pt-28 lg:ml-auto min-h-screen transition-all duration-300 ${
                        isCollapsed ? "lg:w-[96%]" : "lg:w-[85%]"
                    } bg-white text-black`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminWrapper;