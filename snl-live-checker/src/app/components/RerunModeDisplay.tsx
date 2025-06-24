'use client';

import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { CalendarToday, Person, MusicNote } from '@mui/icons-material';

interface RerunModeDisplayProps {
  nextEpisodeDate: Date;
  nextHost?: string;
  nextMusicalGuest?: string;
  season?: number;
  episode?: number;
}

// Array of funny SNL-related quotes about reruns/waiting
const SNL_RERUN_QUOTES = [
  "\"Live from New York, it's... a rerun night!\" 📺",
  "\"More cowbell? Not tonight, but soon!\" 🔔",
  "\"Weekend Update will return... next week!\" 📰",
  "\"The show must go on... next Saturday!\" 🎭",
  "\"It's not ready for prime time... yet!\" ⏰",
  "\"Church Lady says: 'Isn't that special... that you have to wait!'\" 👵",
  "\"Wayne's World says: 'Party on... next week!'\" 🎸",
  "\"Stefon says: 'New York's hottest show... airs next Saturday!'\" 🌟",
  "\"Matt Foley says: 'You'll be watching... IN A VAN DOWN BY THE RIVER... next week!'\" 🚐",
  "\"Stuart Smalley says: 'You're good enough to wait for next week!'\" 💝"
];

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

export const RerunModeDisplay: React.FC<RerunModeDisplayProps> = ({
  nextEpisodeDate,
  nextHost = "TBA",
  nextMusicalGuest = "TBA",
  season = 50,
  episode = 11
}) => {
  // Get a random quote
  const randomQuote = SNL_RERUN_QUOTES[Math.floor(Math.random() * SNL_RERUN_QUOTES.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Funny Quote Section */}
      <Paper
        elevation={3}
        sx={{
          background: 'linear-gradient(45deg, rgba(255, 136, 0, 0.1), rgba(255, 193, 7, 0.1))',
          border: '1px solid rgba(255, 136, 0, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          backdropFilter: 'blur(8px)',
          mb: 3,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h6"
          className="neon-text-orange"
          sx={{
            fontFamily: '"Orbitron", "Roboto Mono", monospace',
            fontWeight: 'bold',
            fontSize: { xs: '0.875rem', md: '1rem' },
            mb: 2
          }}
        >
          🎭 SNL WISDOM 🎭
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontStyle: 'italic',
            lineHeight: 1.4,
            fontFamily: '"Roboto", sans-serif'
          }}
        >
          {randomQuote}
        </Typography>
      </Paper>

      {/* Next Episode Info */}
      <Paper
        elevation={3}
        sx={{
          background: 'linear-gradient(45deg, rgba(0, 188, 212, 0.1), rgba(0, 150, 136, 0.1))',
          border: '1px solid rgba(0, 188, 212, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h5"
            className="neon-text-cyan"
            sx={{
              fontFamily: '"Orbitron", "Roboto Mono", monospace',
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              mb: 1
            }}
          >
            🗓️ NEXT NEW EPISODE
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontFamily: '"Orbitron", "Roboto Mono", monospace',
            }}
          >
            Season {season} • Episode {episode}
          </Typography>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(0, 188, 212, 0.3)', mb: 3 }} />

        {/* Date and Time */}
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <CalendarToday 
            sx={{ 
              color: '#00bcd4', 
              mr: 2,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }} 
          />
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
              }}
            >
              {formatDate(nextEpisodeDate)}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                fontFamily: '"Orbitron", "Roboto Mono", monospace',
              }}
            >
              {formatTime(nextEpisodeDate)}
            </Typography>
          </Box>
        </Box>

        {/* Host and Musical Guest */}
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={2}
          justifyContent="center"
        >
          {/* Host */}
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            sx={{
              background: 'rgba(0, 188, 212, 0.1)',
              border: '1px solid rgba(0, 188, 212, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              minWidth: { xs: 'auto', md: '200px' }
            }}
          >
            <Person sx={{ color: '#00bcd4', mr: 1.5, fontSize: '1.25rem' }} />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.75rem',
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                  display: 'block'
                }}
              >
                HOST
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  fontWeight: 'medium',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                }}
              >
                {nextHost}
              </Typography>
            </Box>
          </Box>

          {/* Musical Guest */}
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            sx={{
              background: 'rgba(156, 39, 176, 0.1)',
              border: '1px solid rgba(156, 39, 176, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              minWidth: { xs: 'auto', md: '200px' }
            }}
          >
            <MusicNote sx={{ color: '#9c27b0', mr: 1.5, fontSize: '1.25rem' }} />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.75rem',
                  fontFamily: '"Orbitron", "Roboto Mono", monospace',
                  display: 'block'
                }}
              >
                MUSICAL GUEST
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  fontWeight: 'medium',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                }}
              >
                {nextMusicalGuest}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}; 