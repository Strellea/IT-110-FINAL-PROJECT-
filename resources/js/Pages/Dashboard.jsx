import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, TrendingUp, Clock, Palette } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth }) {
  const [stats, setStats] = useState({
    totalArtworks: 0,
    recentArtworks: [],
    periodBreakdown: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/collection');
      if (response.ok) {
        const artworks = await response.json();
        
        // Calculate stats
        const periodBreakdown = artworks.reduce((acc, artwork) => {
          const period = artwork.period || 'Unknown';
          acc[period] = (acc[period] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalArtworks: artworks.length,
          recentArtworks: artworks.slice(0, 6),
          periodBreakdown,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const periodColors = {
    ancient: '#f59e0b',
    medieval: '#8b5cf6',
    renaissance: '#06b6d4',
    baroque: '#ef4444',
    modern: '#10b981',
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, {auth.user.name}
                </h1>
                <p className="text-gray-400 mt-1">Your personal art journey dashboard</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Collection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Heart className="text-pink-500" size={32} />
                    <div className="px-3 py-1 bg-pink-500/20 rounded-full text-pink-400 text-sm font-semibold">
                      Total
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">
                    {stats.totalArtworks}
                  </h3>
                  <p className="text-gray-400">Artworks Saved</p>
                </motion.div>

                {/* Exploration Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="text-amber-500" size={32} />
                    <div className="px-3 py-1 bg-amber-500/20 rounded-full text-amber-400 text-sm font-semibold">
                      Progress
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">
                    {Object.keys(stats.periodBreakdown).length}
                  </h3>
                  <p className="text-gray-400">Periods Explored</p>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="text-purple-500" size={32} />
                    <div className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm font-semibold">
                      Latest
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">
                    {stats.recentArtworks.length}
                  </h3>
                  <p className="text-gray-400">Recent Additions</p>
                </motion.div>
              </div>

              {/* Period Breakdown */}
              {Object.keys(stats.periodBreakdown).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="text-amber-400" size={24} />
                    <h2 className="text-xl font-bold text-white">Your Collection by Period</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(stats.periodBreakdown).map(([period, count]) => {
                      const periodKey = period.toLowerCase();
                      const color = periodColors[periodKey] || '#6b7280';
                      
                      return (
                        <div
                          key={period}
                          className="bg-black/30 border border-white/10 rounded-lg p-4 hover:border-white/30 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <h3 className="text-white font-semibold capitalize">{period}</h3>
                          </div>
                          <p className="text-3xl font-bold text-white">{count}</p>
                          <p className="text-gray-500 text-sm">
                            {count === 1 ? 'artwork' : 'artworks'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Recent Artworks */}
              {stats.recentArtworks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Recently Added</h2>
                    <Link
                      href="/collection"
                      className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors"
                    >
                      View All →
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.recentArtworks.map((artwork, index) => (
                      <motion.div
                        key={artwork.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden border border-white/10 group-hover:border-amber-500/50 transition-all">
                          {artwork.image ? (
                            <img
                              src={artwork.image}
                              alt={artwork.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Sparkles className="text-gray-700" size={24} />
                            </div>
                          )}
                        </div>
                        <p className="text-white text-xs mt-2 line-clamp-2 font-medium">
                          {artwork.title}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/"
                  className="flex-1 min-w-[200px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all text-center"
                >
                  Explore Timeline
                </Link>
                <Link
                  href="/collection"
                  className="flex-1 min-w-[200px] bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-4 px-6 rounded-xl backdrop-blur-sm transition-all text-center"
                >
                  View Collection
                </Link>
              </motion.div>

              {/* Empty State */}
              {stats.totalArtworks === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Sparkles className="text-gray-600 mx-auto mb-4" size={64} />
                  <h2 className="text-2xl font-bold text-white mb-2">Start Your Journey</h2>
                  <p className="text-gray-400 mb-6">
                    Discover and save artworks as you explore the timeline
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                  >
                    Begin Exploring
                  </Link>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}