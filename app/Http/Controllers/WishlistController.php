<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Display a listing of the wishlist items.
     */
    public function index()
    {
        try {
            // Eager load the product relationship with its images
            $wishlistItems = Wishlist::with(['product.images'])->get();

            return response()->json([
                'success' => true,
                'message' => 'Wishlist items retrieved successfully.',
                'data' => $wishlistItems
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching wishlist items.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created wishlist item in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
            'product_id' => 'required|integer|exists:products,id', // Added exists validation
            'product_name' => 'required|string|max:255',
            'product_sku' => 'nullable|string|max:255',
            'product_brand' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'discounted_price' => 'nullable|numeric|min:0',
        ]);

        try {
            // Check if item already exists in wishlist for this user
            $existingItem = Wishlist::where('user_name', $validated['user_name'])
                ->where('product_id', $validated['product_id'])
                ->first();

            if ($existingItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product already exists in wishlist.',
                    'data' => $existingItem->load('product.images')
                ], 409); // 409 Conflict
            }

            $wishlist = Wishlist::create($validated);

            // Load the product relationship with images
            $wishlist->load('product.images');

            return response()->json([
                'success' => true,
                'message' => 'Product added to wishlist successfully.',
                'data' => $wishlist
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add product to wishlist.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified wishlist item.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'product_name' => 'nullable|string|max:255',
            'product_sku' => 'nullable|string|max:255',
            'product_brand' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'discounted_price' => 'nullable|numeric|min:0',
        ]);

        try {
            $wishlist = Wishlist::findOrFail($id);
            $wishlist->update($validated);

            // Load the product relationship with images
            $wishlist->load('product.images');

            return response()->json([
                'success' => true,
                'message' => 'Wishlist item updated successfully.',
                'data' => $wishlist
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Wishlist item not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update wishlist item.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified wishlist item.
     */
    public function destroy($id)
    {
        try {
            $wishlist = Wishlist::findOrFail($id);
            $wishlist->delete();

            return response()->json([
                'success' => true,
                'message' => 'Wishlist item deleted successfully.'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Wishlist item not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete wishlist item.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}