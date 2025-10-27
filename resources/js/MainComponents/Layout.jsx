import Navbar from '@/ContentWrapper/Navbar';
import Login from '@/Pages/Auth/Login';
import Register from '@/Pages/Auth/Register';
import { useState } from 'react';

const Layout = ({ children, auth }) => {
    const [authModal, setAuthModal] = useState(null);

    const handleOpenLogin = () => {
        setAuthModal('login');
    };

    const handleOpenRegister = () => {
        setAuthModal('register');
    };

    const handleCloseAuth = () => {
        setAuthModal(null);
    };

    const switchToRegister = () => {
        setAuthModal('register');
    };

    const switchToLogin = () => {
        setAuthModal('login');
    };

    return (
        <div className="min-h-screen">
            <Navbar 
                onOpenLogin={handleOpenLogin}
                onOpenRegister={handleOpenRegister}
                auth={auth}
            />
            
            <main>
                {children}
            </main>

            {/* Auth Modals */}
            {authModal === 'login' && (
                <Login
                    onClose={handleCloseAuth}
                    onSwitchToRegister={switchToRegister}
                />
            )}
            
            {authModal === 'register' && (
                <Register
                    onClose={handleCloseAuth}
                    onSwitchToLogin={switchToLogin}
                />
            )}
        </div>
    );
};

export default Layout;