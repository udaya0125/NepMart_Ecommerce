// import React, { createContext, useContext, useReducer, useEffect } from 'react';

// const CartContext = createContext();

// const cartReducer = (state, action) => {
//     switch (action.type) {
//         case 'ADD_TO_CART':
//             const existingItem = state.items.find(item => item.id === action.payload.id);
            
//             if (existingItem) {
//                 return {
//                     ...state,
//                     items: state.items.map(item =>
//                         item.id === action.payload.id
//                             ? { ...item, quantity: item.quantity + 1 }
//                             : item
//                     ),
//                     totalItems: state.totalItems + 1
//                 };
//             }
            
//             return {
//                 ...state,
//                 items: [...state.items, { ...action.payload, quantity: 1 }],
//                 totalItems: state.totalItems + 1
//             };
            
//         case 'REMOVE_FROM_CART':
//             const itemToRemove = state.items.find(item => item.id === action.payload);
//             return {
//                 ...state,
//                 items: state.items.filter(item => item.id !== action.payload),
//                 totalItems: Math.max(0, state.totalItems - (itemToRemove?.quantity || 0))
//             };
            
//         case 'UPDATE_QUANTITY':
//             return {
//                 ...state,
//                 items: state.items.map(item =>
//                     item.id === action.payload.id
//                         ? { ...item, quantity: action.payload.quantity }
//                         : item
//                 ),
//                 totalItems: state.items.reduce((total, item) => {
//                     if (item.id === action.payload.id) {
//                         return total - item.quantity + action.payload.quantity;
//                     }
//                     return total + item.quantity;
//                 }, 0)
//             };
            
//         case 'CLEAR_CART':
//             return {
//                 items: [],
//                 totalItems: 0
//             };
            
//         case 'LOAD_CART':
//             return {
//                 items: action.payload.items || [],
//                 totalItems: action.payload.totalItems || 0
//             };
            
//         default:
//             return state;
//     }
// };

// const getCartTotal = (items) => {
//     return items.reduce((total, item) => total + (item.price * item.quantity), 0);
// };

// export const CartProvider = ({ children }) => {
//     const [cart, dispatch] = useReducer(cartReducer, {
//         items: [],
//         totalItems: 0
//     });

//     // Load cart from localStorage on mount
//     useEffect(() => {
//         const savedCart = localStorage.getItem('shopping-cart');
//         if (savedCart) {
//             try {
//                 const parsedCart = JSON.parse(savedCart);
//                 dispatch({ 
//                     type: 'LOAD_CART', 
//                     payload: {
//                         items: parsedCart.items || [],
//                         totalItems: parsedCart.totalItems || 0
//                     }
//                 });
//             } catch (error) {
//                 console.error('Error loading cart from localStorage:', error);
//             }
//         }
//     }, []);

//     // Save cart to localStorage whenever it changes
//     useEffect(() => {
//         localStorage.setItem('shopping-cart', JSON.stringify(cart));
//     }, [cart]);

//     const addToCart = (product) => {
//         dispatch({ type: 'ADD_TO_CART', payload: product });
//     };

//     const removeFromCart = (productId) => {
//         dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
//     };

//     const updateQuantity = (productId, quantity) => {
//         if (quantity <= 0) {
//             removeFromCart(productId);
//         } else {
//             dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
//         }
//     };

//     const clearCart = () => {
//         dispatch({ type: 'CLEAR_CART' });
//     };

//     const getCartTotalPrice = () => {
//         return getCartTotal(cart.items);
//     };

//     const value = {
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         getCartTotalPrice
//     };

//     return (
//         <CartContext.Provider value={value}>
//             {children}
//         </CartContext.Provider>
//     );
// };

// export const useCart = () => {
//     const context = useContext(CartContext);
//     if (!context) {
//         throw new Error('useCart must be used within a CartProvider');
//     }
//     return context;
// };


import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.items.find(item => 
                item.id === action.payload.id && 
                item.size === action.payload.size && 
                item.color === action.payload.color
            );
            
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id && 
                        item.size === action.payload.size && 
                        item.color === action.payload.color
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    ),
                    totalItems: state.totalItems + action.payload.quantity
                };
            }
            
            return {
                ...state,
                items: [...state.items, { ...action.payload }],
                totalItems: state.totalItems + action.payload.quantity
            };
            
        case 'REMOVE_FROM_CART':
            const itemToRemove = state.items.find(item => item.cartItemId === action.payload);
            return {
                ...state,
                items: state.items.filter(item => item.cartItemId !== action.payload),
                totalItems: Math.max(0, state.totalItems - (itemToRemove?.quantity || 0))
            };
            
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.cartItemId === action.payload.cartItemId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
                totalItems: state.items.reduce((total, item) => {
                    if (item.cartItemId === action.payload.cartItemId) {
                        return total - item.quantity + action.payload.quantity;
                    }
                    return total + item.quantity;
                }, 0)
            };
            
        case 'CLEAR_CART':
            return {
                items: [],
                totalItems: 0
            };
            
        case 'SYNC_CART_SUCCESS':
            return {
                items: action.payload.items || [],
                totalItems: action.payload.totalItems || 0
            };
            
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
            
        default:
            return state;
    }
};

const getCartTotal = (items) => {
    return items.reduce((total, item) => total + ((item.discounted_price || item.price) * item.quantity), 0);
};

export const CartProvider = ({ children, user = null }) => {
    const [cart, dispatch] = useReducer(cartReducer, {
        items: [],
        totalItems: 0,
        isLoading: false
    });

    const isMounted = useRef(true);

    // Get auth user
    let auth = { user: null };
    try {
        const page = usePage();
        auth = page.props.auth || { user: null };
    } catch (error) {
        auth = { user };
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Load cart from backend on mount
    const loadCartFromBackend = async () => {
        if (!isMounted.current) return;
        
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            const response = await axios.get(route('ourcart.index'));
            if (response.data.success) {
                const cartItems = response.data.data.map(item => ({
                    cartItemId: item.id, // Use cart item ID for operations
                    id: item.product_id, // Product ID
                    product_id: item.product_id,
                    name: item.product_name,
                    price: parseFloat(item.price),
                    discounted_price: item.discounted_price ? parseFloat(item.discounted_price) : null,
                    quantity: parseInt(item.quantity),
                    size: item.size,
                    color: item.color,
                    image: item.product?.images?.[0] || null,
                    product_name: item.product_name,
                    product_sku: item.product_sku,
                    product_brand: item.product_brand,
                    user_name: item.user_name,
                    total_price: parseFloat(item.total_price)
                }));
                
                if (isMounted.current) {
                    dispatch({
                        type: 'SYNC_CART_SUCCESS',
                        payload: {
                            items: cartItems,
                            totalItems: cartItems.reduce((total, item) => total + item.quantity, 0)
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading cart from backend:', error);
        } finally {
            if (isMounted.current) {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
    };

    // Sync cart to backend
    const syncCartToBackend = async (product, quantity = 1) => {
        try {
            const cartItemData = {
                user_name: auth.user?.name || 'Guest',
                product_id: product.id,
                product_name: product.name || product.product_name,
                product_sku: product.sku || product.product_sku,
                product_brand: product.brand || product.product_brand,
                price: product.price,
                discounted_price: product.discounted_price || product.price,
                quantity: quantity,
                size: product.size || null,
                color: product.color || null,
            };

            const response = await axios.post(route('ourcart.store'), cartItemData);
            
            if (response.data.success) {
                await loadCartFromBackend();
                return response.data.data;
            }
        } catch (error) {
            console.error('Error syncing cart to backend:', error);
            throw error;
        }
    };

    const updateCartItemInBackend = async (cartItemId, updates) => {
        try {
            const response = await axios.put(route('ourcart.update', { id: cartItemId }), updates);
            if (response.data.success) {
                await loadCartFromBackend();
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    };

    const removeCartItemFromBackend = async (cartItemId) => {
        try {
            const response = await axios.delete(route('ourcart.destroy', { id: cartItemId }));
            if (response.data.success) {
                await loadCartFromBackend();
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
            throw error;
        }
    };

    // Load cart on component mount
    useEffect(() => {
        loadCartFromBackend();
    }, []);

    const addToCart = async (product, quantity = 1) => {
        if (!product.id) {
            console.error('Product ID is required');
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            // Prepare product data for local state
            const cartProduct = {
                ...product,
                quantity: quantity,
                cartItemId: `temp-${Date.now()}`, // Temporary ID for local state
            };

            // Update local state immediately for better UX
            dispatch({ type: 'ADD_TO_CART', payload: cartProduct });
            
            // Then sync with backend
            await syncCartToBackend(product, quantity);
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            // Reload from backend to sync state on error
            await loadCartFromBackend();
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const removeFromCart = async (cartItemId) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            // Update local state immediately
            dispatch({ type: 'REMOVE_FROM_CART', payload: cartItemId });
            
            // Then sync with backend (only if it's not a temporary ID)
            if (!cartItemId.startsWith('temp-')) {
                await removeCartItemFromBackend(cartItemId);
            }
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
            await loadCartFromBackend();
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity <= 0) {
            await removeFromCart(cartItemId);
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            // Update local state immediately
            dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
            
            // Then sync with backend (only if it's not a temporary ID)
            if (!cartItemId.startsWith('temp-')) {
                await updateCartItemInBackend(cartItemId, { quantity });
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
            await loadCartFromBackend();
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const clearCart = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            // Remove each item from backend
            const backendItems = cart.items.filter(item => !item.cartItemId.startsWith('temp-'));
            for (const item of backendItems) {
                await removeCartItemFromBackend(item.cartItemId);
            }
            
            // Clear local state
            dispatch({ type: 'CLEAR_CART' });
        } catch (error) {
            console.error('Failed to clear cart:', error);
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const getCartTotalPrice = () => {
        return getCartTotal(cart.items);
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotalPrice,
        loadCartFromBackend
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};