'use client';

import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  Box,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  LiveTv as LiveTvIcon, 
  Repeat as RepeatIcon,
  Share as ShareIcon 
} from '@mui/icons-material';

export default function Home() {
  // Mock data for demonstration
  const isLive = true;
  const showDate = "December 22, 2024";
  const host = "Timothée Chalamet";
  const musicalGuest = "Gracie Abrams";

  return (
    <>
      {/* App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SNL Live Checker
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Main Status Display */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              background: isLive 
                ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)' 
                : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: 'white'
            }}
          >
            <Box sx={{ mb: 2 }}>
              {isLive ? (
                <LiveTvIcon sx={{ fontSize: 60 }} />
              ) : (
                <RepeatIcon sx={{ fontSize: 60 }} />
              )}
            </Box>
            
            <Typography variant="h2" component="h1" gutterBottom>
              {isLive ? 'SNL IS LIVE TONIGHT!' : 'Rerun Tonight'}
            </Typography>
            
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {showDate} • 11:30 PM ET
            </Typography>
          </Paper>

          {/* Host and Musical Guest Row */}
          <Box 
            className="snl-desktop-padding md:snl-mobile-padding"
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: { xs: 2, md: 4 } 
            }}
          >
            {/* Host Information */}
            <Paper 
              elevation={2} 
              className="snl-card-hover elevation-2" 
              sx={{ p: { xs: 2, md: 3 } }}
            >
              <Typography variant="h5" gutterBottom color="primary" className="tone-friendly">
                Tonight&apos;s Host
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {host}
              </Typography>
              <Chip 
                label="3rd time hosting" 
                color="secondary" 
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary" className="text-friendly">
                {isLive 
                  ? "Get ready for an amazing live show!" 
                  : "This is a rerun from earlier this season."
                }
              </Typography>
            </Paper>

            {/* Musical Guest */}
            <Paper 
              elevation={2} 
              className="snl-card-hover elevation-2" 
              sx={{ p: { xs: 2, md: 3 } }}
            >
              <Typography variant="h5" gutterBottom color="primary" className="tone-friendly">
                Musical Guest
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {musicalGuest}
              </Typography>
              <Chip 
                label="SNL debut" 
                color="primary" 
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary" className="text-friendly">
                {isLive 
                  ? "Perfect night to stay in and watch!" 
                  : "Perfect night to go out and have fun!"
                }
              </Typography>
            </Paper>
          </Box>

          {/* Action Buttons */}
          <Box 
            className="snl-mobile-padding" 
            sx={{ 
              display: 'flex', 
              gap: { xs: 1, md: 2 }, 
              justifyContent: 'center', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center'
            }}
          >
            <Button 
              variant="contained" 
              size="large"
              startIcon={<ShareIcon />}
              className="snl-shadow"
              sx={{ 
                minWidth: { xs: '100%', sm: 200 },
                maxWidth: { xs: 300, sm: 'none' }
              }}
            >
              Share with Friends
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              className="snl-shadow"
              sx={{ 
                minWidth: { xs: '100%', sm: 200 },
                maxWidth: { xs: 300, sm: 'none' }
              }}
            >
              Get Notifications
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
