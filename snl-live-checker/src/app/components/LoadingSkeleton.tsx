'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Skeleton, Paper, Typography } from '@mui/material';

export const LoadingSkeleton: React.FC = () => {
  const pulseAnimation = {
    animate: {
      opacity: [0.6, 1, 0.6],
      scale: [1, 1.02, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <Box className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Main Status Loading */}
      <motion.div {...pulseAnimation} className="mb-8">
        <Paper 
          elevation={24}
          className="p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-md border border-cyan-400/30"
          sx={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
          }}
        >
          <Box className="text-center">
            <Skeleton 
              variant="text" 
              width={300} 
              height={60}
              className="mb-4"
              sx={{ 
                bgcolor: 'rgba(34, 211, 238, 0.1)',
                '&::after': {
                  background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.4), transparent)'
                }
              }}
            />
            <Skeleton 
              variant="text" 
              width={200} 
              height={40}
              sx={{ 
                bgcolor: 'rgba(34, 211, 238, 0.1)',
                '&::after': {
                  background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.4), transparent)'
                }
              }}
            />
          </Box>
        </Paper>
      </motion.div>

      {/* Host and Guest Loading */}
      <motion.div 
        {...pulseAnimation}
        transition={{ ...pulseAnimation.transition, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
      >
        {/* Host Loading */}
        <Paper 
          elevation={12}
          className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-md border border-blue-400/30"
          sx={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <Box className="flex items-center space-x-4">
            <Skeleton 
              variant="circular" 
              width={60} 
              height={60}
              sx={{ 
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                '&::after': {
                  background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)'
                }
              }}
            />
            <Box className="flex-1">
              <Skeleton 
                variant="text" 
                width="60%" 
                height={24}
                className="mb-2"
                sx={{ 
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)'
                  }
                }}
              />
              <Skeleton 
                variant="text" 
                width="80%" 
                height={32}
                sx={{ 
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)'
                  }
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Musical Guest Loading */}
        <Paper 
          elevation={12}
          className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-md border border-purple-400/30"
          sx={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
          }}
        >
          <Box className="flex items-center space-x-4">
            <Skeleton 
              variant="circular" 
              width={60} 
              height={60}
              sx={{ 
                bgcolor: 'rgba(147, 51, 234, 0.1)',
                '&::after': {
                  background: 'linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.4), transparent)'
                }
              }}
            />
            <Box className="flex-1">
              <Skeleton 
                variant="text" 
                width="60%" 
                height={24}
                className="mb-2"
                sx={{ 
                  bgcolor: 'rgba(147, 51, 234, 0.1)',
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.4), transparent)'
                  }
                }}
              />
              <Skeleton 
                variant="text" 
                width="80%" 
                height={32}
                sx={{ 
                  bgcolor: 'rgba(147, 51, 234, 0.1)',
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.4), transparent)'
                  }
                }}
              />
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {/* Loading Message */}
      <motion.div 
        {...pulseAnimation}
        transition={{ ...pulseAnimation.transition, delay: 0.6 }}
        className="mt-8"
      >
        <Typography 
          variant="h6" 
          className="text-cyan-300 font-mono text-center"
          sx={{
            textShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
            fontFamily: '"Orbitron", "Roboto Mono", monospace',
          }}
        >
          Loading SNL Data...
        </Typography>
      </motion.div>
    </Box>
  );
};

export default LoadingSkeleton; 