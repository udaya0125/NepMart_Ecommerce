<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blogs = Blog::with('category')->latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'All blogs fetched successfully.',
            'data' => $blogs
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title'          => 'required|string|max:255',
            'excerpt'        => 'required|string',
            'author'         => 'required|string|max:100',
            'category_id'    => 'required|exists:categories,id',
            'read_time'      => 'required|string|max:50',
            'introduction'   => 'required|string',
            'key_features'   => 'nullable|string',
            'image'          => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('blogs', 'public');
        }

        $blog = Blog::create([
            'title'         => $request->title,
            'excerpt'       => $request->excerpt,
            'author'        => $request->author,
            'category_id'   => $request->category_id,
            'read_time'     => $request->read_time,
            'introduction'  => $request->introduction,
            'key_features'  => $request->key_features,
            'image'         => $imagePath,
        ]);

        // 🔔 Log activity: Blog created
        ActivityLog::create([
            'name'        => Auth::check() ? Auth::user()->name : 'Guest',
            'ip_address'  => $request->ip(),
            'title'       => 'Created blog: ' . $blog->title,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Blog created successfully.',
            'data' => $blog->load('category')
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $validatedData = $request->validate([
            'title'          => 'required|string|max:255',
            'excerpt'        => 'required|string',
            'author'         => 'required|string|max:100',
            'category_id'    => 'required|exists:categories,id',
            'read_time'      => 'required|string|max:50',
            'introduction'   => 'required|string',
            'key_features'   => 'nullable|string',
            'image'          => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Handle new image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($blog->image && Storage::disk('public')->exists($blog->image)) {
                Storage::disk('public')->delete($blog->image);
            }

            // Store new image
            $imagePath = $request->file('image')->store('blogs', 'public');
            $blog->image = $imagePath;
        }

        $blog->update([
            'title'         => $request->title,
            'excerpt'       => $request->excerpt,
            'author'        => $request->author,
            'category_id'   => $request->category_id,
            'read_time'     => $request->read_time,
            'introduction'  => $request->introduction,
            'key_features'  => $request->key_features,
        ]);

        // 🔔 Log activity: Blog updated
        ActivityLog::create([
            'name'        => Auth::check() ? Auth::user()->name : 'Guest',
            'ip_address'  => $request->ip(),
            'title'       => 'Updated blog: ' . $blog->title,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Blog updated successfully.',
            'data' => $blog->load('category')
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        $blogTitle = $blog->title; // Save title before deletion

        // Delete image
        if ($blog->image && Storage::disk('public')->exists($blog->image)) {
            Storage::disk('public')->delete($blog->image);
        }

        $blog->delete();

        // 🔔 Log activity: Blog deleted
        ActivityLog::create([
            'name'        => Auth::check() ? Auth::user()->name : 'Guest',
            'ip_address'  => request()->ip(),
            'title'       => 'Deleted blog: ' . $blogTitle,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Blog deleted successfully.'
        ], 200);
    }
}