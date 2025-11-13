<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Display a listing of messages.
     */
    public function index()
    {
        // Fetch all messages
        $messages = Message::all();

        // Return as JSON or pass to a view
        return response()->json($messages);
    }

    /**
     * Store a newly created message in storage.
     */
    public function store(Request $request)
    {
        // Validate incoming request
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'user_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'content' => 'nullable|string',
        ]);

        // Create message
        $message = Message::create($validated);

        return response()->json([
            'message' => 'Message created successfully',
            'data' => $message
        ], 201);
    }

    /**
     * Update the specified message in storage.
     */
    public function update(Request $request, $id)
    {
        // Find the message
        $message = Message::findOrFail($id);

        // Validate incoming request
        $validated = $request->validate([
            'user_id' => 'sometimes|integer',
            'user_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'subject' => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'content' => 'nullable|string',
        ]);

        // Update message
        $message->update($validated);

        return response()->json([
            'message' => 'Message updated successfully',
            'data' => $message
        ]);
    }

    /**
     * Remove the specified message from storage.
     */
    public function destroy($id)
    {
        $message = Message::findOrFail($id);

        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully'
        ]);
    }

    /**
     * Approve admin application and upgrade user role
     */
    public function approve($id)
    {
        DB::beginTransaction();
        
        try {
            // Find the application message
            $message = Message::findOrFail($id);
            
            // Find the user who submitted the application
            $user = User::findOrFail($message->user_id);
            
            // Check if user exists and is a customer
            if ($user->role === 'customer') {
                // Upgrade user role to admin
                $user->role = 'admin';
                $user->save();
                
                // Update message status
                $message->status = 'approved';
                $message->approved_at = now();
                $message->save();
                
                DB::commit();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Application approved successfully. User has been upgraded to admin.',
                    'data' => [
                        'message' => $message,
                        'user' => $user
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'User is not a customer or already has admin privileges.'
                ], 400);
            }
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve application: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject admin application
     */
    public function reject($id)
    {
        try {
            // Find the application message
            $message = Message::findOrFail($id);
            
            // Update message status to rejected
            $message->status = 'rejected';
            $message->rejected_at = now();
            $message->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Application rejected successfully.',
                'data' => $message
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject application: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pending admin applications
     */
    public function pending()
    {
        $pendingApplications = Message::where('status', 'pending')
            ->orWhereNull('status')
            ->get();
            
        return response()->json($pendingApplications);
    }

    /**
     * Get approved admin applications
     */
    public function approved()
    {
        $approvedApplications = Message::where('status', 'approved')->get();
            
        return response()->json($approvedApplications);
    }

    /**
     * Get rejected admin applications
     */
    public function rejected()
    {
        $rejectedApplications = Message::where('status', 'rejected')->get();
            
        return response()->json($rejectedApplications);
    }

    /**
     * Show the specified message.
     */
    public function show($id)
    {
        $message = Message::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $message
        ]);
    }
}