'use client';

import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import { Typography, Box, Paper } from '@mui/material';
import { LiveTv, Tv, AccessTime } from '@mui/icons-material';

interface LiveStatusDisplayProps {
  isLive: boolean;
  nextSNLDate: Date;
}

interface CountdownRendererProps {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const CountdownRenderer = ({ hours, minutes, seconds, completed }: CountdownRendererProps) => {
  if (completed) {
    return (
      <Typography
        variant="h4"
        component="div"
        className="neon-text-green"
        sx={{
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', md: '2rem' },
          textAlign: 'center',
        }}
      >
        🔴 LIVE NOW!
      </Typography>
    );
  }

  return (
    <Box display="flex" justifyContent="center" gap={{ xs: 2, md: 4 }}>
      <Box textAlign="center">
        <Typography
          variant="h3"
          component="div"
          className="neon-text-yellow"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '3rem' },
            fontFamily: 'monospace',
          }}
        >
          {String(hours).padStart(2, '0')}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            fontWeight: 'bold',
          }}
        >
          HOURS
        </Typography>
      </Box>
      <Box textAlign="center">
        <Typography
          variant="h3"
          component="div"
          className="neon-text-yellow"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '3rem' },
            fontFamily: 'monospace',
          }}
        >
          {String(minutes).padStart(2, '0')}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            fontWeight: 'bold',
          }}
        >
          MINUTES
        </Typography>
      </Box>
      <Box textAlign="center">
        <Typography
          variant="h3"
          component="div"
          className="neon-text-yellow"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '3rem' },
            fontFamily: 'monospace',
          }}
        >
          {String(seconds).padStart(2, '0')}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            fontWeight: 'bold',
          }}
        >
          SECONDS
        </Typography>
      </Box>
    </Box>
  );
};

export default function LiveStatusDisplay({ isLive, nextSNLDate }: LiveStatusDisplayProps) {
  return (
    <>
      {/* Status */}
      <motion.div
        className="text-center mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            background: isLive 
              ? 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))'
              : 'linear-gradient(45deg, rgba(255, 152, 0, 0.1), rgba(255, 193, 7, 0.1))',
            border: isLive 
              ? '2px solid #4caf50'
              : '2px solid #ff9800',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
            {isLive ? (
              <LiveTv sx={{ fontSize: 48, color: '#4caf50' }} />
            ) : (
              <Tv sx={{ fontSize: 48, color: '#ff9800' }} />
            )}
            <Typography
              variant="h3"
              component="h2"
              className={isLive ? "neon-text-green" : "neon-text-orange"}
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '2.5rem' },
                textAlign: 'center',
              }}
              aria-live="polite"
              role="status"
            >
              {isLive ? 'LIVE TONIGHT' : 'RERUN TONIGHT'}
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      {/* Countdown */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        {!isLive && (
          <Paper
            elevation={2}
            sx={{
              background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(103, 58, 183, 0.1))',
              border: '1px solid rgba(33, 150, 243, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={3}>
              <AccessTime sx={{ color: '#2196f3', fontSize: 32 }} />
              <Typography
                variant="h5"
                className="neon-text-blue"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  textAlign: 'center',
                }}
                component="h3"
              >
                NEXT LIVE SHOW IN:
              </Typography>
            </Box>
            <Box className="countdown-wrapper" mb={2}>
              <Countdown
                key={nextSNLDate.getTime()} // Force re-render when date changes
                date={nextSNLDate}
                renderer={CountdownRenderer}
                intervalDelay={1000}
                precision={3}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                fontSize: { xs: '0.875rem', md: '1rem' },
              }}
              component="p"
            >
              Next show: {nextSNLDate.toLocaleDateString()} at 11:30 PM ET
            </Typography>
          </Paper>
        )}
        
        {isLive && (
          <Paper
            elevation={4}
            sx={{
              background: 'linear-gradient(45deg, rgba(255, 235, 59, 0.2), rgba(255, 193, 7, 0.2))',
              border: '2px solid #ffeb3b',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              animate={{ 
                textShadow: [
                  '0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00',
                  '0 0 20px #ffff00, 0 0 30px #ffff00, 0 0 40px #ffff00',
                  '0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Typography
                variant="h2"
                component="h3"
                className="neon-text-yellow"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', md: '3rem' },
                  textAlign: 'center',
                }}
                aria-live="assertive"
                role="alert"
              >
                ON AIR NOW!
              </Typography>
            </motion.div>
          </Paper>
        )}
      </motion.div>

      {/* Action Message */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.8 }}
      >
        <Typography
          variant="h6"
          component="p"
          className={isLive ? "neon-text-green" : "neon-text-orange"}
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            textAlign: 'center',
            marginTop: 2,
          }}
          role="complementary"
          aria-label={isLive ? "Recommendation to stay in" : "Recommendation to go out"}
        >
          {isLive ? '🏠 STAY IN & WATCH THE MAGIC!' : '🌃 GO OUT & LIVE YOUR LIFE!'}
        </Typography>
      </motion.div>
    </>
  );
} 