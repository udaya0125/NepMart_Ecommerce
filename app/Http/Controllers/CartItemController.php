<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    /**
     * Display a listing of the cart items.
     */
    public function index()
    {
        // Load cart items with product AND product images
        $cartItems = CartItem::with('product.images')->get();

        return response()->json([
            'success' => true,
            'message' => 'Cart items retrieved successfully.',
            'data' => $cartItems,
        ], 200);
    }

    /**
     * Store a newly created cart item.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_name' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'product_name' => 'required|string|max:255',
            'product_sku' => 'nullable|string|max:100',
            'product_brand' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'discounted_price' => 'nullable|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
        ]);

        // Check if item already exists in cart
        $existingCartItem = CartItem::where('user_name', $validatedData['user_name'])
            ->where('product_id', $validatedData['product_id'])
            ->where('size', $validatedData['size'])
            ->where('color', $validatedData['color'])
            ->first();

        if ($existingCartItem) {
            $existingCartItem->quantity += $validatedData['quantity'];
            $existingCartItem->save();

            return response()->json([
                'success' => true,
                'message' => 'Cart item quantity updated successfully.',
                'data' => $existingCartItem->load('product.images'), // Load images here too
            ], 200);
        }

        $cartItem = CartItem::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart successfully.',
            'data' => $cartItem->load('product.images'), // Load images here too
        ], 201);
    }

    /**
     * Update the specified cart item.
     */
    public function update(Request $request, $id)
    {
        $cartItem = CartItem::with('product.images')->find($id); // Load images here too

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }

        $validatedData = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Cart item updated successfully.',
            'data' => $cartItem,
        ], 200);
    }

    /**
     * Remove the specified cart item from storage.
     */
    public function destroy($id)
    {
        $cartItem = CartItem::find($id);

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart item deleted successfully.',
        ], 200);
    }
}