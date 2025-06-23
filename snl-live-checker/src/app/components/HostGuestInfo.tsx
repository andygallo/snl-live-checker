'use client';

import { motion } from 'framer-motion';
import { Typography, Paper, Box, Avatar } from '@mui/material';
import { Person, MusicNote } from '@mui/icons-material';

interface HostGuestInfoProps {
  isLive: boolean;
  isNewEpisode?: boolean;
  host?: string;
  musicalGuest?: string;
}

// Sample data from past episodes with images
const sampleHostData = {
  "Timothée Chalamet": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "Ryan Gosling": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "Margot Robbie": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  "Classic Episode": "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=150&h=150&fit=crop&crop=face"
};

const sampleMusicData = {
  "Boygenius": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face",
  "Dua Lipa": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "The 1975": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face",
  "Classic Performance": "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop&crop=face"
};

// Church Lady and other SNL character quotes for reruns
const snlQuotes = [
  "Well, isn't that special? Maybe you should go to church instead! - The Church Lady",
  "We're here to pump... you up! But first, watch some classic SNL! - Hans & Franz",
  "That's... that's... not gonna work! Time for reruns! - The Motivational Speaker",
  "Buh-bye! New episodes will be back soon! - David Spade",
  "It's time for Deep Thoughts... like watching classic SNL! - Jack Handey",
  "Really? You thought there was a new episode? How convenient! - Church Lady"
];

export default function HostGuestInfo({ 
  isLive, 
  isNewEpisode = true,
  host = "Timothée Chalamet", 
  musicalGuest = "Boygenius" 
}: HostGuestInfoProps) {
  const displayHost = isLive ? host : isNewEpisode ? host : "Classic Episode";
  const displayGuest = isLive ? musicalGuest : isNewEpisode ? musicalGuest : "Classic Performance";
  const hostImage = sampleHostData[displayHost as keyof typeof sampleHostData] || sampleHostData["Classic Episode"];
  const guestImage = sampleMusicData[displayGuest as keyof typeof sampleMusicData] || sampleMusicData["Classic Performance"];
  
  // Get random SNL quote for reruns
  const randomQuote = !isNewEpisode && !isLive ? snlQuotes[Math.floor(Math.random() * snlQuotes.length)] : null;

  return (
    <section 
      aria-label="Tonight's SNL cast information"
      role="region"
      className="mb-4"
    >
      {/* SNL Quote for Reruns */}
      {randomQuote && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center mb-4"
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              fontStyle: 'italic',
              fontFamily: '"Orbitron", "Roboto Mono", monospace',
              textAlign: 'center',
              background: 'rgba(255, 136, 0, 0.1)',
              border: '1px solid rgba(255, 136, 0, 0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              backdropFilter: 'blur(4px)',
            }}
          >
            {randomQuote}
          </Typography>
        </motion.div>
      )}

      {/* Host and Musical Guest in horizontal layout */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 justify-center items-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        {/* Host Info */}
        <Paper
          className="retro-card flex-1 max-w-xs"
          elevation={3}
          sx={{
            background: 'linear-gradient(45deg, rgba(0, 188, 212, 0.1), rgba(0, 150, 136, 0.1))',
            border: '1px solid rgba(0, 188, 212, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Avatar 
              src={hostImage}
              sx={{ 
                bgcolor: '#00bcd4', 
                width: { xs: 60, md: 80 }, 
                height: { xs: 60, md: 80 },
                border: '2px solid rgba(0, 188, 212, 0.5)'
              }}
            >
              <Person />
            </Avatar>
            <Typography
              variant="h6"
              component="h3"
              className="neon-text-cyan"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '0.875rem', md: '1rem' },
                textAlign: 'center',
              }}
            >
              HOST
            </Typography>
            <Typography
              variant="body1"
              component="p"
              sx={{
                color: 'white',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                textAlign: 'center',
                fontWeight: 'medium',
              }}
              aria-label={`Tonight's host is ${displayHost}`}
            >
              {displayHost}
            </Typography>
          </Box>
        </Paper>

        {/* Musical Guest */}
        <Paper
          className="retro-card flex-1 max-w-xs"
          elevation={3}
          sx={{
            background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.1), rgba(233, 30, 99, 0.1))',
            border: '1px solid rgba(156, 39, 176, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Avatar 
              src={guestImage}
              sx={{ 
                bgcolor: '#9c27b0', 
                width: { xs: 60, md: 80 }, 
                height: { xs: 60, md: 80 },
                border: '2px solid rgba(156, 39, 176, 0.5)'
              }}
            >
              <MusicNote />
            </Avatar>
            <Typography
              variant="h6"
              component="h3"
              className="neon-text-cyan"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '0.875rem', md: '1rem' },
                textAlign: 'center',
              }}
            >
              MUSICAL GUEST
            </Typography>
            <Typography
              variant="body1"
              component="p"
              sx={{
                color: 'white',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                textAlign: 'center',
                fontWeight: 'medium',
              }}
              aria-label={`Musical guest is ${displayGuest}`}
            >
              {displayGuest}
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </section>
  );
} 