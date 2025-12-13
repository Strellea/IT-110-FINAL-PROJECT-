// resources/js/Components/Timeline/ArtworkModal.jsx

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, MapPin, Palette, ExternalLink, Sparkles } from 'lucide-react';

export default function ArtworkModal({ 
  artwork, 
  onClose, 
  periodColor = '#f59e0b'
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.8, rotateY: -90 }}
          animate={{ scale: 1, rotateY: 0 }}
          exit={{ scale: 0.8, rotateY: 90 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-6xl w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden border-2 shadow-2xl"
          style={{ borderColor: periodColor }}
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform" />
          </motion.button>

          {/* Decorative Glow Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl" />

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative min-h-[300px] md:min-h-[600px] overflow-hidden bg-black">
              {artwork.image ? (
                <>
                  <motion.img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-contain"
                    initial={{ scale: 1.2, filter: "blur(20px)", opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      filter: "blur(0px)", 
                      opacity: 1 
                    }}
                    transition={{ duration: 0.8 }}
                    onLoad={() => setImageLoaded(true)}
                  />
                  
                  {/* Loading Spinner */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500 text-lg">No image available</p>
                </div>
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Sparkle Effect */}
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 left-4"
              >
                <Sparkles size={24} className="text-amber-400" />
              </motion.div>
            </div>
            
            {/* Details Section */}
            <div className="p-6 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[600px]">
              {/* Title */}
              <motion.h2
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              >
                {artwork.title}
              </motion.h2>

              {/* Artist */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="p-2 bg-amber-500/20 rounded-full">
                  <User size={20} className="text-amber-400" />
                </div>
                <span className="text-xl md:text-2xl text-amber-300 font-medium">
                  {artwork.artist}
                </span>
              </motion.div>
              
              {/* Metadata Grid */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 gap-3 mb-8"
              >
                {artwork.year && (
                  <div className="flex items-center gap-3 text-gray-300 bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <Calendar size={18} className="text-blue-400 flex-shrink-0" />
                    <span className="text-sm">{artwork.year}</span>
                  </div>
                )}
                
                {artwork.location && (
                  <div className="flex items-center gap-3 text-gray-300 bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <MapPin size={18} className="text-green-400 flex-shrink-0" />
                    <span className="text-sm">{artwork.location}</span>
                  </div>
                )}
                
                {artwork.medium && (
                  <div className="flex items-center gap-3 text-gray-300 bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <Palette size={18} className="text-purple-400 flex-shrink-0" />
                    <span className="text-xs">{artwork.medium}</span>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              {artwork.description && (
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="border-t border-gray-700 pt-6 mb-6"
                >
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {artwork.description}
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                {/* Continue Button */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                >
                  Continue Journey
                </motion.button>

                {/* Met Museum Link */}
                {artwork.objectURL && (
                  <motion.a
                    href={artwork.objectURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                  >
                    <span>View Original</span>
                    <ExternalLink size={18} />
                  </motion.a>
                )}
              </motion.div>

              {/* Public Domain Badge */}
              {artwork.isPublicDomain && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="mt-6 inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 text-sm font-semibold rounded-lg border border-green-500/30"
                >
                  <Sparkles size={16} className="mr-2" />
                  Public Domain
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}