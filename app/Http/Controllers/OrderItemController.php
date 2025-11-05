<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    /**
     * Display a listing of the order items.
     */
    public function index()
    {
        try {
            $orders = OrderItem::all();

            return response()->json([
                'status' => true,
                'message' => 'Order items fetched successfully',
                'data' => $orders
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch order items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created order item in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_name' => 'required|string|max:255',
            'product_name' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'payment' => 'nullable|string',
            'features' => 'nullable|string',
            'sku' => 'nullable|string',
            'brand' => 'nullable|string',
            'price' => 'required|numeric',
            'discounted_price' => 'nullable|numeric',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        try {
            $orderItem = OrderItem::create($validatedData);

            return response()->json([
                'status' => true,
                'message' => 'Order item created successfully',
                'data' => $orderItem
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to create order item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified order item.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'user_name' => 'sometimes|string|max:255',
            'product_name' => 'sometimes|string|max:255',
            'short_description' => 'nullable|string',
            'payment' => 'nullable|string',
            'features' => 'nullable|string',
            'sku' => 'nullable|string',
            'brand' => 'nullable|string',
            'price' => 'sometimes|numeric',
            'discounted_price' => 'nullable|numeric',
            'quantity' => 'sometimes|integer|min:1',
            'size' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        try {
            $orderItem = OrderItem::findOrFail($id);
            $orderItem->update($validatedData);

            return response()->json([
                'status' => true,
                'message' => 'Order item updated successfully',
                'data' => $orderItem
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Order item not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update order item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified order item from storage.
     */
    public function destroy($id)
    {
        try {
            $orderItem = OrderItem::findOrFail($id);
            $orderItem->delete();

            return response()->json([
                'status' => true,
                'message' => 'Order item deleted successfully'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Order item not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete order item',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
