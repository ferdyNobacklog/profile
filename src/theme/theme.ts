// Theme configuration
export interface Theme {
  name: string
  colors: {
    background: {
      primary: string
      secondary: string
      tertiary: string
      card: string
    }
    text: {
      primary: string
      secondary: string
      accent: string
      muted: string
    }
    accent: {
      primary: string
      secondary: string
      light: string
      dark: string
    }
    border: {
      default: string
      accent: string
      muted: string
    }
  }
  shadows: {
    default: string
    hover: string
    accent: string
  }
  styles: {
    button: {
      primary: string
      secondary: string
    }
    card: string
    badge: string
  }
}

// Elegant White Theme
export const elegantTheme: Theme = {
  name: 'elegant',
  colors: {
    background: {
      primary: 'bg-elegant-white',
      secondary: 'bg-elegant-off-white',
      tertiary: 'bg-elegant-light-gray',
      card: 'bg-elegant-off-white',
    },
    text: {
      primary: 'text-elegant-dark-charcoal',
      secondary: 'text-elegant-charcoal',
      accent: 'text-elegant-accent',
      muted: 'text-elegant-charcoal',
    },
    accent: {
      primary: 'bg-elegant-accent',
      secondary: 'bg-elegant-teal',
      light: 'bg-elegant-accent/10',
      dark: 'bg-elegant-accent-dark',
    },
    border: {
      default: 'border-elegant-gray',
      accent: 'border-elegant-accent',
      muted: 'border-elegant-accent/30',
    },
  },
  shadows: {
    default: 'shadow-elegant',
    hover: 'shadow-elegant-lg',
    accent: 'shadow-elegant',
  },
  styles: {
    button: {
      primary: 'bg-elegant-accent text-white hover:bg-elegant-accent-dark transition-all shadow-elegant hover:shadow-elegant-lg',
      secondary: 'bg-transparent text-elegant-accent border-2 border-elegant-accent hover:bg-elegant-accent/10 transition-all shadow-elegant',
    },
    card: 'bg-elegant-off-white rounded-xl shadow-elegant hover:shadow-elegant-lg transition-all border border-elegant-accent/30 hover:border-elegant-accent',
    badge: 'bg-elegant-light-gray border border-elegant-accent/30 text-elegant-charcoal rounded-full',
  },
}

// Dark Cyber Theme (for future use)
export const cyberTheme: Theme = {
  name: 'cyber',
  colors: {
    background: {
      primary: 'bg-cyber-black',
      secondary: 'bg-cyber-darker',
      tertiary: 'bg-cyber-gray',
      card: 'bg-cyber-darker',
    },
    text: {
      primary: 'text-cyber-green-soft',
      secondary: 'text-cyber-green-soft/90',
      accent: 'text-cyber-green-soft',
      muted: 'text-cyber-green-soft/70',
    },
    accent: {
      primary: 'bg-cyber-green',
      secondary: 'bg-cyber-cyan',
      light: 'bg-cyber-green/10',
      dark: 'bg-cyber-green-dark',
    },
    border: {
      default: 'border-cyber-green/30',
      accent: 'border-cyber-green',
      muted: 'border-cyber-green/50',
    },
  },
  shadows: {
    default: 'shadow-glow-green',
    hover: 'shadow-glow-green',
    accent: 'shadow-glow-green',
  },
  styles: {
    button: {
      primary: 'bg-cyber-green text-cyber-black hover:bg-cyber-green-dark transition-all shadow-lg hover:shadow-glow-green border border-cyber-green',
      secondary: 'bg-transparent text-cyber-green-soft border-2 border-cyber-green/60 hover:bg-cyber-green/10 transition-all border-glow-green',
    },
    card: 'bg-cyber-darker rounded-xl shadow-lg hover:shadow-glow-green transition-all border border-cyber-green/30 hover:border-cyber-green',
    badge: 'bg-cyber-gray border border-cyber-green/50 text-cyber-green-soft/80 rounded-full',
  },
}

// Current active theme
export const currentTheme = elegantTheme

// Theme utility functions
export const getTheme = (): Theme => currentTheme

export const theme = {
  bg: {
    primary: currentTheme.colors.background.primary,
    secondary: currentTheme.colors.background.secondary,
    tertiary: currentTheme.colors.background.tertiary,
    card: currentTheme.colors.background.card,
  },
  text: {
    primary: currentTheme.colors.text.primary,
    secondary: currentTheme.colors.text.secondary,
    accent: currentTheme.colors.text.accent,
    muted: currentTheme.colors.text.muted,
  },
  accent: {
    primary: currentTheme.colors.accent.primary,
    secondary: currentTheme.colors.accent.secondary,
    light: currentTheme.colors.accent.light,
    dark: currentTheme.colors.accent.dark,
  },
  border: {
    default: currentTheme.colors.border.default,
    accent: currentTheme.colors.border.accent,
    muted: currentTheme.colors.border.muted,
  },
  shadow: {
    default: currentTheme.shadows.default,
    hover: currentTheme.shadows.hover,
    accent: currentTheme.shadows.accent,
  },
  button: {
    primary: currentTheme.styles.button.primary,
    secondary: currentTheme.styles.button.secondary,
  },
  card: currentTheme.styles.card,
  badge: currentTheme.styles.badge,
}

