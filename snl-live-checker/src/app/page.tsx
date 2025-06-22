'use client';

import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  Box,
  AppBar,
  Toolbar,
  Card,
  CardContent
} from '@mui/material';
import { 
  LiveTv as LiveTvIcon, 
  Repeat as RepeatIcon,
  Share as ShareIcon,
  TheaterComedy as ComedyIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

// SNL Jokes for reruns
const snlJokes = [
  {
    text: "It's a rerun, which means it's probably funnier than the original!",
    character: "Weekend Update",
  },
  {
    text: "Looks like you're watching a rerun... Well, isn't that special?",
    character: "Church Lady",
    sketch: "Church Chat",
  },
  {
    text: "A rerun? That's... NOT!",
    character: "Wayne Campbell",
    sketch: "Wayne's World",
  },
  {
    text: "It's a rerun, but hey, at least you're not watching reality TV!",
    character: "Stefon",
    sketch: "Weekend Update",
  },
  {
    text: "Rerun alert! Time to practice your 'Live from New York' impression.",
    character: "Cast Member",
  },
  {
    text: "It's a rerun, which means you can quote along like the SNL superfan you are!",
    character: "Superfans",
    sketch: "Da Bears",
  },
  {
    text: "A rerun? Well, excuuuuse me!",
    character: "Steve Martin",
  }
];

// Host themes
const hostThemes: Record<string, any> = {
  'Timothée Chalamet': {
    name: 'Timothée Chalamet',
    colors: {
      primary: '#9b59b6',
      secondary: '#3498db',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    catchphrase: "Indie vibes meet comedy gold!",
    movieOrShow: "Dune",
    funFact: "Youngest host to nail every sketch",
    emoji: '🌟'
  },
  'Ryan Gosling': {
    name: 'Ryan Gosling',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    catchphrase: "Hey girl, SNL is live tonight!",
    movieOrShow: "La La Land",
    funFact: "Known for breaking character and making everyone laugh",
    emoji: '🎭'
  }
};

const defaultTheme = {
  name: 'SNL Live',
  colors: {
    primary: '#ff0000',
    secondary: '#0066cc',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  catchphrase: "Live from New York, it's Saturday Night!",
  funFact: "Tonight's show is LIVE - anything can happen!",
  emoji: '🎬'
};

export default function Home() {
  // Mock data for demonstration - change isLive to test different states
  const isLive = false; 
  const showDate = "December 22, 2024";
  const host = "Timothée Chalamet";
  const musicalGuest = "Gracie Abrams";
  
  const [currentJoke, setCurrentJoke] = useState(snlJokes[0]);
  const hostTheme = hostThemes[host] || defaultTheme;

  // Get new joke every 5 seconds for reruns
  useEffect(() => {
    if (!isLive) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * snlJokes.length);
        setCurrentJoke(snlJokes[randomIndex]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const getStatusColors = () => {
    if (isLive) {
      return {
        background: `linear-gradient(135deg, ${hostTheme.colors.primary} 0%, ${hostTheme.colors.secondary} 100%)`,
        cardBackground: hostTheme.colors.background
      };
    }
    return {
      background: 'linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)',
      cardBackground: '#fff3e0'
    };
  };

  const colors = getStatusColors();

  return (
    <>
      {/* App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <ComedyIcon sx={{ mr: 2 }} />
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
              background: colors.background,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ mb: 2 }}>
              {isLive ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <LiveTvIcon sx={{ fontSize: 60 }} />
                  <Typography sx={{ fontSize: '3rem' }}>{hostTheme.emoji}</Typography>
                </Box>
              ) : (
                <RepeatIcon sx={{ fontSize: 60 }} />
              )}
            </Box>
            
            <Typography variant="h2" component="h1" gutterBottom>
              {isLive ? `SNL IS LIVE TONIGHT! ${hostTheme.emoji}` : "It's a Rerun, Folks"}
            </Typography>
            
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {showDate} • 11:30 PM ET
            </Typography>

            {isLive && hostTheme.catchphrase && (
              <Typography variant="h5" sx={{ mt: 2, fontStyle: 'italic', opacity: 0.9 }}>
                "{hostTheme.catchphrase}"
              </Typography>
            )}
          </Paper>

          {/* SNL Joke for Reruns */}
          {!isLive && (
            <Card 
              elevation={2}
              sx={{ 
                background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  🎭 SNL Says...
                </Typography>
                <Typography variant="h6" sx={{ fontStyle: 'italic', mb: 2 }}>
                  "{currentJoke.text}"
                </Typography>
                {currentJoke.character && (
                  <Chip 
                    label={`- ${currentJoke.character}`}
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                )}
              </CardContent>
            </Card>
          )}

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
              sx={{ 
                p: { xs: 2, md: 3 },
                background: isLive ? colors.cardBackground : 'white'
              }}
            >
              <Typography variant="h5" gutterBottom color="primary" className="tone-friendly">
                Tonight's Host {isLive ? hostTheme.emoji : '🎭'}
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {host}
              </Typography>
              <Chip 
                label={isLive ? "LIVE TONIGHT!" : "Rerun"} 
                color={isLive ? "success" : "warning"} 
                size="small"
                sx={{ mb: 2 }}
              />
              {isLive && hostTheme.movieOrShow && (
                <Chip 
                  label={`From: ${hostTheme.movieOrShow}`} 
                  color="secondary" 
                  size="small"
                  sx={{ mb: 2, ml: 1 }}
                />
              )}
              <Typography variant="body1" color="text.secondary" className="text-friendly">
                {isLive 
                  ? (hostTheme.funFact || "Get ready for an amazing live show!") 
                  : "This is a rerun - perfect excuse to go out and live your life!"
                }
              </Typography>
            </Paper>

            {/* Musical Guest */}
            <Paper 
              elevation={2} 
              className="snl-card-hover elevation-2" 
              sx={{ 
                p: { xs: 2, md: 3 },
                background: isLive ? colors.cardBackground : 'white'
              }}
            >
              <Typography variant="h5" gutterBottom color="primary" className="tone-friendly">
                Musical Guest {isLive ? '🎵' : '📻'}
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {musicalGuest}
              </Typography>
              <Chip 
                label={isLive ? "PERFORMING LIVE!" : "Recorded Performance"} 
                color={isLive ? "success" : "warning"} 
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary" className="text-friendly">
                {isLive 
                  ? "Perfect night to stay in and watch! 🍿" 
                  : "Perfect night to go out and make your own memories! 🎉"
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
                maxWidth: { xs: 300, sm: 'none' },
                backgroundColor: isLive ? hostTheme.colors.primary : undefined
              }}
            >
              {isLive ? `Share ${hostTheme.emoji}` : 'Share the Joke'}
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              className="snl-shadow"
              sx={{ 
                minWidth: { xs: '100%', sm: 200 },
                maxWidth: { xs: 300, sm: 'none' },
                borderColor: isLive ? hostTheme.colors.primary : undefined,
                color: isLive ? hostTheme.colors.primary : undefined
              }}
            >
              Get Notifications
            </Button>
          </Box>

          {/* Fun Footer */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {isLive 
                ? `Tune in to NBC at 11:30 PM ET for ${host}! ${hostTheme.emoji}`
                : "Live from New York... well, not tonight! But maybe next week! 😄"
              }
            </Typography>
          </Box>

          {/* Demo Toggle Button */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              💡 Change `isLive` in the code to see different themed states!
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}
