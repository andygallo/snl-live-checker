'use client';

import { Box, Switch, FormControlLabel } from '@mui/material';

interface TestModeToggleProps {
  isTestMode: boolean;
  onToggle: (checked: boolean) => void;
}

export default function TestModeToggle({ isTestMode, onToggle }: TestModeToggleProps) {
  return (
    <Box 
      className="absolute top-4 right-4 z-50"
      role="toolbar"
      aria-label="Testing controls"
    >
      <FormControlLabel
        control={
          <Switch
            checked={isTestMode}
            onChange={(e) => onToggle(e.target.checked)}
            inputProps={{
              'aria-label': 'Toggle test mode to simulate live or rerun status',
              'aria-describedby': 'test-mode-description'
            }}
            sx={{
              '& .MuiSwitch-thumb': {
                backgroundColor: '#ff0080',
              },
              '& .MuiSwitch-track': {
                backgroundColor: '#333',
              },
              '&:focus-visible': {
                outline: '2px solid #00ffff',
                outlineOffset: '2px',
              },
            }}
          />
        }
        label={
          <span 
            className="text-white font-bold"
            id="test-mode-description"
            aria-live="polite"
          >
            TEST: {isTestMode ? 'LIVE' : 'RERUN'}
          </span>
        }
        sx={{
          '& .MuiFormControlLabel-label': {
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontFamily: '"Orbitron", "Roboto Mono", monospace',
          },
        }}
      />
    </Box>
  );
} 