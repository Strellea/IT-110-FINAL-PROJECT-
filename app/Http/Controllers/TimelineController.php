<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TimelineController extends Controller
{
    private $metApiBase = 'https://collectionapi.metmuseum.org/public/collection/v1';

    /**
     * Get artworks by time period with server-side caching
     */
    public function getByPeriod(Request $request, $period)
    {
        $cacheKey = "timeline_period_{$period}_v2";
        
        // Cache for 24 hours
        $artworks = Cache::remember($cacheKey, 86400, function () use ($period) {
            return $this->fetchArtworksForPeriod($period);
        });

        return response()->json($artworks);
    }

    /**
     * Get single artwork by ID
     */
    public function getById($id)
    {
        $cacheKey = "artwork_{$id}";
        
        // Cache for 7 days
        $artwork = Cache::remember($cacheKey, 604800, function () use ($id) {
            try {
                $response = Http::timeout(10)->get("{$this->metApiBase}/objects/{$id}");
                
                if ($response->successful()) {
                    $data = $response->json();
                    
                    // Only return if has image
                    if (empty($data['primaryImage']) && empty($data['primaryImageSmall'])) {
                        return null;
                    }
                    
                    return $this->formatArtwork($data);
                }
                
                return null;
            } catch (\Exception $e) {
                Log::error("Error fetching artwork {$id}: " . $e->getMessage());
                return null;
            }
        });

        return response()->json($artwork);
    }

    /**
     * Fetch artworks for a specific period
     */
    private function fetchArtworksForPeriod($period)
    {
        $queries = $this->getPeriodQueries($period);
        $dateRange = $this->getPeriodDateRange($period);
        $artworks = [];
        $maxArtworks = 4; // Limit to 4 per period

        foreach ($queries as $query) {
            if (count($artworks) >= $maxArtworks) {
                break;
            }

            try {
                // Search for objects
                $searchResponse = Http::timeout(10)->get("{$this->metApiBase}/search", [
                    'q' => $query,
                    'hasImages' => 'true'
                ]);

                if ($searchResponse->successful()) {
                    $data = $searchResponse->json();
                    $objectIds = $data['objectIDs'] ?? [];
                    
                    // Shuffle and limit IDs
                    shuffle($objectIds);
                    $limitedIds = array_slice($objectIds, 0, 15);
                    
                    // Fetch details for each object
                    foreach ($limitedIds as $id) {
                        if (count($artworks) >= $maxArtworks) {
                            break 2;
                        }

                        // Add delay to respect rate limits
                        usleep(300000); // 300ms delay
                        
                        try {
                            $objectResponse = Http::timeout(10)->get("{$this->metApiBase}/objects/{$id}");
                            
                            if ($objectResponse->successful()) {
                                $data = $objectResponse->json();
                                
                                // Check if has image and is in date range
                                if (!empty($data['primaryImage']) && $this->isInDateRange($data, $dateRange)) {
                                    $artworks[] = $this->formatArtwork($data);
                                }
                            }
                        } catch (\Exception $e) {
                            // Skip this artwork and continue
                            Log::warning("Failed to fetch artwork {$id}: " . $e->getMessage());
                            continue;
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error("Error searching period {$period} with query '{$query}': " . $e->getMessage());
            }
        }

        return $artworks;
    }

    /**
     * Check if artwork is in date range
     */
    private function isInDateRange($data, $dateRange)
    {
        if (!$dateRange) return true;

        $beginDate = $data['objectBeginDate'] ?? null;
        $endDate = $data['objectEndDate'] ?? null;

        if ($beginDate === null || $endDate === null) {
            return false;
        }

        // Range overlap check
        return $beginDate <= $dateRange['end'] && $endDate >= $dateRange['start'];
    }

    /**
     * Format artwork data
     */
    private function formatArtwork($data)
    {
        return [
            'id' => $data['objectID'] ?? null,
            'title' => $data['title'] ?? 'Untitled',
            'artist' => $data['artistDisplayName'] ?? 'Unknown Artist',
            'artistBio' => $data['artistDisplayBio'] ?? '',
            'year' => $data['objectDate'] ?? 'Date Unknown',
            'objectBeginDate' => $data['objectBeginDate'] ?? null,
            'objectEndDate' => $data['objectEndDate'] ?? null,
            'culture' => $data['culture'] ?? '',
            'period' => $data['period'] ?? '',
            'location' => $data['country'] ?? $data['city'] ?? '',
            'medium' => $data['medium'] ?? 'Medium Unknown',
            'dimensions' => $data['dimensions'] ?? '',
            'department' => $data['department'] ?? '',
            'classification' => $data['classification'] ?? '',
            'description' => $data['creditLine'] ?? '',
            'image' => $data['primaryImage'] ?? $data['primaryImageSmall'] ?? null,
            'additionalImages' => $data['additionalImages'] ?? [],
            'objectURL' => $data['objectURL'] ?? '',
            'isPublicDomain' => $data['isPublicDomain'] ?? false,
            'metadataDate' => $data['metadataDate'] ?? null,
            'repository' => $data['repository'] ?? ''
        ];
    }

    /**
     * Get search queries for each period
     */
    private function getPeriodQueries($period)
    {
        $queries = [
            'ancient' => ['Ancient Egyptian', 'Greek sculpture', 'Roman art', 'Mesopotamian', 'Ancient Asian'],
            'medieval' => ['Byzantine', 'Gothic manuscript', 'Medieval Christian', 'Illuminated manuscript', 'Romanesque'],
            'renaissance' => ['Italian Renaissance', 'Leonardo', 'Michelangelo', 'Raphael', 'Botticelli'],
            'baroque' => ['Baroque', 'Rembrandt', 'Caravaggio', 'Vermeer', 'Velázquez'],
            'modern' => ['Impressionism', 'Cubism', 'Abstract', 'Modern art', 'Contemporary']
        ];

        return $queries[$period] ?? [];
    }

    /**
     * Get date range for period
     */
    private function getPeriodDateRange($period)
    {
        $ranges = [
            'ancient' => ['start' => -3000, 'end' => 500],
            'medieval' => ['start' => 500, 'end' => 1400],
            'renaissance' => ['start' => 1400, 'end' => 1600],
            'baroque' => ['start' => 1600, 'end' => 1800],
            'modern' => ['start' => 1800, 'end' => date('Y')]
        ];

        return $ranges[$period] ?? null;
    }
}