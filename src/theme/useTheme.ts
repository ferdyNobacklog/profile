import { theme } from './theme'

/**
 * Custom hook to access theme classes
 * Usage: const { bg, text, button } = useTheme()
 */
export const useTheme = () => {
  return theme
}

/**
 * Direct theme access (alternative to hook)
 * Usage: import { theme } from '@/theme/theme'
 */
export default theme

