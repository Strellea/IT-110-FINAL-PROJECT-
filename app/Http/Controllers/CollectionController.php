<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CollectionController extends Controller
{
    /**
     * Get user's saved artworks
     */
    public function index()
    {
        $user = Auth::user();
        
        $artworks = DB::table('saved_artworks')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($artworks);
    }

    /**
     * Save artwork to collection
     */
    public function store(Request $request)
    {
        $request->validate([
            'artwork_id' => 'required|integer',
            'title' => 'required|string',
            'artist' => 'nullable|string',
            'year' => 'nullable|string',
            'image' => 'nullable|string',
            'period' => 'nullable|string',
            'medium' => 'nullable|string',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $user = Auth::user();

        // Check if already saved
        $exists = DB::table('saved_artworks')
            ->where('user_id', $user->id)
            ->where('artwork_id', $request->artwork_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Artwork already in collection',
                'already_saved' => true
            ], 200);
        }

        // Save artwork
        DB::table('saved_artworks')->insert([
            'user_id' => $user->id,
            'artwork_id' => $request->artwork_id,
            'title' => $request->title,
            'artist' => $request->artist,
            'year' => $request->year,
            'image' => $request->image,
            'period' => $request->period,
            'medium' => $request->medium,
            'location' => $request->location,
            'description' => $request->description,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Artwork saved to collection',
            'success' => true
        ], 201);
    }

    /**
     * Remove artwork from collection
     */
    public function destroy($artworkId)
    {
        $user = Auth::user();

        $deleted = DB::table('saved_artworks')
            ->where('user_id', $user->id)
            ->where('artwork_id', $artworkId)
            ->delete();

        if ($deleted) {
            return response()->json([
                'message' => 'Artwork removed from collection',
                'success' => true
            ], 200);
        }

        return response()->json([
            'message' => 'Artwork not found in collection',
            'success' => false
        ], 404);
    }

    /**
     * Check if artwork is saved
     */
    public function check($artworkId)
    {
        $user = Auth::user();

        $exists = DB::table('saved_artworks')
            ->where('user_id', $user->id)
            ->where('artwork_id', $artworkId)
            ->exists();

        return response()->json([
            'is_saved' => $exists
        ]);
    }
}