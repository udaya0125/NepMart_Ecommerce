import React, { useState, useEffect, useCallback } from "react";
import CustomerSideBar from "./CustomerSideBar";

const CustomerWrapper = ({ children, user }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleMobileSidebar = useCallback(() => {
        setIsMobileSidebarOpen((prev) => !prev);
    }, []);

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
            <div className="flex">
                <CustomerSideBar
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileToggle={toggleMobileSidebar}
                    user={user}
                />
                <main
                    className="py-4 md:py-6 w-full px-4 md:px-6 lg:px-20 mt-16 md:mt-0 pt-8 md:pt-20 lg:ml-auto  transition-all duration-300 lg:w-[82%] bg-white text-black"
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default CustomerWrapper;