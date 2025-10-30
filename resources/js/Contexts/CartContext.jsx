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