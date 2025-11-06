<?php

namespace App\Http\Controllers;

use App\Models\OrderProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderProductController extends Controller
{
    /**
     * Display a listing of all order products.
     */
    public function index()
    {
        $orders = OrderProduct::all();

        return response()->json([
            'success' => true,
            'message' => 'All order products retrieved successfully.',
            'data' => $orders,
        ], 200);
    }

    /**
     * Store a newly created order product in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_name'        => 'required|string|max:255',
            'product_id'       => 'required|integer',
            'product_name'     => 'required|string|max:255',
            'payment_method'   => 'required|string|max:255',
            'product_sku'      => 'required|string|max:100',
            'product_brand'    => 'nullable|string|max:255',
            'quantity'         => 'required|integer|min:1',
            'price'            => 'required|numeric|min:0',
            'discounted_price' => 'nullable|numeric|min:0',
            'size'             => 'nullable|string|max:50',
            'color'            => 'nullable|string|max:50',
        ]);

        // Generate unique order_id
        $validated['order_id'] = 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));

        $order = OrderProduct::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Order product created successfully.',
            'data' => $order,
        ], 201);
    }

    /**
     * Update the specified order product in storage.
     */
    public function update(Request $request, $id)
    {
        $order = OrderProduct::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order product not found.',
            ], 404);
        }

        $validated = $request->validate([
            'user_name'        => 'sometimes|string|max:255',
            'product_id'       => 'sometimes|integer',
            'product_name'     => 'sometimes|string|max:255',
            'payment_method'   => 'sometimes|string|max:255',
            'product_sku'      => 'sometimes|string|max:100',
            'product_brand'    => 'nullable|string|max:255',
            'quantity'         => 'sometimes|integer|min:1',
            'price'            => 'sometimes|numeric|min:0',
            'discounted_price' => 'nullable|numeric|min:0',
            'size'             => 'nullable|string|max:50',
            'color'            => 'nullable|string|max:50',
        ]);

        $order->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Order product updated successfully.',
            'data' => $order,
        ], 200);
    }

    /**
     * Remove the specified order product from storage.
     */
    public function destroy($id)
    {
        $order = OrderProduct::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order product not found.',
            ], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order product deleted successfully.',
        ], 200);
    }
}
