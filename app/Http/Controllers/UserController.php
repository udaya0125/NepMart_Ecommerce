<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $users = User::latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'User list retrieved successfully',
            'data' => $users
        ], 200);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|min:6',
            'role'      => 'nullable|string|max:50',
            'image'     => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        // Handle image upload if available
        $imagePath = null;
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $imagePath = $request->file('image')->store('users', 'public');
        }

        // Create user
        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => $request->role ?? 'user',
            'image'     => $imagePath
        ]);

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Define validation rules
        $validationRules = [
            'name'      => 'sometimes|required|string|max:255',
            'email'     => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password'  => 'nullable|min:6',
            'role'      => 'nullable|string|max:50',
        ];

        // Only validate image if it's present in the request and not null/empty
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $validationRules['image'] = 'image|mimes:jpg,jpeg,png|max:2048';
        }

        $request->validate($validationRules);

        // Handle image update only if a new image is provided
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Delete old image if exists
            if ($user->image && Storage::disk('public')->exists($user->image)) {
                Storage::disk('public')->delete($user->image);
            }
            $imagePath = $request->file('image')->store('users', 'public');
        } else {
            // Keep the existing image if no new image is provided
            $imagePath = $user->image;
        }

        // Prepare update data
        $updateData = [
            'name'      => $request->name ?? $user->name,
            'email'     => $request->email ?? $user->email,
            'role'      => $request->role ?? $user->role,
            'image'     => $imagePath
        ];

        // Only update password if provided
        if ($request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        // Update user details
        $user->update($updateData);

        return response()->json([
            'status' => true,
            'message' => 'User updated successfully',
            'data' => $user
        ], 200);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->image && Storage::disk('public')->exists($user->image)) {
            Storage::disk('public')->delete($user->image);
        }

        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully'
        ], 200);
    }
}