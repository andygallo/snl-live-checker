'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import { 
  LiveStatusDisplay, 
  HostGuestInfo, 
  TestModeToggle, 
  RetroBackground, 
  SNLLogo,
  LoadingSkeleton
} from './components';
import { EnhancedStatusDisplay } from './components/EnhancedStatusDisplay';
import { useSNLData, useScheduleData } from '../hooks/useSNLData';
import { useSNLContext } from '../context/SNLContext';
import { getNextLiveShow, getCurrentShow, isCurrentlyLive as checkIsLive } from '../utils/scheduleUtils';

export default function Home() {
  const [isTestMode, setIsTestMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Real-time data fetching
  const { data: snlData, error: snlError, isLoading: snlLoading, mutate: mutateSNL } = useSNLData();
  const { data: scheduleData, error: scheduleError, isLoading: scheduleLoading } = useScheduleData();
  const { state, setSNLData, setSchedule, setError, setLoading } = useSNLContext();

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

  // Enhanced schedule-based logic
  const currentShow = getCurrentShow(state.schedule);
  const nextShow = getNextLiveShow(state.schedule);
  
  // Determine live status - use enhanced schedule data
  const isLiveFromSchedule = currentShow?.isLive ?? null;
  const isLiveFromData = state.snlData?.isLive ?? null;
  const isLiveFromTime = checkIsLive();
  const isLive = isTestMode || (isLiveFromSchedule ?? isLiveFromData ?? isLiveFromTime);
  
  // Determine if there's a new episode this week
  const hasNewEpisodeThisWeek = () => {
    // For now, assume there's always a new episode unless it's a known break period
    // TODO: This should be enhanced with actual episode schedule data
    const now = new Date();
    const month = now.getMonth(); // 0-11
    
    // Typical SNL break periods (rough approximation)
    const isInBreakPeriod = (
      (month >= 5 && month <= 8) || // June-September (summer break)
      (month === 11 && now.getDate() > 20) || // Late December (holiday break)
      (month === 0 && now.getDate() < 15) // Early January (holiday break)
    );
    
    return !isInBreakPeriod;
  };
  
  const isNewEpisode = hasNewEpisodeThisWeek();
  
  // Get host and musical guest from enhanced schedule or fallback data
  const currentHost = currentShow?.host || nextShow?.host || state.host?.name || state.snlData?.host?.name || "Timothée Chalamet";
  const currentMusicalGuest = currentShow?.musicalGuest || nextShow?.musicalGuest || state.musicalGuest?.name || state.snlData?.musicalGuest?.name || "Boygenius";
  
  // Use next show date from schedule if available
  const enhancedNextSNLDate = nextShow?.date || nextSNLDate;

  // Update context with fetched data (optimized to prevent unnecessary updates)
  useEffect(() => {
    if (snlData && snlData !== state.snlData) {
      setSNLData(snlData);
    }
  }, [snlData, setSNLData, state.snlData]);

  useEffect(() => {
    if (scheduleData && scheduleData !== state.schedule) {
      setSchedule(scheduleData);
    }
  }, [scheduleData, setSchedule, state.schedule]);

  // Handle loading states (debounced)
  useEffect(() => {
    const currentLoading = snlLoading || scheduleLoading;
    if (currentLoading !== state.isLoading) {
      setLoading(currentLoading);
    }
  }, [snlLoading, scheduleLoading, setLoading, state.isLoading]);

  // Handle errors (optimized)
  useEffect(() => {
    let errorMessage = null;
    if (snlError) {
      errorMessage = `SNL Data Error: ${snlError.message}`;
    } else if (scheduleError) {
      errorMessage = `Schedule Error: ${scheduleError.message}`;
    }
    
    if (errorMessage !== state.error) {
      setError(errorMessage);
    }
  }, [snlError, scheduleError, setError, state.error]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering countdown until mounted
  if (!mounted) {
    return (
      <div className="retro-container">
        <RetroBackground />
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

  // Show loading skeleton while data is being fetched for the first time
  if (state.isLoading && !state.snlData && !isTestMode) {
    return (
      <div className="retro-container">
        <RetroBackground />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="retro-container">
      <RetroBackground />
      
      <TestModeToggle 
        isTestMode={isTestMode} 
        onToggle={setIsTestMode} 
      />

      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        tabIndex={0}
      >
        Skip to main content
      </a>

      {/* Main Content */}
      <main 
        id="main-content"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        role="main"
        aria-label="SNL Live Status Information"
      >
        
        {/* Art Deco Frame */}
        <motion.div 
          className="art-deco-frame"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4"
          >
            <Typography
              variant="h2"
              component="h1"
              className="neon-text-pink"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
                textAlign: 'center',
                mb: 2,
                lineHeight: 1.2
              }}
            >
              Is Saturday Night<br />Live this week?
            </Typography>
            
            {/* Big YES/NO Answer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-4"
            >
               <Typography
                 variant="h1"
                 component="div"
                 className={isLive ? "neon-text-red" : isNewEpisode ? "neon-text-green" : "neon-text-orange"}
                 sx={{
                   fontWeight: 'bold',
                   fontSize: { xs: '2.5rem', md: '3.5rem' },
                   fontFamily: '"Orbitron", "Roboto Mono", monospace',
                   textAlign: 'center',
                   textShadow: isLive 
                     ? '0 0 20px #ff0000, 0 0 40px #ff0000' 
                     : isNewEpisode 
                       ? '0 0 20px #00ff00, 0 0 40px #00ff00'
                       : '0 0 20px #ff8800, 0 0 40px #ff8800',
                   mb: 1
                 }}
                 role="alert"
                 aria-live="assertive"
               >
                 {isLive ? "YES!" : isNewEpisode ? "YES!" : "NOPE!"}
               </Typography>
            </motion.div>
          </motion.div>

          {(isNewEpisode || isLive) && (
            <HostGuestInfo 
              isLive={isLive}
              isNewEpisode={isNewEpisode}
              host={currentHost}
              musicalGuest={currentMusicalGuest}
            />
          )}
          
          {(isNewEpisode || isLive) && (
            <EnhancedStatusDisplay 
              isLive={isLive} 
            />
          )}

        </motion.div>

      </main>
    </div>
  );
}
