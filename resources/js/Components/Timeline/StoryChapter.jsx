// resources/js/Components/Timeline/StoryChapter.jsx

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function StoryChapter({ period, artworks, onArtworkClick, isActive, chapterProgress, index }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // OPTIMIZED SCROLL PHASES - Better artwork visibility
  // 0-0.15: Title phase (triggers progress indicator early)
  // 0.15-0.30: Narrative phase  
  // 0.30-0.42: Masterpieces intro
  // 0.42-0.55: BUFFER SCROLL
  // 0.55-1: Artworks display (EARLIER appearance, more visible)
  
  const titleOpacity = useTransform(scrollYProgress, [0.03, 0.10, 0.13, 0.15], [0, 1, 1, 0]);
  const narrativeOpacity = useTransform(scrollYProgress, [0.15, 0.20, 0.28, 0.30], [0, 1, 1, 0]);
  const introOpacity = useTransform(scrollYProgress, [0.30, 0.35, 0.40, 0.42], [0, 1, 1, 0]);
  const artworksOpacity = useTransform(scrollYProgress, [0.55, 0.60, 0.90, 1], [0, 1, 1, 0.7]);

  return (
    <section 
      ref={sectionRef}
      data-period-id={period.id}
      className="relative min-h-[600vh]"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Background with smooth gradient transition */}
      <div 
        className="absolute inset-0 -z-10 transition-all duration-[3000ms] ease-in-out"
        style={{
          opacity: isActive ? 1 : 0,
          background: `linear-gradient(to bottom, 
            rgba(0,0,0,0.95), 
            ${period.bgColor.includes('amber') ? 'rgba(120, 53, 15, 0.6)' : 
              period.bgColor.includes('purple') ? 'rgba(88, 28, 135, 0.6)' : 
              period.bgColor.includes('cyan') ? 'rgba(8, 51, 68, 0.6)' : 
              period.bgColor.includes('red') ? 'rgba(127, 29, 29, 0.6)' : 
              'rgba(6, 78, 59, 0.6)'}, 
            rgba(0,0,0,0.95))`,
          filter: isActive ? 'blur(0px)' : 'blur(20px)',
        }}
      />

      {/* Sticky Content Area */}
      <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative z-20 px-8 max-w-7xl mx-auto w-full">
          
          {/* Phase 1: Title */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center w-full max-w-5xl">
              <motion.div 
                className="mb-6"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.span 
                  className="inline-block text-[8rem] md:text-[10rem] font-bold bg-gradient-to-br from-white/15 to-white/5 bg-clip-text text-transparent leading-none"
                  style={{
                    filter: `drop-shadow(0 0 30px ${period.color}40)`
                  }}
                >
                  0{index + 1}
                </motion.span>
              </motion.div>

              <motion.div 
                className="mb-8 flex justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.span 
                  className={`inline-block px-8 py-3 bg-gradient-to-r ${period.accentColor} bg-opacity-20 backdrop-blur-sm rounded-full text-white font-bold tracking-widest border border-white/30 text-lg`}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    boxShadow: `0 0 20px ${period.color}30`
                  }}
                >
                  {period.period}
                </motion.span>
              </motion.div>

              <motion.h2 
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <span 
                  className={`bg-gradient-to-r ${period.accentColor} bg-clip-text text-transparent drop-shadow-2xl`}
                  style={{
                    filter: `drop-shadow(0 0 20px ${period.color}50)`
                  }}
                >
                  {period.storyTitle}
                </span>
              </motion.h2>

              <motion.h3 
                className="text-3xl md:text-5xl text-white/90 font-light"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {period.title}
              </motion.h3>
            </div>
          </motion.div>

          {/* Phase 2: Narrative */}
          <motion.div
            style={{ opacity: narrativeOpacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center w-full max-w-5xl px-8">
              <motion.div 
                className="w-48 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-12"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1 }}
              />
              
              <motion.p 
                className="text-2xl md:text-4xl text-white/95 leading-relaxed font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              >
                {period.narrative}
              </motion.p>
              
              <motion.div 
                className="w-48 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-12"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Phase 3: Masterpieces Intro */}
          <motion.div
            style={{ opacity: introOpacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center w-full">
              <motion.h3 
                className="text-5xl md:text-6xl font-bold text-white mb-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Masterpieces of the Era
              </motion.h3>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/80 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Continue scrolling to reveal the artworks
              </motion.p>

              <motion.div
                animate={{ 
                  y: [0, 15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl text-white/60"
              >
                ↓
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Phase 4: Artworks Grid - BETTER POSITIONED */}
      {/* Phase 4: Artworks Grid (FIXED + ALWAYS VISIBLE WHEN IN PHASE) */}
      <motion.div
        style={{ opacity: artworksOpacity }}
        className="relative z-[40] w-full px-4 md:px-8 mt-[220vh] mb-40" /* push artworks below sticky area */
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          {artworks.slice(0, 6).map((artwork, artIndex) => {
            const rotations = [-2, 2, -1, 2, -2, 1];
            const rotation = rotations[artIndex % rotations.length];

            return (
              <motion.div
                key={artwork.id}

                /* IMPORTANT: always visible once it enters viewport */
                initial={{ opacity: 0, y: 60, rotate: rotation - 8 }}
                whileInView={{ opacity: 1, y: 0, rotate: rotation }}

                viewport={{ once: true, amount: 0.4 }}

                transition={{
                  duration: 0.6,
                  delay: artIndex * 0.1
                }}

                whileHover={{
                  scale: 1.08,
                  rotate: 0,
                  zIndex: 20,
                  transition: { duration: 0.3 }
                }}

                onClick={() => onArtworkClick(artwork, period.id)}
                className="cursor-pointer group relative"
              >

                {/* Glow */}
                <div
                  className="absolute inset-0 rounded-lg blur-xl -z-10 opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                  style={{ backgroundColor: period.color }}
                />

                {/* FRAME */}
                <div className="relative p-2.5 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 rounded-lg shadow-2xl">

                  <div className="relative bg-gray-900 rounded overflow-hidden aspect-[3/4]">

                    {artwork.image ? (
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800">
                        <p className="text-white text-xs">{artwork.title}</p>
                      </div>
                    )}

                    {/* Hover details */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end p-2">
                      <div>
                        <h4 className="text-white font-bold text-xs">{artwork.title}</h4>
                        <p className="text-amber-300 text-[10px]">{artwork.artist}</p>
                        <p className="text-white/80 text-[10px]">{artwork.year}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}

        </div>
      </motion.div>


      {/* Ambient Particles */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                background: period.color,
                opacity: 0.3,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}