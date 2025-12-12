// resources/js/Components/Timeline/ArtworkCard.jsx

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function ArtworkCard({ artwork, index, isInView, onClick }) {
  const cardRef = useRef(null);
  
  // 3D Tilt Effect on Mouse Move
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Card Variants for Entry Animation
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
      className="group cursor-pointer perspective-1000"
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Image Container with Depth */}
        <div className="aspect-[3/4] overflow-hidden bg-gray-900 relative">
          {artwork.image ? (
            <>
              <motion.img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.2, filter: "blur(10px)" }}
                animate={{ scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8 }}
                whileHover={{ 
                  scale: 1.15,
                  transition: { duration: 0.6 }
                }}
              />
              
              {/* Shimmer Effect on Hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <p className="text-gray-500">No image available</p>
            </div>
          )}

          {/* Vignette Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </div>
        
        {/* Overlay Content with 3D Transform */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
                {artwork.title}
              </h3>
              
              {/* Artist with underline animation */}
              <motion.p 
                className="text-amber-300 text-lg font-medium relative inline-block"
                whileHover={{ scale: 1.05 }}
              >
                {artwork.artist}
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] bg-amber-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.p>
              
              {/* Year */}
              <p className="text-white/70 mt-2 text-sm">{artwork.year}</p>
              
              {/* Decorative Corner Elements */}
              <motion.div
                className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400"
                initial={{ scale: 0, rotate: -90 }}
                whileHover={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400"
                initial={{ scale: 0, rotate: -90 }}
                whileHover={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* View Details Badge with Pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          whileHover={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { duration: 0.3 }
          }}
          className="absolute top-4 right-4 z-10"
          style={{ transform: "translateZ(30px)" }}
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(251, 191, 36, 0.7)",
                "0 0 0 10px rgba(251, 191, 36, 0)",
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-400/50"
          >
            <span className="text-amber-400 text-sm font-semibold">View Details</span>
          </motion.div>
        </motion.div>

        {/* Border Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: "0 0 30px rgba(251, 191, 36, 0.5), inset 0 0 30px rgba(251, 191, 36, 0.1)"
          }}
        />
      </motion.div>
    </motion.div>
  );
}