'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LiveStatusDisplay, 
  HostGuestInfo, 
  TestModeToggle, 
  RetroBackground, 
  SNLLogo,
  LoadingSkeleton 
} from './components';
import { useSNLData, useScheduleData } from '../hooks/useSNLData';
import { useSNLContext } from '../context/SNLContext';

export default function Home() {
  const [isTestMode, setIsTestMode] = useState(false);
  const [, setCurrentTime] = useState(new Date());
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

  // Determine live status - use real data if available, fallback to time-based detection
  const isLiveFromData = state.snlData?.isLive ?? null;
  const isLiveFromTime = isCurrentlyLive();
  const isLive = isTestMode || isLiveFromData ?? isLiveFromTime;
  
  // Get host and musical guest from real data or fallback
  const currentHost = state.host?.name || state.snlData?.host?.name || "Timothée Chalamet";
  const currentMusicalGuest = state.musicalGuest?.name || state.snlData?.musicalGuest?.name || "Boygenius";

  // Update context with fetched data
  useEffect(() => {
    if (snlData) {
      setSNLData(snlData);
    }
    if (scheduleData) {
      setSchedule(scheduleData);
    }
  }, [snlData, scheduleData, setSNLData, setSchedule]);

  // Handle loading states
  useEffect(() => {
    setLoading(snlLoading || scheduleLoading);
  }, [snlLoading, scheduleLoading, setLoading]);

  // Handle errors
  useEffect(() => {
    if (snlError) {
      setError(`SNL Data Error: ${snlError.message}`);
    } else if (scheduleError) {
      setError(`Schedule Error: ${scheduleError.message}`);
    } else {
      setError(null);
    }
  }, [snlError, scheduleError, setError]);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  return (
    <div className="retro-container">
      <RetroBackground />
      
      <TestModeToggle 
        isTestMode={isTestMode} 
        onToggle={setIsTestMode} 
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* Art Deco Frame */}
        <motion.div 
          className="art-deco-frame"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          
          <SNLLogo />
          
          <LiveStatusDisplay 
            isLive={isLive} 
            nextSNLDate={nextSNLDate} 
          />

          <HostGuestInfo 
            isLive={isLive}
            host="Timothée Chalamet"
            musicalGuest="Boygenius"
          />

        </motion.div>
      </div>
    </div>
  );
}
