// ============================================
// Design System Tokens & Modern UI Theme
// ============================================

export const THEME = {
  colors: {
    // Brand & Primary
    primary: '#4F46E5', // Electric Indigo
    primaryLight: '#EEF2FF',
    primaryDark: '#3730A3',
    primaryHover: '#4338CA',

    // Secondary / Accent
    accent: '#06B6D4', // Vibrant Cyan
    accentLight: '#ECFEFF',

    // Financial Status Colors
    income: '#10B981', // Emerald Green
    incomeBg: '#ECFDF5',
    incomeBorder: '#A7F3D0',

    expense: '#F43F5E', // Rose Coral
    expenseBg: '#FFF1F2',
    expenseBorder: '#FECDD3',

    warning: '#F59E0B', // Amber
    warningBg: '#FEF3C7',

    // Dark Card Hero Surfaces
    heroBg: '#0F172A', // Slate 900
    heroCard: '#1E293B', // Slate 800
    heroBorder: '#334155', // Slate 700
    heroText: '#F8FAFC',
    heroSubtext: '#94A3B8',

    // Light Theme Surfaces
    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9', // Slate 100
    border: '#E2E8F0', // Slate 200
    borderLight: '#F1F5F9',

    // Typography
    textPrimary: '#0F172A', // Slate 900
    textSecondary: '#475569', // Slate 600
    textMuted: '#94A3B8', // Slate 400
    textInverse: '#FFFFFF',

    // Overlays
    glassBg: 'rgba(255, 255, 255, 0.85)',
    darkGlassBg: 'rgba(30, 41, 59, 0.75)',
  },

  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    full: 9999,
  },

  shadows: {
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
    elevated: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 6,
    },
    hero: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 8,
    },
  },
};
