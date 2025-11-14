import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CartProvider } from './Contexts/CartContext'; 
import { WishlistProvider } from './Contexts/WishlistContext'; // Import WishlistProvider
import { GoogleOAuthProvider } from '@react-oauth/google';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    // title: (title) => `${title} - ${appName}`,
    title: (title) => `${title} NepMart`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <CartProvider>
                <WishlistProvider>
                    <GoogleOAuthProvider clientId="494655594932-npl4gall6f8hl5qe6valbgn3nt0t6kmh.apps.googleusercontent.com">
                    <App {...props} />
                    </GoogleOAuthProvider>
                </WishlistProvider>
            </CartProvider>
        );

        
    },
    progress: {
        color: '#4B5563',
    },
});