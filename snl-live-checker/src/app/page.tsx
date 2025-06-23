'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import { Box, Switch, FormControlLabel } from '@mui/material';

// Retro countdown renderer
const CountdownRenderer = ({ hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return (
      <motion.div
        className="neon-text-yellow text-6xl md:text-8xl font-bold"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        LIVE NOW!
      </motion.div>
    );
  } else {
    return (
      <div className="neon-text-yellow text-5xl md:text-7xl font-bold font-mono">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    );
  }
};

export default function Home() {
  const [isTestMode, setIsTestMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Get next Saturday 11:30 PM ET
  const getNextSNLDate = () => {
    const now = new Date();
    const nextSaturday = new Date(now);
    
    // Calculate days until next Saturday (6 = Saturday)
    const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
    nextSaturday.setDate(now.getDate() + daysUntilSaturday);
    nextSaturday.setHours(23, 30, 0, 0); // 11:30 PM ET
    
    // If it's Saturday but past 11:30 PM, get next Saturday
    if (now.getDay() === 6 && now.getHours() >= 23 && now.getMinutes() >= 30) {
      nextSaturday.setDate(nextSaturday.getDate() + 7);
    }
    
    // If calculated date is in the past, add 7 days
    if (nextSaturday <= now) {
      nextSaturday.setDate(nextSaturday.getDate() + 7);
    }
    
    return nextSaturday;
  };

  const nextSNLDate = getNextSNLDate();
  
  // Check if SNL is currently live (Saturday 11:30 PM - 1:00 AM ET)
  const isCurrentlyLive = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Saturday 11:30 PM - 11:59 PM
    if (day === 6 && hour === 23 && minute >= 30) return true;
    
    // Sunday 12:00 AM - 1:00 AM (technically still Saturday's show)
    if (day === 0 && hour === 0) return true;
    
    return false;
  };

  const isLive = isTestMode || isCurrentlyLive();

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Prevent hydration mismatch by not rendering countdown until mounted
  if (!mounted) {
    return (
      <div className="retro-container">
        <div className="retro-bg"></div>
        <div className="city-skyline"></div>
        <div className="palm-left"></div>
        <div className="palm-right"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="art-deco-frame">
            <div className="text-center">
              <div className="neon-text-pink text-4xl md:text-6xl font-bold mb-8">
                Loading...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-container">
      {/* Background */}
      <div className="retro-bg"></div>
      
      {/* City skyline silhouette */}
      <div className="city-skyline"></div>
      
      {/* Palm trees */}
      <div className="palm-left"></div>
      <div className="palm-right"></div>

      {/* Test Mode Toggle */}
      <Box className="absolute top-4 right-4 z-50">
        <FormControlLabel
          control={
            <Switch
              checked={isTestMode}
              onChange={(e) => setIsTestMode(e.target.checked)}
              sx={{
                '& .MuiSwitch-thumb': {
                  backgroundColor: '#ff0080',
                },
                '& .MuiSwitch-track': {
                  backgroundColor: '#333',
                },
              }}
            />
          }
          label={
            <span className="text-white font-bold">
              TEST: {isTestMode ? 'LIVE' : 'RERUN'}
            </span>
          }
        />
      </Box>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* Art Deco Frame */}
        <motion.div 
          className="art-deco-frame"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          
          {/* SNL Logo */}
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

          {/* Status */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {isLive ? (
              <div className="neon-text-green text-3xl md:text-4xl font-bold">
                🔴 LIVE TONIGHT
              </div>
            ) : (
              <div className="neon-text-orange text-3xl md:text-4xl font-bold">
                📺 RERUN TONIGHT
              </div>
            )}
          </motion.div>

          {/* Countdown */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            {!isLive && (
              <>
                <div className="neon-text-blue text-xl md:text-2xl mb-4">
                  NEXT LIVE SHOW IN:
                </div>
                <div className="countdown-wrapper">
                  <Countdown
                    key={nextSNLDate.getTime()} // Force re-render when date changes
                    date={nextSNLDate}
                    renderer={CountdownRenderer}
                    intervalDelay={1000}
                    precision={3}
                  />
                </div>
                <div className="text-white text-sm mt-2">
                  Next show: {nextSNLDate.toLocaleDateString()} at 11:30 PM ET
                </div>
              </>
            )}
            
            {isLive && (
              <motion.div
                className="neon-text-yellow text-3xl md:text-5xl font-bold"
                animate={{ 
                  textShadow: [
                    '0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00',
                    '0 0 20px #ffff00, 0 0 30px #ffff00, 0 0 40px #ffff00',
                    '0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ON AIR NOW!
              </motion.div>
            )}
          </motion.div>

          {/* Host Info */}
          <motion.div
            className="text-center mb-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <div className="retro-card">
              <div className="neon-text-cyan text-xl md:text-2xl mb-2">
                TONIGHT'S HOST
              </div>
              <div className="text-white text-lg md:text-xl">
                {isLive ? "Timothée Chalamet" : "Classic Episode"}
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
                {isLive ? "Boygenius" : "Classic Performance"}
              </div>
            </div>
          </motion.div>

          {/* Action Message */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.8 }}
          >
            {isLive ? (
              <div className="neon-text-green text-lg md:text-xl">
                🏠 STAY IN & WATCH THE MAGIC!
              </div>
            ) : (
              <div className="neon-text-orange text-lg md:text-xl">
                🌃 GO OUT & LIVE YOUR LIFE!
              </div>
            )}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
