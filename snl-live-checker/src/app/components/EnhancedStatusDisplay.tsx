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
  season?: number;
  episode?: number;
  airDate?: Date;
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
              fontSize: { xs: '1rem', md: '1.5rem' },
              fontFamily: '"Orbitron", "Roboto Mono", monospace',
              minWidth: { xs: '40px', md: '50px' }
            }}
          >
            {String(unit.value).padStart(2, '0')}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: { xs: '0.5rem', md: '0.625rem' },
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
  className = "",
  season = 50,
  episode = 10,
  airDate
}) => {
  const [dayInfo, setDayInfo] = useState<DayDetectionResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize day info once
    const initialDayInfo = getDayDetectionInfo();
    setDayInfo(initialDayInfo);
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
      {/* Episode Date and Time Info with Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={2}
          sx={{
            background: isLive 
              ? 'linear-gradient(45deg, rgba(255, 0, 0, 0.1), rgba(255, 100, 100, 0.1))'
              : 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(103, 58, 183, 0.1))',
            border: isLive 
              ? '2px solid #ff0000'
              : '1px solid rgba(33, 150, 243, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            backdropFilter: 'blur(8px)',
            boxShadow: isLive ? '0 0 30px rgba(255, 0, 0, 0.3)' : 'none',
          }}
        >
          {/* Season and Episode Information */}
          <Box textAlign="center" mb={2}>
            <Typography
              variant="h6"
              className="neon-text-cyan"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
                mb: 1
              }}
              component="h2"
            >
              Season {season} • Episode {episode}
            </Typography>
            <Typography
              variant="h5"
              className={isLive ? "neon-text-red" : "neon-text-cyan"}
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
                mb: 1
              }}
            >
              {isLive ? "ON AIR NOW" : formatDate(airDate || dayInfo.upcomingSaturday)}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
              }}
            >
              {isLive ? "" : `${formatTime(airDate || dayInfo.upcomingSaturday)} • 90 minutes`}
            </Typography>
          </Box>

          {/* Countdown Timer - Always Show */}
          <Box textAlign="center">
            <Typography
              variant="h6"
              className="neon-text-blue"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '0.875rem', md: '1rem' },
                mb: 1,
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
              }}
            >
              {isLive ? "Time Remaining:" : "Countdown:"}
            </Typography>
            <Countdown
              key={`countdown-${dayInfo.upcomingSaturday.toDateString()}`}
              date={isLive ? new Date(dayInfo.upcomingSaturday.getTime() + 90 * 60 * 1000) : dayInfo.upcomingSaturday}
              renderer={(props) => <EnhancedCountdownRenderer {...props} dayInfo={dayInfo} />}
              intervalDelay={1000}
              precision={3}
            />
          </Box>
        </Paper>
      </motion.div>
    </div>
  );
};

export default EnhancedStatusDisplay; 