<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ActivityLog; // 👈 Import ActivityLog
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Optional: for user tracking

class CategoryController extends Controller
{
    // Show all categories
    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function indexWithSubCategory()
    {
        $categories = Category::with('subCategories')->get();
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    // Store a new category
    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string|max:255|unique:categories,category',
        ]);

        $category = Category::create([
            'category' => $request->category,
        ]);

        // 🔔 Log: Category created
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => 'Created category: ' . $category->category,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully!',
            'data' => $category
        ], 201);
    }

    // Update an existing category
    public function update(Request $request, $id)
    {
        $request->validate([
            'category' => 'required|string|max:255|unique:categories,category,' . $id,
        ]);

        $category = Category::findOrFail($id);
        $oldName = $category->category;

        $category->update([
            'category' => $request->category,
        ]);

        // 🔔 Log: Category updated
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Updated category from '{$oldName}' to '{$category->category}'",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully!',
            'data' => $category
        ]);
    }

    // Delete a category
    public function destroy(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $categoryName = $category->category;

        $category->delete();

        // 🔔 Log: Category deleted
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => 'Deleted category: ' . $categoryName,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully!'
        ]);
    }
}