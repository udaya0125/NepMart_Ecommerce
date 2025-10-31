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
        $wishlists = Wishlist::all();

        return response()->json([
            'status' => true,
            'message' => 'Wishlist items fetched successfully.',
            'data' => $wishlists
        ], 200);
    }

    /**
     * Store a newly created wishlist item in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
            'product_name' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'features' => 'nullable|string',
            'sku' => 'nullable|string|max:100',
            'brand' => 'nullable|string|max:255',
        ]);

        $wishlist = Wishlist::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Wishlist item added successfully.',
            'data' => $wishlist
        ], 201);
    }

    /**
     * Update the specified wishlist item in storage.
     */
    public function update(Request $request, $id)
    {
        $wishlist = Wishlist::find($id);

        if (!$wishlist) {
            return response()->json([
                'status' => false,
                'message' => 'Wishlist item not found.'
            ], 404);
        }

        $validated = $request->validate([
            'user_name' => 'sometimes|string|max:255',
            'product_name' => 'sometimes|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'features' => 'nullable|string',
            'sku' => 'nullable|string|max:100',
            'brand' => 'nullable|string|max:255',
        ]);

        $wishlist->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Wishlist item updated successfully.',
            'data' => $wishlist
        ], 200);
    }

    /**
     * Remove the specified wishlist item from storage.
     */
    public function destroy($id)
    {
        $wishlist = Wishlist::find($id);

        if (!$wishlist) {
            return response()->json([
                'status' => false,
                'message' => 'Wishlist item not found.'
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'status' => true,
            'message' => 'Wishlist item deleted successfully.'
        ], 200);
    }
}
