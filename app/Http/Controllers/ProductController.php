<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
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
     * Show a single product with related data.
     */
    public function show($id)
    {
        $product = Product::with(['images', 'reviews.user', 'category', 'subCategory'])
            ->findOrFail($id);

        return response()->json([
            'status' => true,
            'message' => 'Product fetched successfully.',
            'data' => $product
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
            'category_id' => 'nullable|integer|exists:categories,id',
            'sub_category_id' => 'nullable|integer|exists:sub_categories,id',
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
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
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
            'category_id' => 'nullable|integer|exists:categories,id',
            'sub_category_id' => 'nullable|integer|exists:sub_categories,id',
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
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $product->update($request->only([
            'name', 'sku', 'brand', 'category_id', 'sub_category_id', 'price', 'discount',
            'stock_quantity', 'estimated_delivery', 'free_shipping', 'returns',
            'short_description', 'long_description', 'sizes', 'colors', 'features'
        ]));

        // Handle existing images - delete images not in the existing_images array
        if ($request->has('existing_images')) {
            $imagesToDelete = $product->images()->whereNotIn('id', $request->existing_images)->get();

            foreach ($imagesToDelete as $img) {
                if (File::exists(public_path('storage/' . $img->image_path))) {
                    File::delete(public_path('storage/' . $img->image_path));
                }
                $img->delete();
            }
        } else {
            // If no existing_images provided, delete all
            foreach ($product->images as $img) {
                if (File::exists(public_path('storage/' . $img->image_path))) {
                    File::delete(public_path('storage/' . $img->image_path));
                }
                $img->delete();
            }
        }

        // Add new images
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

    /**
     * Add a review to a product.
     */
    public function addReview(Request $request, $productId)
    {
        $product = Product::findOrFail($productId);

        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|integer|exists:users,id',
            'user_name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $review = $product->reviews()->create([
            'user_id' => $request->user_id,
            'user_name' => $request->user_name,
            'email' => $request->email,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Review added successfully.',
            'data' => $review,
        ], 201);
    }
}
