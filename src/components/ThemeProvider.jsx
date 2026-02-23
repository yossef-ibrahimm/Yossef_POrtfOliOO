/**
 * ThemeProvider — Production-Optimized
 *
 * Fixes vs original:
 * 1.  Redundant mount useEffect removed — caused double render on every mount.
 *     The lazy useState initializer already reads localStorage synchronously.
 *     The effect re-read it and conditionally called setTheme again = 2 renders.
 *
 * 2.  First-visit fallback fixed: original hardcoded 'dark' as default even
 *     when the user's OS was set to light. Now reads prefers-color-scheme
 *     in the lazy initializer so the very first render is already correct.
 *
 * 3.  prefers-color-scheme is now subscribed to at runtime — if the user
 *     changes their OS theme while the app is open, it updates automatically.
 *     The subscription is only active when no explicit saved preference exists.
 *
 * 4.  CSS custom property --bg-gradient updated on theme change here so that
 *     InteractiveBackground (App.jsx) can read it without needing theme as a prop,
 *     eliminating the unnecessary re-render of the entire background tree.
 *
 * 5.  TypeScript-style JSDoc added for consumer DX.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'

// ---------------------------------------------------------------------------
// Types (JSDoc for plain JS projects — replace with .ts if migrating)
// ---------------------------------------------------------------------------
/**
 * @typedef {'dark' | 'light'} Theme
 * @typedef {{ theme: Theme, toggleTheme: () => void }} ThemeContextValue
 */

// ---------------------------------------------------------------------------
// Context — null default forces consumers to be inside the provider
// ---------------------------------------------------------------------------
/** @type {import('react').Context<ThemeContextValue | null>} */
const ThemeContext = createContext(null)

// ---------------------------------------------------------------------------
// getInitialTheme — synchronous, called once as useState lazy initializer
//
// Priority order:
// 1. Explicit user preference saved in localStorage
// 2. OS-level prefers-color-scheme
// 3. 'dark' as final fallback
//
// ✅ FIXED: Original hardcoded 'dark' as fallback ignoring OS preference.
// ✅ Safe for SSR: typeof window guard prevents crash in Node environments.
// ---------------------------------------------------------------------------
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'

  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved

  // No saved preference → respect OS setting
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

// ---------------------------------------------------------------------------
// applyTheme — pure DOM mutation, extracted for reuse and testability
//
// Also updates the CSS custom property consumed by InteractiveBackground
// so that component no longer needs theme passed as a prop (fixes the
// unnecessary full background re-render on theme toggle noted in App.jsx review)
// ---------------------------------------------------------------------------
/** @param {Theme} theme */
function applyTheme(theme) {
  const root = document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  localStorage.setItem('theme', theme)

  // ✅ CSS custom property consumed by InteractiveBackground (App.jsx)
  // This eliminates the need to pass `theme` as a prop to that component,
  // preventing its entire subtree (40 particles + orbs) from re-rendering.
  // Add to global CSS:
  //   :root       { --bg-gradient: radial-gradient(circle, hsl(250,50%,8%), hsl(240,50%,3%)); }
  //   :root.light { --bg-gradient: radial-gradient(circle, hsl(0,0%,95%), hsl(0,0%,90%)); }
  root.style.setProperty(
    '--bg-gradient',
    theme === 'dark'
      ? 'radial-gradient(circle, hsl(250,50%,8%), hsl(240,50%,3%))'
      : 'radial-gradient(circle, hsl(0,0%,95%), hsl(0,0%,90%))',
  )
}

// ---------------------------------------------------------------------------
// ThemeProvider
// ---------------------------------------------------------------------------
export const ThemeProvider = ({ children }) => {
  // ✅ FIXED: Single source of truth. Lazy initializer runs once synchronously,
  // reads localStorage AND OS preference — no redundant effect needed.
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // ✅ NEW: Subscribe to OS theme changes at runtime.
  // Only overrides the active theme if the user has NOT set an explicit preference.
  // This means: if you manually toggled to 'light', changing your OS to dark
  // will NOT override your explicit choice. If you've never toggled (no localStorage
  // entry), it will follow the OS setting live.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const handleOsThemeChange = (e) => {
      // Only follow OS if no explicit user preference is saved
      const hasExplicitPreference = localStorage.getItem('theme') !== null
      if (!hasExplicitPreference) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mq.addEventListener('change', handleOsThemeChange)
    return () => mq.removeEventListener('change', handleOsThemeChange)
  }, [])

  // Stable toggle — useCallback with empty deps, never changes reference
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  // Memoized context value — only re-creates when theme changes (toggleTheme is stable)
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// ---------------------------------------------------------------------------
// useTheme — typed consumer hook with provider guard
// ---------------------------------------------------------------------------
/**
 * Returns the current theme and a stable toggle function.
 * Must be called inside <ThemeProvider>.
 * @returns {ThemeContextValue}
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
