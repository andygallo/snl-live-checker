'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Box, Paper, Chip } from '@mui/material';
import { LiveTv, Tv, AccessTime, CalendarToday, Schedule } from '@mui/icons-material';
import { getDayDetectionInfo, getTimeUntilNextShowText, DayDetectionResult } from '../../utils/dayDetection';
import Countdown from 'react-countdown';

interface EnhancedStatusDisplayProps {
  isLive: boolean;
  className?: string;
}

interface CountdownRendererProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
  dayInfo: DayDetectionResult;
}

const EnhancedCountdownRenderer = ({ days, hours, minutes, seconds, completed, dayInfo }: CountdownRendererProps) => {
  if (completed) {
    return (
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          textShadow: [
            '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000',
            '0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000',
            '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000'
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Typography
          variant="h3"
          component="div"
          className="neon-text-red"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '3rem' },
            textAlign: 'center',
            fontFamily: '"Orbitron", "Roboto Mono", monospace',
          }}
          role="alert"
          aria-live="assertive"
        >
          🔴 LIVE NOW!
        </Typography>
      </motion.div>
    );
  }

  const timeString = `${days > 0 ? `${days} days, ` : ''}${hours} hours, ${minutes} minutes, ${seconds} seconds until ${dayInfo.isSaturday ? 'tonight\'s' : 'next'} SNL show`;

  const timeUnits = [
    { value: days, label: 'DAYS', show: days > 0 },
    { value: hours, label: 'HOURS', show: true },
    { value: minutes, label: 'MINUTES', show: true },
    { value: seconds, label: 'SECONDS', show: true }
  ].filter(unit => unit.show);

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      gap={{ xs: 1, md: 2 }}
      flexWrap="wrap"
      role="timer"
      aria-label={timeString}
      aria-live="polite"
    >
      {timeUnits.map((unit, index) => (
        <Box key={unit.label} textAlign="center">
          <Typography
            variant="h3"
            component="div"
            className="neon-text-yellow"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', md: '2.5rem' },
              fontFamily: '"Orbitron", "Roboto Mono", monospace',
              minWidth: { xs: '60px', md: '80px' }
            }}
          >
            {String(unit.value).padStart(2, '0')}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: { xs: '0.625rem', md: '0.75rem' },
              fontWeight: 'bold',
              fontFamily: '"Orbitron", "Roboto Mono", monospace',
            }}
          >
            {unit.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export const EnhancedStatusDisplay: React.FC<EnhancedStatusDisplayProps> = ({
  isLive,
  className = ""
}) => {
  const [dayInfo, setDayInfo] = useState<DayDetectionResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateDayInfo = () => {
      const newDayInfo = getDayDetectionInfo();
      setDayInfo(prevDayInfo => {
        // Only update if the day has actually changed to prevent unnecessary re-renders
        if (!prevDayInfo || 
            prevDayInfo.dayName !== newDayInfo.dayName || 
            prevDayInfo.upcomingSaturday.toDateString() !== newDayInfo.upcomingSaturday.toDateString()) {
          return newDayInfo;
        }
        return prevDayInfo;
      });
    };
    
    updateDayInfo();
    // Reduce update frequency to every 60 seconds instead of every second
    const interval = setInterval(updateDayInfo, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !dayInfo) {
    return (
      <Box className={className} textAlign="center">
        <Typography variant="h6" className="neon-text-cyan">
          Loading...
        </Typography>
      </Box>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <div className={className}>
      {/* Live Status */}
      {isLive ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              background: 'linear-gradient(45deg, rgba(255, 0, 0, 0.1), rgba(255, 100, 100, 0.1))',
              border: '2px solid #ff0000',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 30px rgba(255, 0, 0, 0.3)',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
              <LiveTv sx={{ color: '#ff0000', fontSize: 40 }} />
              <Typography
                variant="h3"
                className="neon-text-red"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                }}
                component="h2"
              >
                LIVE NOW!
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Saturday Night Live is on the air!
            </Typography>
          </Paper>
        </motion.div>
      ) : (
        /* Upcoming Show Status */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={2}
            sx={{
              background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(103, 58, 183, 0.1))',
              border: '1px solid rgba(33, 150, 243, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Primary Message */}
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h4"
                className="neon-text-cyan"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                  mb: 1
                }}
                component="h2"
              >
                {dayInfo.messaging.primary}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                }}
              >
                {dayInfo.messaging.secondary}
              </Typography>
            </Box>



            {/* Countdown Timer */}
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h6"
                className="neon-text-blue"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  mb: 2,
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                }}
              >
                {dayInfo.messaging.countdownLabel}:
              </Typography>
              <Countdown
                key={`countdown-${dayInfo.upcomingSaturday.toDateString()}`}
                date={dayInfo.upcomingSaturday}
                renderer={(props) => <EnhancedCountdownRenderer {...props} dayInfo={dayInfo} />}
                intervalDelay={1000}
                precision={0}
              />
            </Box>


          </Paper>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedStatusDisplay; 