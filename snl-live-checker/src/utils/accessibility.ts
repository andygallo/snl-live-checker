/**
 * Accessibility utilities for WCAG compliance
 */

// Color contrast ratios (WCAG AA requires 4.5:1 for normal text, 3:1 for large text)
export const colorContrast = {
  // High contrast combinations for neon theme
  neonCyan: '#00ffff',
  neonPink: '#ff0080', 
  neonGreen: '#00ff80',
  neonYellow: '#ffff00',
  neonBlue: '#0080ff',
  neonOrange: '#ff8000',
  neonRed: '#ff0040',
  
  // Background colors with sufficient contrast
  darkBackground: '#0a0a0a',
  mediumBackground: '#1a1a1a',
  lightBackground: '#2a2a2a',
} as const;

// Screen reader only styles
export const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const;

// Focus styles for keyboard navigation
export const focusStyles = {
  outline: '2px solid #00ffff',
  outlineOffset: '2px',
  borderRadius: '4px',
} as const;

// Reduced motion preferences
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// High contrast mode detection
export const prefersHighContrast = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// ARIA live region announcer
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (typeof window === 'undefined') return;
  
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  
  document.body.appendChild(announcer);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
};

// Keyboard event helpers
export const isEnterOrSpace = (event: KeyboardEvent) => {
  return event.key === 'Enter' || event.key === ' ';
};

export const isEscape = (event: KeyboardEvent) => {
  return event.key === 'Escape';
};

// Focus management
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

// Time formatting for screen readers
export const formatTimeForScreenReader = (hours: number, minutes: number, seconds: number) => {
  const parts = [];
  
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }
  if (seconds > 0) {
    parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  }
  
  if (parts.length === 0) return 'Less than a second';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
};

// Date formatting for screen readers
export const formatDateForScreenReader = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'long'
  });
};

// Live status announcements
export const getLiveStatusAnnouncement = (isLive: boolean, host?: string, musicalGuest?: string) => {
  if (isLive) {
    let announcement = 'Saturday Night Live is currently live';
    if (host) announcement += ` with host ${host}`;
    if (musicalGuest) announcement += ` and musical guest ${musicalGuest}`;
    return announcement;
  } else {
    return 'Saturday Night Live is showing a rerun tonight';
  }
};

// Error message formatting
export const formatErrorForScreenReader = (error: string) => {
  return `Error: ${error}. Please try again or contact support if the problem persists.`;
};

// Loading state announcements
export const getLoadingAnnouncement = (context: string) => {
  return `Loading ${context}. Please wait.`;
};

// Success announcements
export const getSuccessAnnouncement = (action: string) => {
  return `${action} completed successfully.`;
}; 