import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.items.find(item => item.id === action.payload.id);
            
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                    totalItems: state.totalItems + 1
                };
            }
            
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }],
                totalItems: state.totalItems + 1
            };
            
        case 'REMOVE_FROM_CART':
            const itemToRemove = state.items.find(item => item.id === action.payload);
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
                totalItems: Math.max(0, state.totalItems - (itemToRemove?.quantity || 0))
            };
            
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
                totalItems: state.items.reduce((total, item) => {
                    if (item.id === action.payload.id) {
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
            
        case 'LOAD_CART':
            return {
                items: action.payload.items || [],
                totalItems: action.payload.totalItems || 0
            };
            
        default:
            return state;
    }
};

const getCartTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, {
        items: [],
        totalItems: 0
    });

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('shopping-cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                dispatch({ 
                    type: 'LOAD_CART', 
                    payload: {
                        items: parsedCart.items || [],
                        totalItems: parsedCart.totalItems || 0
                    }
                });
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('shopping-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        dispatch({ type: 'ADD_TO_CART', payload: product });
    };

    const removeFromCart = (productId) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
        }
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
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
        getCartTotalPrice
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

// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import axios from 'axios';

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
            
//         case 'SYNC_CART':
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

//     // Load cart from backend on mount
//     const loadCartFromBackend = async () => {
//         try {
//             const response = await axios.get(route('ourcart.index'));
//             if (response.data.success) {
//                 const cartItems = response.data.data.map(item => ({
//                     id: item.id,
//                     product_id: item.product_id,
//                     name: item.product_name,
//                     price: item.discounted_price || item.price,
//                     quantity: item.quantity,
//                     size: item.size,
//                     color: item.color,
//                     image: item.product?.images?.[0] || null
//                 }));
                
//                 dispatch({
//                     type: 'SYNC_CART',
//                     payload: {
//                         items: cartItems,
//                         totalItems: cartItems.reduce((total, item) => total + item.quantity, 0)
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error('Error loading cart from backend:', error);
//         }
//     };

//     // Sync cart to backend
//     const syncCartToBackend = async (product, quantity = 1) => {
//         try {
//             const response = await axios.post(route('ourcart.store'), {
//                 product_id: product.id,
//                 quantity: quantity,
//                 size: product.size || null,
//                 color: product.color || null
//             });
            
//             if (response.data.success) {
//                 await loadCartFromBackend(); // Reload cart to get updated data from backend
//             }
//         } catch (error) {
//             console.error('Error syncing cart to backend:', error);
//             throw error;
//         }
//     };

//     const updateCartItemInBackend = async (cartItemId, updates) => {
//         try {
//             const response = await axios.put(route('ourcart.update', { id: cartItemId }), updates);
//             if (response.data.success) {
//                 await loadCartFromBackend();
//             }
//         } catch (error) {
//             console.error('Error updating cart item:', error);
//             throw error;
//         }
//     };

//     const removeCartItemFromBackend = async (cartItemId) => {
//         try {
//             const response = await axios.delete(route('ourcart.destroy', { id: cartItemId }));
//             if (response.data.success) {
//                 await loadCartFromBackend();
//             }
//         } catch (error) {
//             console.error('Error removing cart item:', error);
//             throw error;
//         }
//     };

//     // Load cart on component mount
//     useEffect(() => {
//         loadCartFromBackend();
//     }, []);

//     const addToCart = async (product) => {
//         try {
//             // First update local state for immediate UI response
//             dispatch({ type: 'ADD_TO_CART', payload: product });
            
//             // Then sync with backend
//             await syncCartToBackend(product);
//         } catch (error) {
//             // Revert local state if backend sync fails
//             console.error('Failed to add item to cart:', error);
//             await loadCartFromBackend(); // Reload from backend to sync state
//         }
//     };

//     const removeFromCart = async (cartItemId) => {
//         try {
//             // First update local state
//             dispatch({ type: 'REMOVE_FROM_CART', payload: cartItemId });
            
//             // Then sync with backend
//             await removeCartItemFromBackend(cartItemId);
//         } catch (error) {
//             console.error('Failed to remove item from cart:', error);
//             await loadCartFromBackend(); 
//         }
//     };

//     const updateQuantity = async (cartItemId, quantity) => {
//         try {
//             if (quantity <= 0) {
//                 await removeFromCart(cartItemId);
//             } else {
//                 // First update local state
//                 dispatch({ type: 'UPDATE_QUANTITY', payload: { id: cartItemId, quantity } });
                
//                 // Then sync with backend
//                 await updateCartItemInBackend(cartItemId, { quantity });
//             }
//         } catch (error) {
//             console.error('Failed to update quantity:', error);
//             await loadCartFromBackend(); // Reload from backend to sync state
//         }
//     };

//     const clearCart = async () => {
//         try {
//             // For clearing cart, we need to remove each item individually
//             for (const item of cart.items) {
//                 await removeCartItemFromBackend(item.id);
//             }
            
//             dispatch({ type: 'CLEAR_CART' });
//         } catch (error) {
//             console.error('Failed to clear cart:', error);
//         }
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
//         getCartTotalPrice,
//         loadCartFromBackend // Export if you need to manually reload
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