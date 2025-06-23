/**
 * Day Detection and Upcoming Saturday Information Utilities
 * Provides logic for showing appropriate SNL information based on the current day
 */

export interface DayDetectionResult {
  currentDay: number; // 0-6 (Sunday-Saturday)
  dayName: string;
  isSaturday: boolean;
  isShowDay: boolean; // Saturday or Sunday before 1 AM
  daysUntilSaturday: number;
  upcomingSaturday: Date;
  currentSaturday: Date;
  timeUntilShow: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  };
  messaging: {
    primary: string;
    secondary: string;
    countdownLabel: string;
  };
}

/**
 * Get comprehensive day detection and Saturday information
 */
export function getDayDetectionInfo(currentDate: Date = new Date()): DayDetectionResult {
  const now = new Date(currentDate);
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Calculate upcoming Saturday
  const upcomingSaturday = getUpcomingSaturday(now);
  const currentSaturday = getCurrentSaturday(now);
  
  // Calculate time until next show
  const timeUntilShow = calculateTimeUntilShow(upcomingSaturday, now);
  
  // Determine if it's currently show day (Saturday evening or early Sunday)
  const isShowDay = isCurrentlyShowDay(now);
  
  // Generate appropriate messaging
  const messaging = generateMessaging(currentDay, timeUntilShow.days, isShowDay);

  return {
    currentDay,
    dayName: dayNames[currentDay],
    isSaturday: currentDay === 6,
    isShowDay,
    daysUntilSaturday: timeUntilShow.days,
    upcomingSaturday,
    currentSaturday,
    timeUntilShow,
    messaging
  };
}

/**
 * Get the upcoming Saturday at 11:30 PM ET
 */
export function getUpcomingSaturday(currentDate: Date = new Date()): Date {
  const now = new Date(currentDate);
  const nextSaturday = new Date(now);
  
  // Calculate days until next Saturday (6 = Saturday)
  let daysUntilSaturday = (6 - now.getDay() + 7) % 7;
  
  // If it's Saturday, check if we need this Saturday or next Saturday
  if (now.getDay() === 6) {
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // If it's before 11:30 PM on Saturday, use today
    if (hour < 23 || (hour === 23 && minute < 30)) {
      daysUntilSaturday = 0;
    } else {
      // After 11:30 PM Saturday, use next Saturday
      daysUntilSaturday = 7;
    }
  }
  
  // If it's Sunday early morning (before 1 AM), we might still be in "Saturday's show"
  if (now.getDay() === 0 && now.getHours() < 1) {
    // Show is currently live or just ended, next show is in 7 days
    daysUntilSaturday = 6;
  }
  
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  nextSaturday.setHours(23, 30, 0, 0); // 11:30 PM ET
  
  return nextSaturday;
}

/**
 * Get the current Saturday (or most recent Saturday)
 */
export function getCurrentSaturday(currentDate: Date = new Date()): Date {
  const now = new Date(currentDate);
  const currentSaturday = new Date(now);
  
  let daysSinceSaturday;
  if (now.getDay() === 6) {
    daysSinceSaturday = 0; // It's Saturday
  } else if (now.getDay() === 0) {
    daysSinceSaturday = 1; // It's Sunday, Saturday was yesterday
  } else {
    daysSinceSaturday = (now.getDay() + 1) % 7; // Days since last Saturday
  }
  
  currentSaturday.setDate(now.getDate() - daysSinceSaturday);
  currentSaturday.setHours(23, 30, 0, 0); // 11:30 PM ET
  
  return currentSaturday;
}

/**
 * Check if it's currently show day (Saturday evening or early Sunday)
 */
export function isCurrentlyShowDay(currentDate: Date = new Date()): boolean {
  const now = new Date(currentDate);
  const day = now.getDay();
  const hour = now.getHours();
  
  // Saturday (any time)
  if (day === 6) return true;
  
  // Sunday before 1 AM (still part of Saturday's show)
  if (day === 0 && hour < 1) return true;
  
  return false;
}

/**
 * Calculate precise time until the next show
 */
export function calculateTimeUntilShow(targetDate: Date, currentDate: Date = new Date()) {
  const diff = targetDate.getTime() - currentDate.getTime();
  
  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diff
  };
}

/**
 * Generate appropriate messaging based on the current day
 */
export function generateMessaging(currentDay: number, daysUntilSaturday: number, isShowDay: boolean): DayDetectionResult['messaging'] {
  // Saturday messaging
  if (currentDay === 6) {
    return {
      primary: "SNL Tonight!",
      secondary: "Saturday Night Live airs tonight at 11:30 PM ET",
      countdownLabel: "Show starts in"
    };
  }
  
  // Sunday early morning (show day continues)
  if (currentDay === 0 && isShowDay) {
    return {
      primary: "SNL Tonight!",
      secondary: "Saturday Night Live is on now or just ended",
      countdownLabel: "Next show in"
    };
  }
  
  // Sunday through Friday
  const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = dayNames[currentDay] || 'Today';
  
  if (daysUntilSaturday === 1) {
    return {
      primary: "SNL Tomorrow!",
      secondary: "Saturday Night Live airs tomorrow at 11:30 PM ET",
      countdownLabel: "Show starts in"
    };
  }
  
  if (daysUntilSaturday <= 6) {
    return {
      primary: "Next SNL",
      secondary: `Saturday Night Live airs this Saturday at 11:30 PM ET`,
      countdownLabel: "Next show in"
    };
  }
  
  // Fallback
  return {
    primary: "Next SNL",
    secondary: "Saturday Night Live airs Saturdays at 11:30 PM ET",
    countdownLabel: "Next show in"
  };
}

/**
 * Get a human-readable time until next show
 */
export function getTimeUntilNextShowText(timeUntil: DayDetectionResult['timeUntilShow']): string {
  const { days, hours, minutes } = timeUntil;
  
  if (days > 0) {
    if (days === 1) {
      return `${days} day, ${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    return `${days} days, ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
}

/**
 * Check if SNL is currently live (during show time)
 */
export function isCurrentlyLive(currentDate: Date = new Date()): boolean {
  const now = new Date(currentDate);
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // Saturday 11:30 PM - 11:59 PM
  if (day === 6 && hour === 23 && minute >= 30) return true;
  
  // Sunday 12:00 AM - 1:00 AM (technically still Saturday's show)
  if (day === 0 && hour === 0) return true;
  
  return false;
} 