'use client';

import { motion } from 'framer-motion';
import { Typography, Paper, Box, Avatar } from '@mui/material';
import { Person, MusicNote } from '@mui/icons-material';

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
        <Paper
          className="retro-card"
          elevation={3}
          sx={{
            background: 'linear-gradient(45deg, rgba(0, 188, 212, 0.1), rgba(0, 150, 136, 0.1))',
            border: '1px solid rgba(0, 188, 212, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
            <Avatar sx={{ bgcolor: '#00bcd4', width: 40, height: 40 }}>
              <Person />
            </Avatar>
            <Typography
              variant="h5"
              component="h3"
              className="neon-text-cyan"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textAlign: 'center',
              }}
            >
              TONIGHT&apos;S HOST
            </Typography>
          </Box>
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: 'white',
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              textAlign: 'center',
              fontWeight: 'medium',
            }}
            aria-label={`Tonight's host is ${isLive ? host : "Classic Episode"}`}
          >
            {isLive ? host : "Classic Episode"}
          </Typography>
        </Paper>
      </motion.div>

      {/* Musical Guest */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.3, duration: 0.8 }}
      >
        <Paper
          className="retro-card"
          elevation={3}
          sx={{
            background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.1), rgba(233, 30, 99, 0.1))',
            border: '1px solid rgba(156, 39, 176, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
            <Avatar sx={{ bgcolor: '#9c27b0', width: 40, height: 40 }}>
              <MusicNote />
            </Avatar>
            <Typography
              variant="h5"
              component="h3"
              className="neon-text-cyan"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textAlign: 'center',
              }}
            >
              MUSICAL GUEST
            </Typography>
          </Box>
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: 'white',
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              textAlign: 'center',
              fontWeight: 'medium',
            }}
            aria-label={`Musical guest is ${isLive ? musicalGuest : "Classic Performance"}`}
          >
            {isLive ? musicalGuest : "Classic Performance"}
          </Typography>
        </Paper>
      </motion.div>
    </>
  );
} 