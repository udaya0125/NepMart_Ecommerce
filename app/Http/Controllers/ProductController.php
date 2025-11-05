<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display all products with related data.
     */
    public function index()
    {
        $products = Product::with(['images', 'reviews', 'category', 'subCategory'])->get();

        return response()->json([
            'status' => true,
            'message' => 'All products fetched successfully.',
            'data' => $products
        ], 200);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name',
            'sku' => 'nullable|string|unique:products,sku',
            'brand' => 'nullable|string|max:255',
            'category_id' => 'nullable|string|max:255',
            'sub_category_id' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'stock_quantity' => 'required|integer|min:0',
            'estimated_delivery' => 'nullable|string|max:255',
            'free_shipping' => 'nullable|string|max:255',
            'returns' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'sizes' => 'nullable|string',
            'colors' => 'nullable|string',
            'features' => 'nullable|string',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $product = Product::create($request->only([
            'name', 'sku', 'brand', 'category_id', 'sub_category_id', 'price', 'discount',
            'stock_quantity', 'estimated_delivery', 'free_shipping', 'returns',
            'short_description', 'long_description', 'sizes', 'colors', 'features'
        ]));

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $imageFile) {
                $filename = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
                $path = $imageFile->storeAs('uploads/products', $filename, 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'alt_text' => $product->name,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Product created successfully.',
            'data' => $product->load('images'),
        ], 201);
    }

    /**
     * Update an existing product.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255|unique:products,name,' . $id,
            'sku' => 'nullable|string|unique:products,sku,' . $id,
            'brand' => 'nullable|string|max:255',
            'category_id' => 'nullable|string|max:255',
            'sub_category_id' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'stock_quantity' => 'required|integer|min:0',
            'estimated_delivery' => 'nullable|string|max:255',
            'free_shipping' => 'nullable|string|max:255',
            'returns' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'sizes' => 'nullable|string',
            'colors' => 'nullable|string',
            'features' => 'nullable|string',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'nullable|integer|exists:product_images,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $product->update($request->only([
            'name', 'sku', 'brand', 'category_id', 'sub_category_id', 'price', 'discount',
            'stock_quantity', 'estimated_delivery', 'free_shipping', 'returns',
            'short_description', 'long_description', 'sizes', 'colors', 'features'
        ]));

        // Handle existing images - delete images that are not in the existing_images array
        if ($request->has('existing_images')) {
            $product->images()->whereNotIn('id', $request->existing_images)->delete();
        } else {
            // If no existing_images array is provided, delete all existing images
            $product->images()->delete();
        }

        // Handle new images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $imageFile) {
                $filename = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
                $path = $imageFile->storeAs('uploads/products', $filename, 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'alt_text' => $product->name,
                    'is_primary' => $index === 0 && $product->images()->count() === 0,
                ]);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully.',
            'data' => $product->load('images'),
        ], 200);
    }

    /**
     * Delete a product and its images.
     */
    public function destroy($id)
    {
        $product = Product::with('images')->findOrFail($id);

        foreach ($product->images as $image) {
            if (File::exists(public_path('storage/' . $image->image_path))) {
                File::delete(public_path('storage/' . $image->image_path));
            }
            $image->delete();
        }

        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully.',
        ], 200);
    }
}