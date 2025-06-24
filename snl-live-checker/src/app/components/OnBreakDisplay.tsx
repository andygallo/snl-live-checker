'use client';

import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { WbSunny, AcUnit, Event, Update } from '@mui/icons-material';

interface OnBreakDisplayProps {
  breakType?: 'summer' | 'winter' | 'spring';
  returnDate?: Date;
  className?: string;
}

// Different break messages based on season
const BREAK_MESSAGES = {
  summer: {
    title: "SNL is on Summer Break! ☀️",
    subtitle: "The cast is recharging for another hilarious season",
    quote: "\"Even comedy legends need a vacation!\" 🏖️",
    icon: <WbSunny sx={{ fontSize: '2rem', color: '#ff8800' }} />,
    color: '#ff8800',
    bgGradient: 'linear-gradient(45deg, rgba(255, 136, 0, 0.1), rgba(255, 193, 7, 0.1))'
  },
  winter: {
    title: "SNL is on Holiday Break! ❄️",
    subtitle: "Happy holidays from the SNL family",
    quote: "\"'Twas the night before SNL... well, not tonight!\" 🎄",
    icon: <AcUnit sx={{ fontSize: '2rem', color: '#00bcd4' }} />,
    color: '#00bcd4',
    bgGradient: 'linear-gradient(45deg, rgba(0, 188, 212, 0.1), rgba(79, 172, 254, 0.1))'
  },
  spring: {
    title: "SNL Spring Hiatus 🌸",
    subtitle: "Taking a short break before the season finale",
    quote: "\"Spring cleaning includes comedy breaks!\" 🌱",
    icon: <Event sx={{ fontSize: '2rem', color: '#4caf50' }} />,
    color: '#4caf50',
    bgGradient: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))'
  }
};

// Determine break type based on current date
const getCurrentBreakType = (): 'summer' | 'winter' | 'spring' => {
  const month = new Date().getMonth(); // 0-11
  
  if (month >= 5 && month <= 8) return 'summer'; // June-September
  if (month === 11 || month === 0) return 'winter'; // December-January
  return 'spring'; // February-May, October-November
};

// Generate return date based on break type
const getEstimatedReturnDate = (breakType: 'summer' | 'winter' | 'spring'): Date => {
  const now = new Date();
  const year = now.getFullYear();
  
  switch (breakType) {
    case 'summer':
      // Return late September/early October
      return new Date(year, 8, 28); // September 28th
    case 'winter':
      // Return mid-January
      return new Date(year + (now.getMonth() === 11 ? 1 : 0), 0, 15); // January 15th
    case 'spring':
      // Return in 2-3 weeks
      const returnDate = new Date(now);
      returnDate.setDate(returnDate.getDate() + 21);
      return returnDate;
  }
};

export const OnBreakDisplay: React.FC<OnBreakDisplayProps> = ({
  breakType = getCurrentBreakType(),
  returnDate = getEstimatedReturnDate(breakType),
  className = ""
}) => {
  const breakConfig = BREAK_MESSAGES[breakType];
  
  // Format return date
  const formatReturnDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days until return
  const daysUntilReturn = Math.ceil((returnDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      className={`w-full max-w-4xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Main Break Message */}
      <Box textAlign="center" mb={4}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {breakConfig.icon}
        </motion.div>
        
        <Typography
          variant="h2"
          className="neon-text-yellow"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '3rem' },
            fontFamily: '"Orbitron", "Roboto Mono", monospace',
            mb: 2,
            mt: 2
          }}
          component="h1"
        >
          {breakConfig.title}
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: { xs: '1rem', md: '1.25rem' },
            fontFamily: '"Orbitron", "Roboto Mono", monospace',
            mb: 3
          }}
          component="h2"
        >
          {breakConfig.subtitle}
        </Typography>
      </Box>

      {/* Break Info Card */}
      <Paper
        className="retro-card"
        elevation={3}
        sx={{
          background: breakConfig.bgGradient,
          border: `2px solid ${breakConfig.color}`,
          borderRadius: '20px',
          padding: { xs: '20px', md: '30px' },
          backdropFilter: 'blur(10px)',
          boxShadow: `0 0 30px ${breakConfig.color}30`,
          mb: 4
        }}
      >
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Quote */}
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{
                color: breakConfig.color,
                fontStyle: 'italic',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
                textShadow: `0 0 10px ${breakConfig.color}50`
              }}
            >
              {breakConfig.quote}
            </Typography>
          </Box>

          {/* Return Information */}
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', md: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            gap={2}
          >
            <Box textAlign={{ xs: 'center', md: 'left' }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                  mb: 1
                }}
              >
                📅 Expected Return:
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                }}
              >
                {formatReturnDate(returnDate)}
              </Typography>
            </Box>

            <Box textAlign={{ xs: 'center', md: 'right' }}>
              <Chip
                icon={<Update />}
                label={`${daysUntilReturn} days to go`}
                sx={{
                  backgroundColor: `${breakConfig.color}20`,
                  color: breakConfig.color,
                  border: `1px solid ${breakConfig.color}`,
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  padding: '10px'
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* What to Do While Waiting */}
      <Paper
        className="retro-card"
        elevation={2}
        sx={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '15px',
          padding: { xs: '15px', md: '20px' },
          backdropFilter: 'blur(5px)'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontFamily: '"Orbitron", "Roboto Mono", monospace',
            mb: 2,
            textAlign: 'center'
          }}
        >
          💡 While You Wait...
        </Typography>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="center">
          <Chip
            label="📺 Watch Classic Episodes"
            variant="outlined"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { borderColor: '#00ffff', color: '#00ffff' }
            }}
          />
          <Chip
            label="🎭 Follow Cast on Social"
            variant="outlined"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { borderColor: '#ff6b9d', color: '#ff6b9d' }
            }}
          />
          <Chip
            label="📚 Read SNL History"
            variant="outlined"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { borderColor: '#ffd700', color: '#ffd700' }
            }}
          />
        </Box>
      </Paper>
    </motion.div>
  );
}; 