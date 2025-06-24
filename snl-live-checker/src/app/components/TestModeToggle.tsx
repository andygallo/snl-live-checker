'use client';

import { Box, Button } from '@mui/material';
import { PlayArrow, Pause, StopCircle } from '@mui/icons-material';

export type TestMode = 'off' | 'new-episode' | 'rerun' | 'on-break';

interface TestModeToggleProps {
  testMode: TestMode;
  onModeChange: (mode: TestMode) => void;
}

const TEST_MODES: { mode: TestMode; label: string; icon: React.ReactNode; color: string }[] = [
  { mode: 'off', label: 'OFF', icon: <StopCircle />, color: '#666' },
  { mode: 'new-episode', label: 'NEW EP', icon: <PlayArrow />, color: '#00ff88' },
  { mode: 'rerun', label: 'RERUN', icon: <Pause />, color: '#ff8800' },
  { mode: 'on-break', label: 'BREAK', icon: <StopCircle />, color: '#ff0080' },
];

export default function TestModeToggle({ testMode, onModeChange }: TestModeToggleProps) {
  const handleNextMode = () => {
    const currentIndex = TEST_MODES.findIndex(m => m.mode === testMode);
    const nextIndex = (currentIndex + 1) % TEST_MODES.length;
    onModeChange(TEST_MODES[nextIndex].mode);
  };

  const currentModeConfig = TEST_MODES.find(m => m.mode === testMode) || TEST_MODES[0];

  return (
    <Box 
      className="absolute top-4 right-4 z-50"
      role="toolbar"
      aria-label="Testing controls"
    >
      <Button
        onClick={handleNextMode}
        variant="outlined"
        size="small"
        startIcon={currentModeConfig.icon}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          border: `2px solid ${currentModeConfig.color}`,
          color: currentModeConfig.color,
          fontFamily: '"Orbitron", "Roboto Mono", monospace',
          fontWeight: 'bold',
          fontSize: { xs: '0.75rem', md: '0.875rem' },
          minWidth: { xs: '100px', md: '120px' },
          backdropFilter: 'blur(10px)',
          boxShadow: `0 0 10px ${currentModeConfig.color}40`,
          '&:hover': {
            backgroundColor: `${currentModeConfig.color}20`,
            border: `2px solid ${currentModeConfig.color}`,
            boxShadow: `0 0 15px ${currentModeConfig.color}60`,
          },
          '&:focus-visible': {
            outline: `2px solid ${currentModeConfig.color}`,
            outlineOffset: '2px',
          },
        }}
        aria-label={`Test mode: ${currentModeConfig.label}. Click to cycle through test modes.`}
        aria-describedby="test-mode-description"
      >
        TEST: {currentModeConfig.label}
      </Button>
      
      {/* Hidden description for screen readers */}
      <span 
        id="test-mode-description" 
        className="sr-only"
        aria-live="polite"
      >
        Current test mode: {currentModeConfig.label}. 
        {testMode === 'off' && 'Using real SNL data.'}
        {testMode === 'new-episode' && 'Simulating a week with a new episode.'}
        {testMode === 'rerun' && 'Simulating a rerun week.'}
        {testMode === 'on-break' && 'Simulating SNL on seasonal break.'}
      </span>
    </Box>
  );
} 