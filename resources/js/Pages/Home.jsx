import React, { useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import Header from "../Components/Header";
import Hero from "../Components/Hero";
import Timeline from './Timeline';
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Show hero after loading completes
      setTimeout(() => setShowHero(true), 100);
    }, 3000); // 3 second intro

    return () => clearTimeout(timer);
  }, []);

  const scrollToTimeline = () => {
    const el = document.getElementById("timeline-start");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AppLayout>
      {/* Loading Intro Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
          >
            <div className="text-center">
              {/* Animated Logo */}
              <div className="relative w-40 h-40 mx-auto mb-12">
                {/* Outer rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-0 border-[3px] border-amber-500/20 border-t-amber-500 rounded-full"
                />
                
                {/* Middle rotating ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-6 border-[3px] border-orange-500/20 border-t-orange-500 rounded-full"
                />
                
                {/* Inner pulsing diamond */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 90, 0]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-lg transform rotate-45 shadow-2xl shadow-amber-500/50" />
                </motion.div>

                {/* Sparkle effects */}
                <motion.div
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    delay: 0.7
                  }}
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-400 rounded-full blur-sm"
                />
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Chronicles of Human Creativity
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-gray-400 text-xl mb-10"
              >
                Initializing your artistic journey...
              </motion.p>

              {/* Loading Progress Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="w-80 mx-auto"
              >
                <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ 
                      duration: 2.3, 
                      delay: 1.3,
                      ease: "easeInOut" 
                    }}
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 shadow-lg shadow-amber-500/50"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Only show after loading */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Header />
            <Hero onBegin={scrollToTimeline} />
            <Timeline />
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}