// src/shared/theme/colors.ts

/**
 * 1. The Base Palette
 * These are the raw, unchanging hex codes.
 */
const palette = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    400: '#94a3b8',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  sky: {
    100: '#e0f2fe',
    700: '#0369a1',
    400: '#38bdf8', // Brighter blue for dark mode
  },
  emerald: {
    500: '#10b981',
  },
  rose: {
    500: '#f43f5e',
  },
};

/**
 * 2. Light Theme Mapping
 */
export const lightColors = {
  background: palette.slate[50],
  card: palette.white,
  text: palette.slate[900],
  textMuted: palette.slate[400],
  border: palette.slate[200],
  primary: palette.sky[700],
  success: palette.emerald[500],
  danger: palette.rose[500],
  headerBackground: palette.white,
  iconBackground: palette.slate[100],
};

/**
 * 3. Dark Theme Mapping (The "Black Screen" mode)
 */
export const darkColors = {
  background: palette.slate[900],
  card: palette.slate[800],
  text: palette.slate[50],
  textMuted: palette.slate[400],
  border: palette.slate[700],
  primary: palette.sky[400], // Lighter blue pops better on dark backgrounds
  success: palette.emerald[500],
  danger: palette.rose[500],
  headerBackground: palette.slate[900],
  iconBackground: palette.slate[700],
};

// Export the raw palette just in case specific UI elements need a hardcoded color
export { palette };