import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

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
                items: [...state.items, { 
                    ...action.payload, 
                    addedDate: new Date().toISOString(),
                    wishlistItemId: action.payload.wishlistItemId || `temp-${Date.now()}`
                }],
                totalItems: state.totalItems + 1
            };
            
        case 'REMOVE_FROM_WISHLIST':
            const itemToRemove = state.items.find(item => item.wishlistItemId === action.payload);
            return {
                ...state,
                items: state.items.filter(item => item.wishlistItemId !== action.payload),
                totalItems: Math.max(0, state.totalItems - 1)
            };
            
        case 'MOVE_TO_CART':
            return {
                ...state,
                items: state.items.filter(item => item.wishlistItemId !== action.payload),
                totalItems: Math.max(0, state.totalItems - 1)
            };
            
        case 'CLEAR_WISHLIST':
            return {
                items: [],
                totalItems: 0,
                isLoading: false
            };
            
        case 'LOAD_WISHLIST':
            return {
                items: action.payload.items || [],
                totalItems: action.payload.totalItems || 0,
                isLoading: false
            };
            
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
            
        case 'SYNC_WISHLIST_SUCCESS':
            return {
                items: action.payload.items || [],
                totalItems: action.payload.totalItems || 0,
                isLoading: false
            };
            
        default:
            return state;
    }
};

export const WishlistProvider = ({ children, user = null }) => {
    const [wishlist, dispatch] = useReducer(wishlistReducer, {
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

    // Load wishlist from backend on mount
    const loadWishlistFromBackend = async () => {
        if (!isMounted.current) return;
        
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            const response = await axios.get(route('ourwishlist.index'));
            if (response.data.success) {
                const wishlistItems = response.data.data.map(item => ({
                    wishlistItemId: item.id, // Use wishlist item ID for operations
                    id: item.product_id, // Product ID
                    product_id: item.product_id,
                    name: item.product_name,
                    price: parseFloat(item.price),
                    discounted_price: item.discounted_price ? parseFloat(item.discounted_price) : null,
                    product_name: item.product_name,
                    product_sku: item.product_sku,
                    product_brand: item.product_brand,
                    user_name: item.user_name,
                    addedDate: item.created_at || new Date().toISOString(),
                    // Include additional product data that might be needed
                    image: item.product?.images?.[0] || null,
                    inStock: item.product?.in_stock !== false
                }));
                
                if (isMounted.current) {
                    dispatch({
                        type: 'SYNC_WISHLIST_SUCCESS',
                        payload: {
                            items: wishlistItems,
                            totalItems: wishlistItems.length
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading wishlist from backend:', error);
        } finally {
            if (isMounted.current) {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
    };

    // Helper function to ensure all required fields are present
    const prepareWishlistItemData = (product) => {
        return {
            user_name: auth.user?.name || 'Guest',
            product_id: product.id,
            product_name: product.name || product.product_name || 'Unknown Product',
            product_sku: product.sku || product.product_sku,
            product_brand: product.brand || product.product_brand || 'Unknown Brand',
            price: product.price || product.discounted_price || 0,
            discounted_price: product.discounted_price || product.price || 0,
        };
    };

    // Sync wishlist to backend
    const syncWishlistToBackend = async (product) => {
        try {
            const wishlistItemData = prepareWishlistItemData(product);

            console.log('Sending wishlist data:', wishlistItemData); // Debug log

            const response = await axios.post(route('ourwishlist.store'), wishlistItemData);
            
            if (response.data.success) {
                await loadWishlistFromBackend();
                return response.data.data;
            }
        } catch (error) {
            console.error('Error syncing wishlist to backend:', error);
            if (error.response) {
                console.error('Server response:', error.response.data);
            }
            throw error;
        }
    };

    const removeWishlistItemFromBackend = async (wishlistItemId) => {
        try {
            const response = await axios.delete(route('ourwishlist.destroy', { id: wishlistItemId }));
            if (response.data.success) {
                await loadWishlistFromBackend();
            }
        } catch (error) {
            console.error('Error removing wishlist item:', error);
            throw error;
        }
    };

    // Load wishlist on component mount
    useEffect(() => {
        loadWishlistFromBackend();
    }, []);

    const addToWishlist = async (product) => {
        if (!product.id) {
            console.error('Product ID is required');
            throw new Error('Product ID is required');
        }

        // Check if already in wishlist
        if (isInWishlist(product.id)) {
            console.log('Product already in wishlist');
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            // Prepare product data for local state
            const wishlistProduct = {
                ...product,
                wishlistItemId: `temp-${Date.now()}`, // Temporary ID for local state
                // Ensure all required fields are present for local state
                product_sku: product.sku || product.product_sku,
                product_brand: product.brand || product.product_brand,
                product_name: product.name || product.product_name,
                addedDate: new Date().toISOString()
            };

            // Update local state immediately for better UX
            dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistProduct });
            
            // Then sync with backend
            await syncWishlistToBackend(product);
        } catch (error) {
            console.error('Failed to add item to wishlist:', error);
            // Reload from backend to sync state on error
            await loadWishlistFromBackend();
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const removeFromWishlist = async (productIdOrWishlistItemId) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            // Determine if it's a productId or wishlistItemId
            let wishlistItemId = productIdOrWishlistItemId;
            
            // If it's a product ID, find the corresponding wishlistItemId
            if (!wishlistItemId.startsWith('temp-')) {
                const item = wishlist.items.find(item => item.id === productIdOrWishlistItemId);
                if (item) {
                    wishlistItemId = item.wishlistItemId;
                }
            }
            
            // Update local state immediately
            dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: wishlistItemId });
            
            // Then sync with backend (only if it's not a temporary ID)
            if (!wishlistItemId.startsWith('temp-')) {
                await removeWishlistItemFromBackend(wishlistItemId);
            }
        } catch (error) {
            console.error('Failed to remove item from wishlist:', error);
            await loadWishlistFromBackend();
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const moveToCart = async (wishlistItemId) => {
        // First, get the item details
        const itemToMove = wishlist.items.find(item => item.wishlistItemId === wishlistItemId);
        
        if (!itemToMove) {
            console.error('Item not found in wishlist');
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            // Remove from wishlist
            await removeFromWishlist(wishlistItemId);
            
            // Here you would typically add to cart
            // You might want to import useCart and call addToCart here
            console.log('Moving to cart:', itemToMove);
            // Example: await addToCart(itemToMove, 1);
            
        } catch (error) {
            console.error('Failed to move item to cart:', error);
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const clearWishlist = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            // Remove each item from backend
            const backendItems = wishlist.items.filter(item => !item.wishlistItemId.startsWith('temp-'));
            for (const item of backendItems) {
                await removeWishlistItemFromBackend(item.wishlistItemId);
            }
            
            // Clear local state
            dispatch({ type: 'CLEAR_WISHLIST' });
        } catch (error) {
            console.error('Failed to clear wishlist:', error);
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.items.some(item => item.id === productId);
    };

    const getWishlistTotalValue = () => {
        return wishlist.items.reduce((total, item) => {
            const price = item.discounted_price || item.price;
            return total + (price || 0);
        }, 0);
    };

    const getInStockCount = () => {
        return wishlist.items.filter(item => item.inStock !== false).length;
    };

    const getWishlistItemId = (productId) => {
        const item = wishlist.items.find(item => item.id === productId);
        return item ? item.wishlistItemId : null;
    };

    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist,
        isInWishlist,
        getWishlistTotalValue,
        getInStockCount,
        getWishlistItemId,
        loadWishlistFromBackend
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