<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog; // This imports ActivityLog (singular)

class ActivityLogsController extends Controller
{
    /**
     * Display a listing of the activity logs.
     */
    public function index()
    {
        // Fix: Use ActivityLog instead of ActivityLogs
        $logs = ActivityLog::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }
}