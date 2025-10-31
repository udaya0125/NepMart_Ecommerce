import React, { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_WISHLIST':
            const existingItem = state.items.find(item => item.id === action.payload.id);
            
            if (existingItem) {
                return state; // Item already in wishlist
            }
            
            return {
                ...state,
                items: [...state.items, { ...action.payload, addedDate: new Date().toISOString() }],
                totalItems: state.totalItems + 1
            };
            
        case 'REMOVE_FROM_WISHLIST':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
                totalItems: Math.max(0, state.totalItems - 1)
            };
            
        case 'MOVE_TO_CART':
            // This action can be used to move items from wishlist to cart
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
                totalItems: Math.max(0, state.totalItems - 1)
            };
            
        case 'CLEAR_WISHLIST':
            return {
                items: [],
                totalItems: 0
            };
            
        case 'LOAD_WISHLIST':
            return {
                items: action.payload.items || [],
                totalItems: action.payload.totalItems || 0
            };
            
        default:
            return state;
    }
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, dispatch] = useReducer(wishlistReducer, {
        items: [],
        totalItems: 0
    });

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('shopping-wishlist');
        if (savedWishlist) {
            try {
                const parsedWishlist = JSON.parse(savedWishlist);
                dispatch({ 
                    type: 'LOAD_WISHLIST', 
                    payload: {
                        items: parsedWishlist.items || [],
                        totalItems: parsedWishlist.totalItems || 0
                    }
                });
            } catch (error) {
                console.error('Error loading wishlist from localStorage:', error);
            }
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('shopping-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    };

    const removeFromWishlist = (productId) => {
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    };

    const moveToCart = (productId) => {
        dispatch({ type: 'MOVE_TO_CART', payload: productId });
    };

    const clearWishlist = () => {
        dispatch({ type: 'CLEAR_WISHLIST' });
    };

    const isInWishlist = (productId) => {
        return wishlist.items.some(item => item.id === productId);
    };

    const getWishlistTotalValue = () => {
        return wishlist.items.reduce((total, item) => total + item.price, 0);
    };

    const getInStockCount = () => {
        return wishlist.items.filter(item => item.inStock !== false).length;
    };

    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist,
        isInWishlist,
        getWishlistTotalValue,
        getInStockCount
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};