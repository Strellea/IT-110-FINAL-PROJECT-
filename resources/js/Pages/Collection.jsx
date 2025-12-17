import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Calendar, User, MapPin, Palette, Heart, Sparkles } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Collection({ auth }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    try {
      const response = await fetch('/api/collection');
      if (response.ok) {
        const data = await response.json();
        setArtworks(data);
      }
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (artworkId) => {
    if (!confirm('Remove this artwork from your collection?')) return;

    try {
      const response = await fetch(`/api/collection/${artworkId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
      });

      if (response.ok) {
        setArtworks(artworks.filter(a => a.artwork_id !== artworkId));
        setSelectedArtwork(null);
      }
    } catch (error) {
      console.error('Error removing artwork:', error);
    }
  };

  const periods = ['all', 'ancient', 'medieval', 'renaissance', 'baroque', 'modern'];
  const filteredArtworks = filterPeriod === 'all' 
    ? artworks 
    : artworks.filter(a => a.period?.toLowerCase().includes(filterPeriod));

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="My Collection" />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Heart className="text-pink-500 fill-current" size={32} />
                <div>
                  <h1 className="text-3xl font-bold text-white">My Collection</h1>
                  <p className="text-gray-400 mt-1">
                    {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'} saved
                  </p>
                </div>
              </div>
              <Link
                href="/"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Back to Timeline
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  filterPeriod === period
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                }`}
              >
                {period === 'all' ? 'All' : period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredArtworks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Sparkles className="text-gray-600 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-bold text-white mb-2">
                {filterPeriod === 'all' ? 'No artworks yet' : 'No artworks in this period'}
              </h2>
              <p className="text-gray-400 mb-6">
                Start building your collection by exploring the timeline
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                Explore Timeline
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedArtwork(artwork)}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/20">
                    {/* Image */}
                    <div className="aspect-[3/4] overflow-hidden bg-black">
                      {artwork.image ? (
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="text-gray-700" size={48} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                        {artwork.title}
                      </h3>
                      <p className="text-amber-400 text-sm mb-2">{artwork.artist}</p>
                      <p className="text-gray-500 text-xs">{artwork.year}</p>
                    </div>

                    {/* Period Badge */}
                    {artwork.period && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-xs text-amber-400 font-semibold border border-amber-500/30">
                        {artwork.period}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Artwork Detail Modal */}
        <AnimatePresence>
          {selectedArtwork && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArtwork(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl"
              >
                <div className="grid md:grid-cols-2 gap-0 max-h-[85vh]">
                  {/* Image */}
                  <div className="relative h-full min-h-[300px] bg-black">
                    {selectedArtwork.image && (
                      <img
                        src={selectedArtwork.image}
                        alt={selectedArtwork.title}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-white mb-3">{selectedArtwork.title}</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-300">
                        <User size={18} className="text-amber-400" />
                        <span>{selectedArtwork.artist}</span>
                      </div>
                      {selectedArtwork.year && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <Calendar size={18} className="text-blue-400" />
                          <span>{selectedArtwork.year}</span>
                        </div>
                      )}
                      {selectedArtwork.location && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <MapPin size={18} className="text-green-400" />
                          <span>{selectedArtwork.location}</span>
                        </div>
                      )}
                      {selectedArtwork.medium && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <Palette size={18} className="text-purple-400" />
                          <span className="text-sm">{selectedArtwork.medium}</span>
                        </div>
                      )}
                    </div>

                    {selectedArtwork.description && (
                      <div className="border-t border-gray-700 pt-4 mb-6">
                        <p className="text-gray-400 text-sm">{selectedArtwork.description}</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleRemove(selectedArtwork.artwork_id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg border border-red-500/30 transition-all"
                    >
                      <Trash2 size={18} />
                      Remove from Collection
                    </button>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthenticatedLayout>
  );
}