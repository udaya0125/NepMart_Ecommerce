<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use App\Models\ActivityLog; // 👈 Import ActivityLog
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the testimonials.
     */
    public function index()
    {
        $testimonials = Testimonial::all();

        return response()->json([
            'status' => true,
            'message' => 'All testimonials fetched successfully.',
            'data' => $testimonials
        ], 200);
    }

    /**
     * Store a newly created testimonial in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), Testimonial::rules());

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $testimonial = Testimonial::create($request->only([
            'user', 'comment', 'rating', 'title'
        ]));

        // 🔔 Log: Testimonial created
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Created testimonial by '{$testimonial->user}': '{$testimonial->comment}'",
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Testimonial created successfully.',
            'data' => $testimonial
        ], 201);
    }

    /**
     * Update the specified testimonial.
     */
    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::find($id);

        if (!$testimonial) {
            return response()->json([
                'status' => false,
                'message' => 'Testimonial not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), Testimonial::rules());

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldUser = $testimonial->user;
        $oldComment = $testimonial->comment;

        $testimonial->update($request->only([
            'user', 'comment', 'rating', 'title'
        ]));

        // 🔔 Log: Testimonial updated
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => $request->ip(),
            'title' => "Updated testimonial ID {$testimonial->id} (from user '{$oldUser}': '{$oldComment}')",
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Testimonial updated successfully.',
            'data' => $testimonial
        ], 200);
    }

    /**
     * Remove the specified testimonial from storage.
     */
    public function destroy($id)
    {
        $testimonial = Testimonial::find($id);

        if (!$testimonial) {
            return response()->json([
                'status' => false,
                'message' => 'Testimonial not found.'
            ], 404);
        }

        $user = $testimonial->user;
        $comment = $testimonial->comment;

        $testimonial->delete();

        // 🔔 Log: Testimonial deleted
        ActivityLog::create([
            'name' => Auth::check() ? Auth::user()->name : 'Admin',
            'ip_address' => request()->ip(),
            'title' => "Deleted testimonial by '{$user}': '{$comment}'",
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Testimonial deleted successfully.'
        ], 200);
    }
}