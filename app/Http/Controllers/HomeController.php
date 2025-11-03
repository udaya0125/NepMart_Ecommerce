<?php

namespace App\Http\Controllers;

use App\Models\Home;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    public function index()
    {
        $homes = Home::all();
        return response()->json($homes);
    }

    public function store(Request $request)
    {
        Log::info('Store method called');
        Log::info('Request data:', $request->all());
        Log::info('Request files:', array_keys($request->allFiles()));

        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'title' => 'nullable|string|max:255',
            'sub_title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $path = $request->file('image')->store('uploads/home', 'public');

        $home = Home::create([
            'image_path' => $path,
            'title' => $request->title ?? '',
            'sub_title' => $request->sub_title ?? '',
            'description' => $request->description ?? '',
        ]);

        // 🔔 Log: Home image uploaded
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Uploaded home image #{$home->id}",
        ]);

        return response()->json([
            'message' => 'Image uploaded successfully!',
            'data' => $home,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        Log::info('Update method called for ID: ' . $id);
        Log::info('Request data:', $request->all());
        Log::info('Request has file:', ['has_file' => $request->hasFile('image')]);

        $home = Home::findOrFail($id);

        $request->validate([
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'title' => 'nullable|string|max:255',
            'sub_title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $updateData = [
            'title' => $request->title ?? $home->title,
            'sub_title' => $request->sub_title ?? $home->sub_title,
            'description' => $request->description ?? $home->description,
        ];

        // Handle image update if provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($home->image_path && Storage::disk('public')->exists($home->image_path)) {
                Storage::disk('public')->delete($home->image_path);
            }

            $newImagePath = $request->file('image')->store('uploads/home', 'public');
            $updateData['image_path'] = $newImagePath;
        }

        $home->update($updateData);

        // 🔔 Log: Home record updated
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Updated home record #{$home->id}",
        ]);

        return response()->json([
            'message' => 'Home record updated successfully!',
            'data' => $home,
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $home = Home::findOrFail($id);

        if ($home->image_path && Storage::disk('public')->exists($home->image_path)) {
            Storage::disk('public')->delete($home->image_path);
        }

        $homeId = $home->id;
        $home->delete();

        // 🔔 Log: Home record deleted
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Deleted home record #{$homeId}",
        ]);

        return response()->json(['message' => 'Home record deleted successfully!']);
    }
}