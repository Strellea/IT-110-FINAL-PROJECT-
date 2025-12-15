// resources/js/lib/metMuseum.js

const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Search the Met Museum collection
 * FILTERED BY DATE
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

        objectBeginDate: data.objectBeginDate,
        objectEndDate: data.objectEndDate,

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
export async function getArtworksByIds(objectIds, limit = 6, startDate, endDate) {
  const artworks = [];
  const idsToTry = objectIds.slice(0, limit * 10); // Try 4x the limit
  
  console.log(`Attempting to fetch ${limit} artworks from ${idsToTry.length} IDs (filtering ${startDate}-${endDate})...`);
  
  for (let i = 0; i < idsToTry.length && artworks.length < limit; i++) {
    // Fetch ONE at a time with delay
    await delay(600); // 600ms between each request
    
    const artwork = await getArtworkById(idsToTry[i]);
    
    if (artwork && artwork.image) {
      const begin = artwork.objectBeginDate;
      const end = artwork.objectEndDate;

      // Range overlap check (handles BCE â†’ CE correctly)
      if (begin <= endDate && end >= startDate) {
        artworks.push(artwork);
        console.log(
          ` Loaded artwork ${artworks.length}/${limit}: ${artwork.title} (${begin} to ${end})`
        );
      } else {
        console.log(
          `— Skipped ${artwork.title} - wrong period (${begin} to ${end} not in ${startDate}-${endDate})`
        );
      }
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
 * Extract year from Met Museum date strings
 * Examples: "1503", "ca. 1665", "1889â€“90", "16th century"
 */
function extractYearFromDate(dateString) {
  if (!dateString) return null;
  
  // Remove common prefixes
  dateString = dateString.replace(/^(ca\.|about|before|after)\s*/i, '');
  
  // Extract first 4-digit number
  const match = dateString.match(/\d{4}/);
  if (match) {
    return parseInt(match[0]);
  }
  
  // Handle century format (e.g., "16th century" = 1500)
  const centuryMatch = dateString.match(/(\d+)(st|nd|rd|th)\s+century/i);
  if (centuryMatch) {
    const century = parseInt(centuryMatch[1]);
    return (century - 1) * 100 + 50; // Use middle of century
  }

   return null;
}
  

/**
 * Curated collection for timeline periods
 */
export const TIMELINE_QUERIES = {
  ancient: {
    title: 'Ancient World',
    period: '3000 BCE â€“ 500 CE',
    startDate: -3000,
    endDate: 500,
    queries: [
      'Ancient Egyptian art',
      'Mesopotamian art',
      'Ancient Greek sculpture',
      'Roman sculpture',
      'Ancient Asian art'
    ]
  },

  medieval: {
    title: 'Medieval Period',
    period: '500 â€“ 1400',
    startDate: 500,
    endDate: 1400,
    queries: [
      'Byzantine art',
      'Gothic manuscript',
      'Medieval Christian art',
      'Illuminated manuscript',
      'Early Christian art'
    ]
  },

  renaissance: {
    title: 'Renaissance',
    period: '1400 â€“ 1600',
    startDate: 1400,
    endDate: 1600,
    queries: [
      'Italian Renaissance painting',
      'Northern Renaissance',
      'Leonardo da Vinci',
      'Michelangelo',
      'Raphael'
    ]
  },

  baroque: {
    title: 'Baroque & Enlightenment',
    period: '1600 â€“ 1800',
    startDate: 1600,
    endDate: 1800,
    queries: [
      'Baroque painting',
      'Rococo art',
      'Caravaggio',
      'Rembrandt',
      'Vermeer'
    ]
  },

  modern: {
    title: 'Modern & Contemporary',
    period: '1800 â€“ Present',
    startDate: 1800,
    endDate: new Date().getFullYear(),
    queries: [
      'Impressionism',
      'Cubism',
      'Abstract art',
      'Modern art',
      'Contemporary art'
    ]
  }
};

/**
 * Get curated artworks for timeline
 */
export async function getCuratedTimeline(timelineKey, limit = 6) {
  const timeline = TIMELINE_QUERIES[timelineKey];
  if (!timeline) return [];
  
  try {
    console.log(`\ Fetching ${limit} artworks for ${timelineKey} (${timeline.startDate}-${timeline.endDate})...`);
    
    const allObjectIds = [];
    
    // Search using queries 
    for (const query of timeline.queries) {
      try {
        const ids = await searchArtworks(query, { hasImages: true });
        allObjectIds.push(...ids.slice(0, 20)); // Get 10 from each query
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
    const artworks = await getArtworksByIds(shuffled, limit, timeline.startDate, timeline.endDate);
    
    console.log(`Completed ${timelineKey}: ${artworks.length} artworks\n`);
    return artworks;
  } catch (error) {
    console.error(`Error fetching curated timeline for ${timelineKey}:`, error);
    return [];
  }
}