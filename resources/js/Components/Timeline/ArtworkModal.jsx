// resources/js/Components/Timeline/ArtworkModal.jsx

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, MapPin, Palette, ChevronLeft, ChevronRight, ExternalLink, Sparkles, Heart, HeartOff } from 'lucide-react';

export default function ArtworkModal({ 
  artwork, 
  onClose, 
  onPrev, 
  onNext, 
  hasPrev, 
  hasNext,
  isSaved,
  onSave,
  onRemove,
  isAuthenticated
}) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleArrows = (e) => {
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleArrows);
    return () => window.removeEventListener('keydown', handleArrows);
  }, [hasPrev, hasNext, onPrev, onNext]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSaveClick = async () => {
    setSaving(true);
    try {
      if (isSaved) {
        await onRemove();
      } else {
        await onSave();
      }
    } finally {
      setSaving(false);
    }
  };

  // Backdrop variants
  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: { 
      opacity: 1, 
      backdropFilter: "blur(10px)",
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      backdropFilter: "blur(0px)",
      transition: { duration: 0.2 }
    }
  };

  // Modal variants
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 100
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: -100,
      transition: { duration: 0.2 }
    }
  };

  // Content variants
  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  // Button variants
  const buttonVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring", stiffness: 200 }
    },
    hover: { 
      scale: 1.1,
      boxShadow: "0 0 20px rgba(251, 191, 36, 0.5)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
        onClick={onClose}
      >
        {/* Close Button */}
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          onClick={onClose}
          className="absolute top-4 right-4 p-3 text-white/70 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 z-50 group"
        >
          <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>
        
        {/* Previous Button */}
        {hasPrev && (
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/70 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 z-50"
          >
            <ChevronLeft size={32} />
          </motion.button>
        )}
        
        {/* Next Button */}
        {hasNext && (
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/70 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 z-50"
          >
            <ChevronRight size={32} />
          </motion.button>
        )}

        {/* Modal Content */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-white/10 relative"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative min-h-[300px] md:min-h-[600px] overflow-hidden bg-black rounded-l-3xl">
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
                  
                  {/* Image Loading Overlay */}
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
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {/* Title */}
              <motion.h2
                variants={contentVariants}
                className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight"
              >
                {artwork.title}
              </motion.h2>
              
              {/* Artist */}
              <motion.div
                variants={contentVariants}
                className="flex items-center gap-3 mb-8 group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-2 bg-amber-500/20 rounded-full"
                >
                  <User size={20} className="text-amber-400" />
                </motion.div>
                <span className="text-xl font-medium text-amber-300 group-hover:text-amber-200 transition-colors">
                  {artwork.artist}
                </span>
              </motion.div>
              
              {/* Metadata Grid */}
              <motion.div
                variants={contentVariants}
                className="grid grid-cols-1 gap-4 mb-8"
              >
                {artwork.year && (
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-gray-300 bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10"
                  >
                    <Calendar size={20} className="text-blue-400 flex-shrink-0" />
                    <span>{artwork.year}</span>
                  </motion.div>
                )}
                
                {artwork.location && (
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-gray-300 bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10"
                  >
                    <MapPin size={20} className="text-green-400 flex-shrink-0" />
                    <span>{artwork.location}</span>
                  </motion.div>
                )}
                
                {artwork.medium && (
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-gray-300 bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10"
                  >
                    <Palette size={20} className="text-purple-400 flex-shrink-0" />
                    <span className="text-sm">{artwork.medium}</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Additional Info */}
              {(artwork.culture || artwork.dimensions) && (
                <motion.div
                  variants={contentVariants}
                  className="space-y-3 mb-8"
                >
                  {artwork.culture && (
                    <div className="flex items-start gap-3 text-gray-300">
                      <span className="text-pink-400 font-semibold text-sm">Culture:</span>
                      <span className="text-sm">{artwork.culture}</span>
                    </div>
                  )}
                  {artwork.dimensions && (
                    <div className="flex items-start gap-3 text-gray-300">
                      <span className="text-cyan-400 font-semibold text-sm">Dimensions:</span>
                      <span className="text-sm">{artwork.dimensions}</span>
                    </div>
                  )}
                </motion.div>
              )}
              
              {/* Description */}
              {(artwork.description || artwork.artistBio) && (
                <motion.div
                  variants={contentVariants}
                  className="border-t border-gray-700 pt-6 mb-6"
                >
                  {artwork.description && (
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {artwork.description}
                    </p>
                  )}
                  {artwork.artistBio && (
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {artwork.artistBio}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                variants={contentVariants}
                className="flex flex-wrap gap-4"
              >
                {/* Save to Collection Button */}
                <motion.button
                  onClick={handleSaveClick}
                  disabled={saving}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(251, 191, 36, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all ${
                    isSaved 
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {saving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      {isSaved ? <HeartOff size={18} /> : <Heart size={18} />}
                      <span>{isSaved ? 'Remove from Collection' : 'Save to My Collection'}</span>
                    </>
                  )}
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
                    <span>View on Met Museum</span>
                    <ExternalLink size={18} />
                  </motion.a>
                )}
              </motion.div>

              {/* Public Domain Badge */}
              {artwork.isPublicDomain && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 text-sm font-semibold rounded-lg border border-green-500/30"
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