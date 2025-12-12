// resources/js/components/ThreeBackground.jsx

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef();
  const initialAnimationComplete = useRef(false);
  const scrollY = useRef(0);
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
      
      // Calculate zoom based on scroll position
      // Increase scale as user scrolls down
      const maxScroll = window.innerHeight; // Zoom effect within first viewport
      const scrollProgress = Math.min(scrollY.current / maxScroll, 1);
      
      // Scale from 1 to 2.5 as user scrolls
      targetScale.current = 1 + (scrollProgress * 1.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const elapsedTime = state.clock.getElapsedTime();

    // Initial animation: zoom in from 0 to 1 over 3 seconds
    if (!initialAnimationComplete.current) {
      const progress = Math.min(elapsedTime / 3, 1);
      const scale = progress;
      
      meshRef.current.scale.set(scale, scale, scale);
      
      if (progress >= 1) {
        initialAnimationComplete.current = true;
        currentScale.current = 1;
      }
    } else {
      // After initial animation, respond to scroll
      // Smoothly interpolate current scale to target scale
      currentScale.current += (targetScale.current - currentScale.current) * delta * 3;
      
      meshRef.current.scale.set(
        currentScale.current,
        currentScale.current,
        currentScale.current
      );
    }

    // Continuous rotation
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;

    // Floating animation
    meshRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#fbbf24"
        wireframe
        emissive="#f59e0b"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const particlesRef = useRef();
  const scrollY = useRef(0);
  const targetSpread = useRef(3);
  const currentSpread = useRef(3);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
      
      // Particles spread out as user scrolls
      const maxScroll = window.innerHeight;
      const scrollProgress = Math.min(scrollY.current / maxScroll, 1);
      
      // Spread from 3 to 6 as user scrolls
      targetSpread.current = 3 + (scrollProgress * 3);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    // Smooth spread interpolation
    currentSpread.current += (targetSpread.current - currentSpread.current) * delta * 2;

    // Rotate particles
    particlesRef.current.rotation.y += delta * 0.05;
    particlesRef.current.rotation.x += delta * 0.02;

    // Update particle positions based on spread
    const positions = particlesRef.current.geometry.attributes.position.array;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Normalize and apply spread
      const length = Math.sqrt(x * x + y * y + z * z);
      if (length > 0) {
        positions[i3] = (x / length) * currentSpread.current;
        positions[i3 + 1] = (y / length) * currentSpread.current;
        positions[i3 + 2] = (z / length) * currentSpread.current;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Generate particle positions
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#fbbf24"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function ScrollResponsiveCamera() {
  const scrollY = useRef(0);
  const targetZ = useRef(5);
  const currentZ = useRef(5);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
      
      // Move camera position based on scroll
      const maxScroll = window.innerHeight;
      const scrollProgress = Math.min(scrollY.current / maxScroll, 1);
      
      // Camera moves closer as user scrolls (z from 5 to 3)
      targetZ.current = 5 - (scrollProgress * 2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    // Smooth camera movement
    currentZ.current += (targetZ.current - currentZ.current) * delta * 3;
    state.camera.position.z = currentZ.current;
  });

  return null;
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#fbbf24" />

        {/* Animated Components */}
        <AnimatedSphere />
        <FloatingParticles />
        
        {/* Background Stars */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Scroll-Responsive Camera */}
        <ScrollResponsiveCamera />
      </Canvas>
    </div>
  );
}