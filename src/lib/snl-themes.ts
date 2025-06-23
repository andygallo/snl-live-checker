import { SNLJoke, HostTheme, SNLThemeData } from '@/types/snl';

// Classic SNL insults and jokes for reruns
const snlJokes: SNLJoke[] = [
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
  },
  {
    text: "It's a rerun, but don't worry - the laughs are still fresh!",
    character: "Unfrozen Caveman Lawyer",
  },
  {
    text: "Rerun tonight, which means more time to perfect your Debbie Downer impression.",
    character: "Debbie Downer",
  },
  {
    text: "It's a rerun, but hey - that's what makes it... VINTAGE!",
    character: "Vintage",
  }
];

// Host-specific themes
const hostThemes: Record<string, HostTheme> = {
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
  },
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
  'Pete Davidson': {
    name: 'Pete Davidson',
    colors: {
      primary: '#e74c3c',
      secondary: '#f39c12',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    catchphrase: "Staten Island's finest!",
    movieOrShow: "The King of Staten Island",
    funFact: "Former cast member turned host",
    emoji: '😎'
  },
  'Taylor Swift': {
    name: 'Taylor Swift',
    colors: {
      primary: '#e91e63',
      secondary: '#9c27b0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    catchphrase: "Shake it off, it's SNL time!",
    movieOrShow: "Eras Tour",
    funFact: "Musical guest AND host extraordinaire",
    emoji: '✨'
  }
};

const defaultLiveTheme: HostTheme = {
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

export const snlThemeData: SNLThemeData = {
  reruns: snlJokes,
  hostThemes,
  defaultLiveTheme
};

// Helper functions
export const getRandomJoke = (): SNLJoke => {
  const randomIndex = Math.floor(Math.random() * snlJokes.length);
  return snlJokes[randomIndex];
};

export const getHostTheme = (hostName: string): HostTheme => {
  return hostThemes[hostName] || defaultLiveTheme;
};

export const createHostTheme = (hostName: string): HostTheme => {
  // Generate a theme for hosts not in our database
  const colors = [
    { primary: '#e74c3c', secondary: '#f39c12', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { primary: '#3498db', secondary: '#9b59b6', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { primary: '#2ecc71', secondary: '#f1c40f', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { primary: '#e91e63', secondary: '#ff5722', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    name: hostName,
    colors: randomColor,
    catchphrase: `${hostName} is hosting tonight - let's go!`,
    funFact: "Tonight's host is ready to bring the laughs!",
    emoji: '🎭'
  };
}; 