import { useCart } from '../contexts/CartContext';

export const useAuthCart = () => {
    const cart = useCart();
    
    const isAuthenticated = () => {
        return localStorage.getItem('authToken') !== null;
    };

    const addToCartWithAuth = (product) => {
        if (!isAuthenticated()) {
            alert('Please login to add items to your cart');
            return false;
        }
        
        cart.addToCart(product);
        return true;
    };

    return {
        ...cart,
        isAuthenticated,
        addToCartWithAuth
    };
};