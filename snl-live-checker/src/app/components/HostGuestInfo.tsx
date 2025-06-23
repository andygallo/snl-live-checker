'use client';

import { motion } from 'framer-motion';

interface HostGuestInfoProps {
  isLive: boolean;
  host?: string;
  musicalGuest?: string;
}

export default function HostGuestInfo({ 
  isLive, 
  host = "Timothée Chalamet", 
  musicalGuest = "Boygenius" 
}: HostGuestInfoProps) {
  return (
    <>
      {/* Host Info */}
      <motion.div
        className="text-center mb-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="retro-card">
          <div className="neon-text-cyan text-xl md:text-2xl mb-2">
            TONIGHT&apos;S HOST
          </div>
          <div className="text-white text-lg md:text-xl">
            {isLive ? host : "Classic Episode"}
          </div>
        </div>
      </motion.div>

      {/* Musical Guest */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.3, duration: 0.8 }}
      >
        <div className="retro-card">
          <div className="neon-text-cyan text-xl md:text-2xl mb-2">
            MUSICAL GUEST
          </div>
          <div className="text-white text-lg md:text-xl">
            {isLive ? musicalGuest : "Classic Performance"}
          </div>
        </div>
      </motion.div>
    </>
  );
} 