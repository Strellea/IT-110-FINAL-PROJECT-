// resources/js/Components/Timeline/ProgressIndicator.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProgressIndicator({ periods, currentChapter, currentPeriod, scrollProgress }) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-6 items-end">
        {/* Current Period Label - Large Display */}
        <AnimatePresence mode="wait">
          {currentPeriod && (
            <motion.div
              key={currentPeriod.id}
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <div className="bg-black/90 backdrop-blur-md border-2 rounded-xl px-6 py-4 min-w-[220px]"
                style={{ borderColor: currentPeriod.color }}
              >
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">CURRENT ERA</div>
                  <div className="text-lg font-bold text-white mb-1">
                    {currentPeriod.title}
                  </div>
                  <div className="text-sm font-semibold"
                    style={{ color: currentPeriod.color }}
                  >
                    {currentPeriod.period}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="w-12 h-px bg-gradient-to-l from-white/30 to-transparent mb-2" />

        {/* Opening (Prologue) */}
        <ChapterDot
          isActive={currentChapter === 0}
          label="Prologue"
          color="#fbbf24"
        />

        {/* Chapter Dots */}
        {periods.map((period, index) => (
          <ChapterDot
            key={period.id}
            isActive={currentChapter === index + 1}
            label={period.title}
            color={period.color}
            chapterNumber={index + 1}
            period={period.period}
          />
        ))}

        {/* Closing (Epilogue) */}
        <ChapterDot
          isActive={currentChapter === periods.length + 1}
          label="Epilogue"
          color="#10b981"
        />
      </div>
    </div>
  );
}

function ChapterDot({ isActive, label, color, chapterNumber, period }) {
  return (
    <div className="relative group">
      {/* Dot Container */}
      <motion.div
        animate={{
          scale: isActive ? 1.8 : 1,
          opacity: isActive ? 1 : 0.4,
        }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
        className="relative"
      >
        {/* Main Dot */}
        <div
          className="w-3 h-3 rounded-full border-2 transition-all duration-300"
          style={{
            backgroundColor: isActive ? color : 'transparent',
            borderColor: isActive ? color : 'rgba(255,255,255,0.3)',
            boxShadow: isActive ? `0 0 20px ${color}, 0 0 40px ${color}50` : 'none',
          }}
        />
        
        {/* Pulse Rings - Active State */}
        {isActive && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: color }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: color }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5
              }}
            />
          </>
        )}

        {/* Inner Glow - Active State */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.8, 0.3, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Active Label - Always Visible for Active Chapter */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute right-10 top-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <div 
              className="backdrop-blur-md border-2 rounded-lg px-4 py-2 shadow-xl"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.9)',
                borderColor: color
              }}
            >
              {chapterNumber && (
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-xs font-bold">
                    CH {chapterNumber}
                  </span>
                  <div className="w-px h-4 bg-white/20" />
                  <div className="text-right">
                    <span className="text-white font-bold text-sm block">
                      {label}
                    </span>
                    {period && (
                      <span className="text-xs font-semibold" style={{ color }}>
                        {period}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {!chapterNumber && (
                <span className="text-white font-semibold text-sm">{label}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Tooltip - For Inactive Chapters */}
      {!isActive && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 shadow-lg">
            <div className="text-right">
              {chapterNumber && (
                <span className="text-white/50 text-xs mr-1.5">
                  Ch {chapterNumber}:
                </span>
              )}
              <span className="text-white/80 text-xs font-medium">{label}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}