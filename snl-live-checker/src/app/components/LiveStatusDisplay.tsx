'use client';

import { motion } from 'framer-motion';
import Countdown from 'react-countdown';

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
      <div className="neon-text-green text-2xl md:text-3xl font-bold">
        🔴 LIVE NOW!
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-4 md:space-x-8">
      <div className="countdown-digit">
        <div className="neon-text-yellow text-3xl md:text-5xl font-bold">{hours}</div>
        <div className="text-white text-sm">HOURS</div>
      </div>
      <div className="countdown-digit">
        <div className="neon-text-yellow text-3xl md:text-5xl font-bold">{minutes}</div>
        <div className="text-white text-sm">MINUTES</div>
      </div>
      <div className="countdown-digit">
        <div className="neon-text-yellow text-3xl md:text-5xl font-bold">{seconds}</div>
        <div className="text-white text-sm">SECONDS</div>
      </div>
    </div>
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
        {isLive ? (
          <div className="neon-text-green text-3xl md:text-4xl font-bold">
            🔴 LIVE TONIGHT
          </div>
        ) : (
          <div className="neon-text-orange text-3xl md:text-4xl font-bold">
            📺 RERUN TONIGHT
          </div>
        )}
      </motion.div>

      {/* Countdown */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        {!isLive && (
          <>
            <div className="neon-text-blue text-xl md:text-2xl mb-4">
              NEXT LIVE SHOW IN:
            </div>
            <div className="countdown-wrapper">
              <Countdown
                key={nextSNLDate.getTime()} // Force re-render when date changes
                date={nextSNLDate}
                renderer={CountdownRenderer}
                intervalDelay={1000}
                precision={3}
              />
            </div>
            <div className="text-white text-sm mt-2">
              Next show: {nextSNLDate.toLocaleDateString()} at 11:30 PM ET
            </div>
          </>
        )}
        
        {isLive && (
          <motion.div
            className="neon-text-yellow text-3xl md:text-5xl font-bold"
            animate={{ 
              textShadow: [
                '0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00',
                '0 0 20px #ffff00, 0 0 30px #ffff00, 0 0 40px #ffff00',
                '0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ON AIR NOW!
          </motion.div>
        )}
      </motion.div>

      {/* Action Message */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.8 }}
      >
        {isLive ? (
          <div className="neon-text-green text-lg md:text-xl">
            🏠 STAY IN & WATCH THE MAGIC!
          </div>
        ) : (
          <div className="neon-text-orange text-lg md:text-xl">
            🌃 GO OUT & LIVE YOUR LIFE!
          </div>
        )}
      </motion.div>
    </>
  );
} 