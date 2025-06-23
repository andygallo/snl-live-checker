'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import { Typography, Box, Paper, Chip } from '@mui/material';
import { AccessTime, CalendarToday, Schedule } from '@mui/icons-material';

interface EnhancedCountdownProps {
  targetDate: Date;
  showTitle?: string;
  host?: string;
  musicalGuest?: string;
  isLive?: boolean;
  className?: string;
}

interface CountdownRendererProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const EnhancedCountdownRenderer = ({ days, hours, minutes, seconds, completed }: CountdownRendererProps) => {
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

  const timeString = `${days > 0 ? `${days} days, ` : ''}${hours} hours, ${minutes} minutes, ${seconds} seconds until next SNL show`;

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
      gap={{ xs: 1, sm: 2, md: 4 }}
      flexWrap="wrap"
      role="timer"
      aria-label={timeString}
      aria-live="polite"
    >
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Box textAlign="center" minWidth={{ xs: 60, md: 80 }}>
            <motion.div
              animate={{ 
                scale: unit.label === 'SECONDS' ? [1, 1.1, 1] : 1,
              }}
              transition={{ 
                duration: 1, 
                repeat: unit.label === 'SECONDS' ? Infinity : 0 
              }}
            >
              <Typography
                variant="h3"
                component="div"
                className="neon-text-cyan"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                  textShadow: '0 0 10px rgba(34, 211, 238, 0.8)',
                  background: 'linear-gradient(45deg, #00ffff, #0080ff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {String(unit.value).padStart(2, '0')}
              </Typography>
            </motion.div>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(34, 211, 238, 0.9)',
                fontSize: { xs: '0.6rem', sm: '0.75rem', md: '0.875rem' },
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
              }}
            >
              {unit.label}
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

export const EnhancedCountdown: React.FC<EnhancedCountdownProps> = ({
  targetDate,
  showTitle = "Next SNL Show",
  host,
  musicalGuest,
  isLive = false,
  className = ""
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box className={className} textAlign="center">
        <Typography variant="h6" className="neon-text-cyan">
          Loading countdown...
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
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      role="region"
      aria-label="Countdown to next SNL show"
    >
      <Paper
        elevation={8}
        sx={{
          background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(0, 128, 255, 0.1) 50%, rgba(147, 51, 234, 0.1) 100%)',
          border: '2px solid rgba(34, 211, 238, 0.3)',
          borderRadius: '20px',
          padding: { xs: 3, md: 4 },
          backdropFilter: 'blur(16px)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(34, 211, 238, 0.1) 50%, transparent 70%)',
            animation: 'shimmer 3s ease-in-out infinite',
          },
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={3}>
          <AccessTime sx={{ color: '#00ffff', fontSize: 32 }} />
          <Typography
            variant="h5"
            className="neon-text-cyan"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              textAlign: 'center',
              fontFamily: '"Orbitron", "Roboto Mono", monospace',
            }}
            component="h3"
          >
            {showTitle.toUpperCase()}
          </Typography>
        </Box>

        {/* Countdown Display */}
        <Box mb={4}>
          <Countdown
            key={targetDate.getTime()}
            date={targetDate}
            renderer={EnhancedCountdownRenderer}
            intervalDelay={100}
            precision={3}
          />
        </Box>

        {/* Show Details */}
        <Box textAlign="center" mb={3}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
            <CalendarToday sx={{ color: '#00ffff', fontSize: 20 }} />
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
              }}
            >
              {formatDate(targetDate)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
            <Schedule sx={{ color: '#00ffff', fontSize: 20 }} />
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
              }}
            >
              {formatTime(targetDate)}
            </Typography>
          </Box>
        </Box>

        {/* Host and Musical Guest */}
        {(host || musicalGuest) && (
          <Box display="flex" flexDirection="column" gap={1} alignItems="center">
            {host && (
              <Chip
                label={`Host: ${host}`}
                sx={{
                  background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(0, 128, 255, 0.2))',
                  color: '#00ffff',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                }}
              />
            )}
            {musicalGuest && (
              <Chip
                label={`Musical Guest: ${musicalGuest}`}
                sx={{
                  background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(168, 85, 247, 0.2))',
                  color: '#a855f7',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                }}
              />
            )}
          </Box>
        )}
      </Paper>
    </motion.div>
  );
}; 