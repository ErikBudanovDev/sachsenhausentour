export const theme = {
  colors: {
    primary: '#1A1A1A',
    secondary: '#2D2D2D',
    accent: '#C4A35A',
    text: '#F0EDE8',
    textMuted: '#8A8580',
    urgent: '#8B2500',
    surface: '#141517',
  },
  fonts: {
    heading: ['Playfair Display', 'serif'],
    body: ['Inter', 'sans-serif'],
    accent: ['EB Garamond', 'serif'],
  },
  animation: {
    slow: '600ms ease-out',
    medium: '400ms ease-out',
    fast: '200ms ease-out',
  },
} as const

export type ThemeColors = keyof typeof theme.colors
