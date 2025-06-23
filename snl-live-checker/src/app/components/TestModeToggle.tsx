'use client';

import { Box, Switch, FormControlLabel } from '@mui/material';

interface TestModeToggleProps {
  isTestMode: boolean;
  onToggle: (checked: boolean) => void;
}

export default function TestModeToggle({ isTestMode, onToggle }: TestModeToggleProps) {
  return (
    <Box className="absolute top-4 right-4 z-50">
      <FormControlLabel
        control={
          <Switch
            checked={isTestMode}
            onChange={(e) => onToggle(e.target.checked)}
            sx={{
              '& .MuiSwitch-thumb': {
                backgroundColor: '#ff0080',
              },
              '& .MuiSwitch-track': {
                backgroundColor: '#333',
              },
            }}
          />
        }
        label={
          <span className="text-white font-bold">
            TEST: {isTestMode ? 'LIVE' : 'RERUN'}
          </span>
        }
      />
    </Box>
  );
} 