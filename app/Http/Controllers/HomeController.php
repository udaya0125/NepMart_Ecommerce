<?php

namespace App\Http\Controllers;

use App\Models\Home;
use App\Models\ActivityLog; // 👈 Import ActivityLog
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth; // Optional: for authenticated user

class HomeController extends Controller
{
    public function index()
    {
        $homes = Home::all();
        return response()->json($homes);
    }

    public function store(Request $request)
    {
        \Log::info('Store method called');
        \Log::info('Request data:', $request->all());
        \Log::info('Request files:', array_keys($request->allFiles()));

        $request->validate([
            'images.*' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
        ]);

        $createdHomes = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('uploads/home', 'public');

                $home = Home::create([
                    'image_path' => $path,
                ]);

                $createdHomes[] = $home;
            }
        }

        // 🔔 Log: Home images uploaded
        $count = count($createdHomes);
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Uploaded {$count} home image(s)",
        ]);

        return response()->json([
            'message' => 'Images uploaded successfully!',
            'data' => $createdHomes,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $home = Home::findOrFail($id);

        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
        ]);

        if ($home->image_path && Storage::disk('public')->exists($home->image_path)) {
            Storage::disk('public')->delete($home->image_path);
        }

        $newImagePath = $request->file('image')->store('uploads/home', 'public');

        $home->update([
            'image_path' => $newImagePath,
        ]);

        // 🔔 Log: Home image updated
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Updated home image #{$home->id}",
        ]);

        return response()->json([
            'message' => 'Image updated successfully!',
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

        // 🔔 Log: Home image deleted
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Deleted home image #{$homeId}",
        ]);

        return response()->json(['message' => 'Image deleted successfully!']);
    }
}