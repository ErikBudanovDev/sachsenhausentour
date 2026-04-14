export const theme = {
  colors: {
    /* Navy Blue + Beige + Teal palette */
    primary: '#F5F0EB',       /* warm beige — main background */
    secondary: '#EDE8E1',     /* slightly darker beige — section alternation */
    accent: '#2A9D8F',        /* teal — CTAs, links, interactive elements */
    accentHover: '#238577',   /* darker teal for hover states */
    navy: '#1B2A4A',          /* navy blue — headings, trust, authority */
    navyLight: '#2C3E66',     /* lighter navy for secondary elements */
    text: '#1B2A4A',          /* navy for body text — high contrast on beige */
    textMuted: '#5C6A7E',     /* muted blue-gray for secondary text */
    surface: '#FFFFFF',       /* white — cards, elevated surfaces */
    border: '#D4CFC8',        /* warm gray border */
    urgent: '#C0392B',        /* red for urgency */
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
