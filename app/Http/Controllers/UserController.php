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
            'name'             => 'required|string|max:255',
            'email'            => 'required|email|unique:users,email',
            'password'         => 'required|min:6',
            'role'             => 'nullable|string|max:50',
            'image'            => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'street_address'   => 'nullable|string|max:255',
            'city'             => 'nullable|string|max:100',
            'zip_code'         => 'nullable|string|max:20',
            'state_province'   => 'nullable|string|max:100',
            'phone_no'         => 'nullable|string|max:20',
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $imagePath = $request->file('image')->store('users', 'public');
        }

        // Create user
        $user = User::create([
            'name'            => $request->name,
            'email'           => $request->email,
            'password'        => Hash::make($request->password),
            'role'            => $request->role ?? 'user',
            'image'           => $imagePath,
            'street_address'  => $request->street_address,
            'city'            => $request->city,
            'zip_code'        => $request->zip_code,
            'state_province'  => $request->state_province,
            'phone_no'        => $request->phone_no,
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

        $validationRules = [
            'name'            => 'sometimes|required|string|max:255',
            'email'           => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password'        => 'nullable|min:6',
            'role'            => 'nullable|string|max:50',
            'street_address'  => 'nullable|string|max:255',
            'city'            => 'nullable|string|max:100',
            'zip_code'        => 'nullable|string|max:20',
            'state_province'  => 'nullable|string|max:100',
            'phone_no'        => 'nullable|string|max:20',
        ];

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $validationRules['image'] = 'image|mimes:jpg,jpeg,png|max:2048';
        }

        $request->validate($validationRules);

        // Handle image update
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            if ($user->image && Storage::disk('public')->exists($user->image)) {
                Storage::disk('public')->delete($user->image);
            }
            $imagePath = $request->file('image')->store('users', 'public');
        } else {
            $imagePath = $user->image;
        }

        // Update fields
        $updateData = [
            'name'            => $request->name ?? $user->name,
            'email'           => $request->email ?? $user->email,
            'role'            => $request->role ?? $user->role,
            'image'           => $imagePath,
            'street_address'  => $request->street_address ?? $user->street_address,
            'city'            => $request->city ?? $user->city,
            'zip_code'        => $request->zip_code ?? $user->zip_code,
            'state_province'  => $request->state_province ?? $user->state_province,
            'phone_no'        => $request->phone_no ?? $user->phone_no,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

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
