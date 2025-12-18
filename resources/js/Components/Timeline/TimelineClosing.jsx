import React from 'react';
import { motion } from 'framer-motion';

export default function TimelineClosing() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-bold mb-8"
        >
          <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-purple-300 bg-clip-text text-transparent">
            The Canvas Continues
          </span>
        </motion.h2>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 1.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-8 max-w-2xl mx-auto"
        />

        {/* Main Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-gray-300 text-xl md:text-2xl leading-relaxed mb-6 max-w-3xl mx-auto"
        >
          This timeline is only a glimpse—moments carefully chosen to show how art evolves, 
          responds, and speaks across time. Each artwork you encountered reflects not just an era, 
          but a way of thinking, feeling, and seeing the world.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
          className="text-gray-400 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto"
        >
          Art does not end at a screen or a scroll. It continues in museums, classrooms, books, 
          conversations, and personal reflection—where meaning grows deeper with every return.
        </motion.p>

        {/* Closing Line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-amber-300 text-2xl md:text-3xl font-light italic">
            The story continues wherever you choose to look.
          </p>
        </motion.div>

        {/* Bottom Divider */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 1.5, delay: 1.4 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent max-w-xl mx-auto mb-12"
        />

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 backdrop-blur-sm transition-all"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Return to Beginning
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.9 }}
          viewport={{ once: true }}
          className="text-gray-600 text-sm mt-16"
        >
          Art history has no final page—only perspectives waiting to be revisited.
        </motion.p>
      </motion.div>

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    </section>
  );
}
