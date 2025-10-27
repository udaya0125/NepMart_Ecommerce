<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use App\Models\ActivityLog; // 👈 Import ActivityLog
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubCategoryController extends Controller
{
    public function index()
    {
        $subcategories = SubCategory::with('category')->get();

        return response()->json([
            'success' => true,
            'data' => $subcategories
        ]);
    }

    // Store a new subcategory
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category' => 'required|string|max:255',
        ]);

        $subcategory = SubCategory::create([
            'category_id' => $request->category_id,
            'sub_category' => $request->sub_category,
        ]);

        // Load category for logging
        $subcategory->load('category');

        // 🔔 Log: Subcategory created
        $categoryName = $subcategory->category ? $subcategory->category->category : 'Unknown Category';
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Created subcategory: '{$subcategory->sub_category}' under category: '{$categoryName}'",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subcategory created successfully!',
            'data' => $subcategory
        ], 201);
    }

    // Update an existing subcategory
    public function update(Request $request, $id)
    {
        $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'sub_category' => 'required|string|max:255',
        ]);

        $subcategory = SubCategory::findOrFail($id);
        $oldSubCategory = $subcategory->sub_category;
        $oldCategory = $subcategory->category ? $subcategory->category->category : 'Unknown';

        $subcategory->update([
            'category_id' => $request->category_id ?? $subcategory->category_id,
            'sub_category' => $request->sub_category,
        ]);

        // Reload category after update
        $subcategory->load('category');
        $newCategory = $subcategory->category ? $subcategory->category->category : 'Unknown';

        // 🔔 Log: Subcategory updated
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Updated subcategory from '{$oldSubCategory}' (category: '{$oldCategory}') to '{$subcategory->sub_category}' (category: '{$newCategory}')",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subcategory updated successfully!',
            'data' => $subcategory
        ]);
    }

    // Delete a subcategory
    public function destroy(Request $request, $id)
    {
        $subcategory = SubCategory::findOrFail($id);
        $subcategoryName = $subcategory->sub_category;
        $categoryName = $subcategory->category ? $subcategory->category->category : 'Unknown Category';

        $subcategory->delete();

        // 🔔 Log: Subcategory deleted
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Deleted subcategory: '{$subcategoryName}' from category: '{$categoryName}'",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subcategory deleted successfully!'
        ]);
    }
}