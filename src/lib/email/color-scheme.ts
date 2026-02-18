/**
 * Email Color Scheme for paraMOT
 * Centralized branding colors for all email templates
 * Change these to update all emails at once
 */

export const emailColors = {
  // Primary brand colors (sky blue for paragliding vibe)
  primary: '#0ea5e9', // Tailwind sky-500 - main brand color
  primaryDark: '#0284c7', // Tailwind sky-600 - darker variant
  primaryLight: '#38bdf8', // Tailwind sky-400 - lighter variant

  // Accent colors
  accent: '#0c4a6e', // Tailwind sky-900 - deep blue for headers/footers
  accentLight: '#7dd3fc', // Tailwind sky-300 - light accent for links

  // Neutral colors
  background: '#f0f9ff', // Tailwind sky-50 - page background
  cardBg: '#ffffff', // White - email container
  text: '#1e293b', // Slate-800 - main text
  textLight: '#64748b', // Slate-500 - secondary text

  // Semantic colors
  success: '#10b981', // Green - confirmations
  warning: '#f59e0b', // Amber - warnings
  error: '#ef4444', // Red - errors
  info: '#3b82f6', // Blue - info messages

  // UI elements
  border: '#e2e8f0', // Slate-200 - subtle borders
  divider: 'rgba(255, 255, 255, 0.2)', // Transparent white for dark backgrounds
  shadow: 'rgba(0, 0, 0, 0.1)', // Subtle shadow
} as const;

/**
 * Example usage in email templates:
 *
 * import { emailColors } from '@/lib/email/colour-scheme';
 *
 * <div style="background-color: ${emailColors.primary}; color: white;">
 *   Your content here
 * </div>
 */

/**
 * Tailwind Sky Color Reference (for future tweaks):
 * sky-50:  #f0f9ff
 * sky-100: #e0f2fe
 * sky-200: #bae6fd
 * sky-300: #7dd3fc
 * sky-400: #38bdf8
 * sky-500: #0ea5e9 ← Primary
 * sky-600: #0284c7 ← Primary Dark
 * sky-700: #0369a1
 * sky-800: #075985
 * sky-900: #0c4a6e ← Accent
 */
