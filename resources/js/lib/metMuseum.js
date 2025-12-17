// resources/js/lib/metMuseum.js
// FIXED: Use Laravel backend to avoid CORS issues

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get artwork details by object ID through Laravel backend
 */
export async function getArtworkById(objectId) {
  try {
    const response = await fetch(`/api/artworks/${objectId}`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch artwork ${objectId}`);
      return null;
    }
    
    const data = await response.json();
    
    // Backend returns null if no image
    if (!data || !data.image) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching artwork ${objectId}:`, error);
    return null;
  }
}

/**
 * Get curated artworks for a period through Laravel backend
 */
export async function getCuratedTimeline(periodId, limit = 4) {
  try {
    console.log(`🎨 Fetching ${limit} artworks for ${periodId}...`);
    
    const response = await fetch(`/api/artworks/period/${periodId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const artworks = await response.json();
    
    console.log(`✅ Loaded ${artworks.length} artworks for ${periodId}`);
    return artworks;
  } catch (error) {
    console.error(`Error fetching curated timeline for ${periodId}:`, error);
    return [];
  }
}

/**
 * Timeline period configurations
 */
export const TIMELINE_QUERIES = {
  ancient: {
    title: 'Ancient World',
    period: '3000 BCE – 500 CE',
    startDate: -3000,
    endDate: 500,
  },
  medieval: {
    title: 'Medieval Period',
    period: '500 – 1400',
    startDate: 500,
    endDate: 1400,
  },
  renaissance: {
    title: 'Renaissance',
    period: '1400 – 1600',
    startDate: 1400,
    endDate: 1600,
  },
  baroque: {
    title: 'Baroque & Enlightenment',
    period: '1600 – 1800',
    startDate: 1600,
    endDate: 1800,
  },
  modern: {
    title: 'Modern & Contemporary',
    period: '1800 – Present',
    startDate: 1800,
    endDate: new Date().getFullYear(),
  }
};