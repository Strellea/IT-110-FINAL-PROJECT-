// resources/js/Components/Timeline/ParallaxArtwork.jsx

import React from 'react';
import { motion } from 'framer-motion';

export default function ParallaxArtwork({ 
  artwork, 
  index, 
  totalCount, 
  progress, 
  isHighlighted, 
  isActive,
  onClick,
  accentColor 
}) {
  // Calculate position based on index
  const positions = [
    { x: '15%', y: '20%', rotation: -5 },
    { x: '70%', y: '15%', rotation: 8 },
    { x: '25%', y: '60%', rotation: 3 },
    { x: '65%', y: '65%', rotation: -7 },
    { x: '45%', y: '35%', rotation: 5 },
    { x: '80%', y: '50%', rotation: -3 },
  ];

  const position = positions[index % positions.length];

  // Calculate animation values
  const baseOpacity = isActive ? 0.6 : 0;
  const highlightOpacity = isHighlighted ? 1 : baseOpacity;
  const baseScale = isActive ? 0.8 : 0.5;
  const highlightScale = isHighlighted ? 1.2 : baseScale;

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer group"
      style={{
        left: position.x,
        top: position.y,
        width: '280px',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: highlightOpacity,
        scale: highlightScale,
        rotate: isHighlighted ? 0 : position.rotation,
        y: isActive ? 0 : 100,
        filter: isHighlighted ? 'brightness(1.2)' : 'brightness(0.8)',
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{
        scale: highlightScale * 1.05,
        rotate: 0,
        transition: { duration: 0.3 }
      }}
      onClick={onClick}
    >
      {/* Artwork Frame */}
      <div className="relative">
        {/* Glow Effect */}
        {isHighlighted && (
          <motion.div
            className="absolute inset-0 rounded-lg blur-2xl -z-10"
            style={{ backgroundColor: accentColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Golden Frame */}
        <div className="relative p-3 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 rounded-lg shadow-2xl">
          {/* Inner Shadow */}
          <div className="absolute inset-3 bg-black/20 rounded" />
          
          {/* Image Container */}
          <div className="relative bg-gray-900 rounded overflow-hidden aspect-[3/4]">
            {artwork.image ? (
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center p-6">
                  <p className="text-amber-400 font-bold mb-2">{artwork.title}</p>
                  <p className="text-gray-500 text-sm">{artwork.artist}</p>
                </div>
              </div>
            )}

            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-4"
            >
              <div>
                <h4 className="text-white font-bold text-sm mb-1 line-clamp-2">
                  {artwork.title}
                </h4>
                <p className="text-amber-300 text-xs">{artwork.artist}</p>
                <p className="text-white/70 text-xs mt-1">{artwork.year}</p>
              </div>
            </motion.div>
          </div>

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-200 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-200 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-200 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-200 rounded-br-lg" />
        </div>

        {/* Label Plate */}
        {isHighlighted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full"
          >
            <div className="bg-black/90 backdrop-blur-sm border border-amber-500/30 rounded-lg p-3 text-center">
              <p className="text-white text-sm font-semibold">Click to Explore</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}