<?php

namespace App\Http\Controllers;

use App\Models\ProductsCart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display a listing of the user's cart items.
     */
    public function index()
    {
        $userId = Auth::id();

        $cartItems = ProductsCart::with('product')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'size' => $item->size,
                    'color' => $item->color,
                    'price' => $item->price,
                    'discounted_price' => $item->discounted_price,
                    'total_price' => $item->total_price,
                    'image' => $item->image,
                    'product' => $item->product ? [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'discount' => $item->product->discount,
                    ] : null
                ];
            });

        $totalItems = $cartItems->sum('quantity');
        $totalPrice = $cartItems->sum('total_price');

        return response()->json([
            'success' => true,
            'message' => 'Cart items retrieved successfully.',
            'data' => $cartItems,
            'meta' => [
                'total_items' => $totalItems,
                'total_price' => $totalPrice
            ]
        ]);
    }

    /**
     * Store a newly added product in the user's cart.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
        ]);

        $userId = Auth::id();
        $user = User::findOrFail($userId);
        $product = Product::findOrFail($validated['product_id']);

        // Check if item already exists in cart with same size and color
        $existingCart = ProductsCart::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->where('size', $validated['size'] ?? null)
            ->where('color', $validated['color'] ?? null)
            ->first();

        if ($existingCart) {
            $existingCart->quantity += $validated['quantity'];
            $existingCart->save();

            return response()->json([
                'success' => true,
                'message' => 'Cart updated successfully (quantity increased).',
                'data' => $this->formatCartItem($existingCart)
            ]);
        }

        // Calculate discounted price
        $discountedPrice = null;
        if ($product->discount) {
            $discountedPrice = $product->price - ($product->price * $product->discount / 100);
        }


        $cartItem = ProductsCart::create([
            'user_id' => $userId,
            'user_name' => $user->name, 
            'product_id' => $product->id,
            'product_name' => $product->name, 
            'quantity' => $validated['quantity'],
            'size' => $validated['size'] ?? null,
            'color' => $validated['color'] ?? null,
            'price' => $product->price,
            'discounted_price' => $discountedPrice,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart successfully.',
            'data' => $this->formatCartItem($cartItem)
        ]);
    }

    /**
     * Update the specified cart item.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'sometimes|integer|min:1',
            'size' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            'image' => 'sometimes|string|max:255', // Only image can be updated separately
        ]);

        $cartItem = ProductsCart::with('product')->findOrFail($id);

        if ($cartItem->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        // Only update the fields that are present in the request
        $updateData = [];
        
        if (isset($validated['quantity'])) {
            $updateData['quantity'] = $validated['quantity'];
        }
        
        if (isset($validated['size'])) {
            $updateData['size'] = $validated['size'];
        }
        
        if (isset($validated['color'])) {
            $updateData['color'] = $validated['color'];
        }
        
        if (isset($validated['image'])) {
            $updateData['image'] = $validated['image'];
        }

        $cartItem->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Cart item updated successfully.',
            'data' => $this->formatCartItem($cartItem)
        ]);
    }

    /**
     * Update only the image of a cart item.
     */
    public function updateImage(Request $request, $id)
    {
        $validated = $request->validate([
            'image' => 'required|string|max:255',
        ]);

        $cartItem = ProductsCart::findOrFail($id);

        if ($cartItem->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        // Update only the image field
        $cartItem->update([
            'image' => $validated['image']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cart item image updated successfully.',
            'data' => $this->formatCartItem($cartItem)
        ]);
    }

    /**
     * Remove the specified item from the cart.
     */
    public function destroy($id)
    {
        $cartItem = ProductsCart::findOrFail($id);

        if ($cartItem->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart item removed successfully.'
        ]);
    }

    /**
     * Format cart item for response
     */
    private function formatCartItem(ProductsCart $cartItem)
    {
        return [
            'id' => $cartItem->id,
            'product_id' => $cartItem->product_id,
            'product_name' => $cartItem->product_name,
            'quantity' => $cartItem->quantity,
            'size' => $cartItem->size,
            'color' => $cartItem->color,
            'price' => $cartItem->price,
            'discounted_price' => $cartItem->discounted_price,
            'total_price' => $cartItem->total_price,
            'image' => $cartItem->image,
            'product' => $cartItem->product ? [
                'id' => $cartItem->product->id,
                'name' => $cartItem->product->name,
                'price' => $cartItem->product->price,
                'discount' => $cartItem->product->discount,
            ] : null
        ];
    }
}