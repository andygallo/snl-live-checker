'use client';

import { motion } from 'framer-motion';

export default function SNLLogo() {
  return (
    <motion.div
      className="text-center mb-8"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <h1 className="neon-text-pink text-4xl md:text-6xl font-bold mb-2">
        SATURDAY NIGHT
      </h1>
      <h1 className="neon-text-pink text-4xl md:text-6xl font-bold">
        LIVE
      </h1>
    </motion.div>
  );
} 