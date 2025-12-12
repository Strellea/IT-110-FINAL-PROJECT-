// resources/js/lib/metMuseum.js

const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Search the Met Museum collection
 */
export async function searchArtworks(query, options = {}) {
  try {
    const params = new URLSearchParams({
      q: query,
      hasImages: options.hasImages !== false ? 'true' : 'false',
      ...options
    });
    
    await delay(300); // Add delay before search
    const response = await fetch(`${MET_API_BASE}/search?${params}`);
    const data = await response.json();
    
    return data.objectIDs || [];
  } catch (error) {
    console.error('Error searching artworks:', error);
    return [];
  }
}

/**
 * Get artwork details by object ID with retry logic
 */
export async function getArtworkById(objectId, retries = 2) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Progressive delay: 500ms, 1500ms
      if (attempt > 0) {
        await delay(1500 * attempt);
      }
      
      const response = await fetch(`${MET_API_BASE}/objects/${objectId}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn(`Rate limited for artwork ${objectId}, attempt ${attempt + 1}`);
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Only return if artwork has an image
      if (!data.primaryImage && !data.primaryImageSmall) {
        return null;
      }
      
      return {
        id: data.objectID,
        title: data.title || 'Untitled',
        artist: data.artistDisplayName || 'Unknown Artist',
        artistBio: data.artistDisplayBio || '',
        year: data.objectDate || 'Date Unknown',
        culture: data.culture || '',
        period: data.period || '',
        location: data.country || data.city || '',
        medium: data.medium || 'Medium Unknown',
        dimensions: data.dimensions || '',
        department: data.department || '',
        classification: data.classification || '',
        description: data.creditLine || '',
        image: data.primaryImage || data.primaryImageSmall || null,
        additionalImages: data.additionalImages || [],
        objectURL: data.objectURL || '',
        isPublicDomain: data.isPublicDomain || false,
        metadataDate: data.metadataDate,
        repository: data.repository || ''
      };
    } catch (error) {
      if (attempt === retries - 1) {
        // Silently fail on last attempt
        return null;
      }
    }
  }
  
  return null;
}

/**
 * Get multiple artworks by IDs - ONE AT A TIME to avoid rate limiting
 */
export async function getArtworksByIds(objectIds, limit = 6) {
  const artworks = [];
  const idsToTry = objectIds.slice(0, limit * 4); // Try 4x the limit
  
  console.log(`Attempting to fetch ${limit} artworks from ${idsToTry.length} IDs...`);
  
  for (let i = 0; i < idsToTry.length && artworks.length < limit; i++) {
    // Fetch ONE at a time with delay
    await delay(600); // 600ms between each request
    
    const artwork = await getArtworkById(idsToTry[i]);
    
    if (artwork && artwork.image) {
      artworks.push(artwork);
      console.log(`✓ Loaded artwork ${artworks.length}/${limit}: ${artwork.title}`);
    }
    
    // Stop if we have enough
    if (artworks.length >= limit) {
      break;
    }
  }
  
  console.log(`Successfully loaded ${artworks.length} artworks with images`);
  return artworks;
}

/**
 * Curated collection for timeline periods
 */
export const TIMELINE_QUERIES = {
  renaissance: {
    period: '1400–1600',
    queries: ['Renaissance painting', 'Italian Renaissance', 'Botticelli'],
    startDate: 1400,
    endDate: 1600
  },
  baroque: {
    period: '1600–1800',
    queries: ['Baroque painting', 'Rembrandt', 'Vermeer'],
    startDate: 1600,
    endDate: 1800
  },
  romanticism: {
    period: '1800–1900',
    queries: ['Impressionism', 'Monet', 'Turner'],
    startDate: 1800,
    endDate: 1900
  },
  modern: {
    period: '1900–2000',
    queries: ['Modern art', 'Picasso', 'Abstract art'],
    startDate: 1900,
    endDate: 2000
  },
  contemporary: {
    period: '2000–Present',
    queries: ['Contemporary art', 'Photography', 'Sculpture'],
    startDate: 2000,
    endDate: new Date().getFullYear()
  }
};

/**
 * Get curated artworks for timeline
 */
export async function getCuratedTimeline(timelineKey, limit = 6) {
  const timeline = TIMELINE_QUERIES[timelineKey];
  if (!timeline) return [];
  
  try {
    console.log(`\n📚 Fetching ${limit} artworks for ${timelineKey}...`);
    
    const allObjectIds = [];
    
    // Search using queries (reduced to 3 queries per period)
    for (const query of timeline.queries) {
      try {
        const ids = await searchArtworks(query, { hasImages: true });
        allObjectIds.push(...ids.slice(0, 10)); // Get 10 from each query
        await delay(400); // Delay between searches
      } catch (error) {
        console.warn(`Failed to search for "${query}"`);
      }
    }
    
    // Remove duplicates and shuffle
    const uniqueIds = [...new Set(allObjectIds)];
    const shuffled = uniqueIds.sort(() => Math.random() - 0.5);
    
    console.log(`Found ${shuffled.length} unique artwork IDs for ${timelineKey}`);
    
    // Fetch artwork details
    const artworks = await getArtworksByIds(shuffled, limit);
    
    console.log(`✅ Completed ${timelineKey}: ${artworks.length} artworks\n`);
    return artworks;
  } catch (error) {
    console.error(`Error fetching curated timeline for ${timelineKey}:`, error);
    return [];
  }
}