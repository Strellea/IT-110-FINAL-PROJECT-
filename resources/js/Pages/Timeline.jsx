// resources/js/Pages/Timeline.jsx

import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import ImmersiveScrollStory from '@/Components/Timeline/ImmersiveScrollStory';
import ArtworkModal from '@/Components/Timeline/ArtworkModal';
import { getCuratedTimeline } from '@/lib/metMuseum';

const timelinePeriods = [
  {
    id: 'renaissance',
    title: 'Renaissance',
    period: '1400–1600',
    storyTitle: 'The Awakening',
    narrative: 'In an age of discovery, humanity turned its gaze from the heavens back to earth. Artists became scientists. Scientists became artists. The human form was no longer a vessel of sin, but a celebration of divine creation.',
    description: 'The rebirth of classical learning and the birth of humanism',
    color: '#f59e0b',
    bgColor: 'from-amber-950/50 via-orange-950/30 to-black',
    accentColor: 'from-amber-400 to-orange-500',
  },
  {
    id: 'baroque',
    title: 'Baroque & Classical',
    period: '1600–1800',
    storyTitle: 'The Age of Drama',
    narrative: 'Light danced with shadow. Emotion exploded onto canvas. The world was a theater, and every painting a performance. From the depths of darkness, beauty emerged—dramatic, passionate, alive.',
    description: 'Drama, grandeur, and emotional intensity',
    color: '#8b5cf6',
    bgColor: 'from-purple-950/50 via-indigo-950/30 to-black',
    accentColor: 'from-purple-400 to-indigo-500',
  },
  {
    id: 'romanticism',
    title: 'Romanticism & Impressionism',
    period: '1800–1900',
    storyTitle: 'The Revolution of Light',
    narrative: 'Nature became the muse. Emotion, the language. Artists broke free from studios, painting life as it happened—fleeting moments of light on water, the shimmer of a sunrise, the blur of a bustling city.',
    description: 'From emotional landscapes to capturing light',
    color: '#06b6d4',
    bgColor: 'from-cyan-950/50 via-blue-950/30 to-black',
    accentColor: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'modern',
    title: 'Modern Art',
    period: '1900–2000',
    storyTitle: 'Breaking All Rules',
    narrative: 'Reality fractured into geometric shapes. Dreams melted onto canvas. Art no longer mirrored the world—it questioned it, challenged it, reimagined it entirely. The artist became a revolutionary.',
    description: 'From Cubism to Abstract Expressionism',
    color: '#ef4444',
    bgColor: 'from-red-950/50 via-pink-950/30 to-black',
    accentColor: 'from-red-400 to-pink-500',
  },
  {
    id: 'contemporary',
    title: 'Contemporary',
    period: '2000–Present',
    storyTitle: 'The Digital Renaissance',
    narrative: 'Art transcends canvas and gallery walls. Digital and physical merge. Global voices unite. Every medium is valid, every story worth telling. We stand at the intersection of all that came before—and all that is yet to come.',
    description: 'Digital revolution meets global perspectives',
    color: '#10b981',
    bgColor: 'from-emerald-950/50 via-green-950/30 to-black',
    accentColor: 'from-emerald-400 to-green-500',
  },
];

export default function Timeline({ auth }) {
  const [timelineData, setTimelineData] = useState({});
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentArtworks, setCurrentArtworks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedArtworks, setSavedArtworks] = useState([]);

  useEffect(() => {
    loadTimelineData();
    if (auth?.user) {
      loadSavedArtworks();
    }
  }, []);

  const loadTimelineData = async () => {
    const data = {};

    try {
      // Load all periods in parallel for faster loading
      const promises = timelinePeriods.map(async (period) => {
        const artworks = await getCuratedTimeline(period.id, 4);
        return { periodId: period.id, artworks };
      });

      const results = await Promise.all(promises);
      results.forEach(({ periodId, artworks }) => {
        data[periodId] = artworks;
      });

      setTimelineData(data);
    } catch (error) {
      console.error('Error loading timeline data:', error);
    }
  };

  const loadSavedArtworks = async () => {
    try {
      const response = await fetch('/api/collection');
      if (response.ok) {
        const data = await response.json();
        setSavedArtworks(data.map(item => item.artwork_id));
      }
    } catch (error) {
      console.error('Error loading saved artworks:', error);
    }
  };

  const handleArtworkClick = (artwork, periodId) => {
    const artworks = timelineData[periodId] || [];
    const index = artworks.findIndex(a => a.id === artwork.id);
    setSelectedArtwork(artwork);
    setCurrentArtworks(artworks);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedArtwork(null);
  };

  const handlePrev = () => {
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedArtwork(currentArtworks[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedArtwork(currentArtworks[newIndex]);
  };

  const handleSaveToCollection = async (artwork) => {
    if (!auth?.user) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          artwork_id: artwork.id,
          title: artwork.title,
          artist: artwork.artist,
          year: artwork.year,
          image: artwork.image,
          period: artwork.period,
        }),
      });

      if (response.ok) {
        setSavedArtworks([...savedArtworks, artwork.id]);
      }
    } catch (error) {
      console.error('Error saving artwork:', error);
    }
  };

  const handleRemoveFromCollection = async (artworkId) => {
    try {
      const response = await fetch(`/api/collection/${artworkId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
      });

      if (response.ok) {
        setSavedArtworks(savedArtworks.filter(id => id !== artworkId));
      }
    } catch (error) {
      console.error('Error removing artwork:', error);
    }
  };

  return (
    <>
      <Head title="Chronicles of Human Creativity" />
      
      <div id="timeline-start">
        <ImmersiveScrollStory 
          periods={timelinePeriods}
          artworksData={timelineData}
          onArtworkClick={handleArtworkClick}
        />
      </div>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < currentArtworks.length - 1}
          isSaved={savedArtworks.includes(selectedArtwork.id)}
          onSave={() => handleSaveToCollection(selectedArtwork)}
          onRemove={() => handleRemoveFromCollection(selectedArtwork.id)}
          isAuthenticated={!!auth?.user}
        />
      )}
    </>
  );
}