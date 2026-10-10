/**
 * Design System Theme Tokens
 * This file contains the core visual design tokens for the app.
 * These match the CSS variables defined in index.css and Tailwind config.
 */

export const theme = {
  colors: {
    light: {
      background: '#FAF8F1', // Warm off-white
      surface: '#FFFFFF', // White
      border: '#E8E3D3', // 1px border
      primary: '#2E7D32', // Leaf green
      primaryHover: '#1B5E20', // Pressed green
      accent: '#F9A825', // Harvest yellow
      earth: '#8D6E63', // Soil, headers
      water: '#1E88E5', // Info
      textPrimary: '#1F2A1F',
      textSecondary: '#5C6B5C',
      ratings: {
        veryGood: '#2E7D32',
        good: '#9CCC65',
        risky: '#E65100',
      }
    },
    dark: {
      background: '#0F1A12',
      surface: '#17251B',
      border: '#2A3B2A',
      primary: '#2E7D32',
      primaryHover: '#4CAF50',
      accent: '#F9A825',
      earth: '#8D6E63',
      water: '#1E88E5',
      textPrimary: '#EAF2E6',
      textSecondary: '#9DB39D',
      ratings: {
        veryGood: '#4CAF50',
        good: '#9CCC65',
        risky: '#FF9800',
      }
    }
  },
  typography: {
    fontFamily: {
      sans: "'Poppins', 'Noto Sans Telugu', 'Noto Sans Devanagari', sans-serif"
    },
    sizes: {
      body: '18px',
      questionTitle: {
        fontSize: '26px', // scales to 32px on desktop
        fontWeight: '700' // bold
      },
      button: {
        fontSize: '18px',
        fontWeight: '600' // semibold
      }
    }
  },
  spacing: {
    padding: '16px', // general padding
    gap: '16px', // grid gap
  },
  layout: {
    maxWidth: '720px',
    singleColumnMobile: true,
  },
  radius: {
    card: '24px',
    button: '16px',
  },
  shadows: {
    soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
    hoverPop: '0 10px 30px -4px rgba(0, 0, 0, 0.08)'
  },
  glass: {
    blur: '24px',
    saturate: '180%',
    light: {
      background: 'rgba(255, 255, 255, 0.6)',
      border: 'rgba(0, 0, 0, 0.08)',
    },
    dark: {
      background: 'rgba(15, 26, 18, 0.6)',
      border: 'rgba(255, 255, 255, 0.08)',
    },
  },
  animation: {
    durations: {
      fast: 0.15, // 150ms cross-fades
      normal: 0.3, // 300ms slides
      slow: 0.9 // 900ms score count up
    },
    easing: {
      out: 'easeOut',
      in: 'easeIn',
      spring: { type: 'spring', stiffness: 120, damping: 20 }
    }
  }
};

export default theme;
