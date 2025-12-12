// resources/js/Components/Timeline/ImmersiveScrollStory.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StoryChapter from './StoryChapter';
import ProgressIndicator from './ProgressIndicator';
import ThreeBackground from '@/Components/ThreeBackground';

export default function ImmersiveScrollStory({ periods, artworksData, onArtworkClick }) {
  const containerRef = useRef(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      
      setScrollProgress(progress);
      
      const sections = document.querySelectorAll('[data-period-id]');
      let activeFound = false;
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        const viewCenter = viewportHeight / 2;

        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();

          // Condition: section that covers viewport center becomes "active"
          if (rect.top <= viewCenter && rect.bottom >= viewCenter) {
            const periodId = section.getAttribute("data-period-id");
            const period = periods.find((p) => p.id === periodId);

            if (period && !activeFound) {
              setCurrentChapter(index + 1);
              setCurrentPeriod(period);
              activeFound = true;
            }
          }
        });
      });
      
      if (!activeFound && progress < 0.1) {
        setCurrentChapter(0);
        setCurrentPeriod(null);
      }
      
      if (!activeFound && progress > 0.9) {
        setCurrentChapter(periods.length + 1);
        setCurrentPeriod(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [periods]);

  return (
    
    <div ref={containerRef} className="relative bg-black">

       {/* 3D BACKGROUND */}
          <div className="absolute inset-0 z-0">
            <ThreeBackground />
          </div> 
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          >

            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-8"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg transform rotate-45" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Chronicles of Human Creativity
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-gray-400 text-lg mb-8"
              >
                Preparing your journey through art history...
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="w-64 mx-auto"
              >
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          <OpeningScene scrollProgress={scrollProgress} />

          {periods.map((period, index) => {
            const totalChapters = periods.length + 4;
            const chapterStart = (index + 1) / totalChapters;
            const chapterEnd = (index + 2) / totalChapters;
            const isActive = scrollProgress >= (chapterStart - 0.02) && scrollProgress < (chapterEnd + 0.02);
            const chapterProgress = isActive 
              ? Math.max(0, Math.min(1, (scrollProgress - chapterStart) / (chapterEnd - chapterStart)))
              : scrollProgress < chapterStart ? 0 : 1;

            return (
              <StoryChapter
                key={period.id}
                period={period}
                artworks={artworksData[period.id] || []}
                onArtworkClick={onArtworkClick}
                isActive={isActive}
                chapterProgress={chapterProgress}
                index={index}
              />
            );
          })}

          <ClosingScene />

          <ProgressIndicator 
            periods={periods}
            currentChapter={currentChapter}
            currentPeriod={currentPeriod}
            scrollProgress={scrollProgress}
          />
        </>
      )}
    </div>
  );
}

function OpeningScene({ scrollProgress }) {
  const opacity = Math.max(0, 1 - scrollProgress * 8);
  const scale = 1 + scrollProgress * 0.5;

  return (
    <motion.section 
      style={{ opacity, transform: `scale(${scale})` }}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div className="text-center z-10 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex flex-col items-center gap-3 text-amber-400"
          >
            <span className="text-sm tracking-widest">SCROLL</span>
            <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 bg-amber-400 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}

function ClosingScene() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="text-center z-10 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
            The Story Continues
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Every artwork you've seen is a chapter in humanity's endless story. 
            From the first brushstroke of the Renaissance to the digital innovations of today, 
            art remains our most powerful way to connect across time.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">600+</div>
              <div className="text-gray-400">Years of Art History</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">30+</div>
              <div className="text-gray-400">Masterpieces Explored</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">∞</div>
              <div className="text-gray-400">Stories to Discover</div>
            </div>
          </div>

          <p className="text-sm text-gray-500 border-t border-gray-800 pt-8">
            Artworks sourced from The Metropolitan Museum of Art Collection
          </p>
        </motion.div>
      </div>
    </section>
  );
}