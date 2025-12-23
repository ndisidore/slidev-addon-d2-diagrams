import { computed, ref, watchEffect, type Ref, type ComputedRef } from 'vue'
import {
  type D2ThemeName,
  DEFAULT_LIGHT_THEME_ID,
  DEFAULT_DARK_THEME_ID,
  resolveThemeId,
} from './types'

interface UseDarkModeThemeOptions {
  /** Numeric theme ID for light mode */
  themeId?: Ref<number | undefined> | ComputedRef<number | undefined>
  /** Named theme for light mode */
  theme?: Ref<D2ThemeName | undefined> | ComputedRef<D2ThemeName | undefined>
  /** Numeric theme ID for dark mode */
  darkThemeId?: Ref<number | undefined> | ComputedRef<number | undefined>
  /** Named theme for dark mode */
  darkTheme?: Ref<D2ThemeName | undefined> | ComputedRef<D2ThemeName | undefined>
  /** Whether to automatically sync with Slidev dark mode */
  autoSyncDarkMode?: Ref<boolean> | ComputedRef<boolean>
}

// Track if we're in a Slidev context
let slidevDarkRef: Ref<boolean> | null = null
let initializationPromise: Promise<void> | null = null

/**
 * Initialize Slidev dark mode detection (called once)
 */
async function initSlidevDarkMode(): Promise<Ref<boolean>> {
  try {
    // Dynamic import to avoid issues when not in Slidev context
    const slidevClient = await import('@slidev/client')
    if (slidevClient.useDark) {
      const darkMode = slidevClient.useDark()
      return darkMode.isDark
    }
  } catch {
    // Not in Slidev context
  }
  // Fallback: return a static ref
  return ref(false)
}

/**
 * Composable for syncing D2 themes with Slidev's dark mode
 *
 * @example
 * ```ts
 * const { activeThemeId, isDark } = useDarkModeTheme({
 *   theme: toRef(props, 'theme'),
 *   darkTheme: toRef(props, 'darkTheme'),
 *   autoSyncDarkMode: toRef(props, 'autoSyncDarkMode'),
 * })
 * ```
 */
export function useDarkModeTheme(options: UseDarkModeThemeOptions) {
  // Local dark mode state
  const isDark = ref(false)

  // Initialize Slidev dark mode detection once
  if (!initializationPromise) {
    initializationPromise = initSlidevDarkMode().then((darkRef) => {
      slidevDarkRef = darkRef
    })
  }

  // Set up reactivity once Slidev is initialized
  initializationPromise.then(() => {
    if (slidevDarkRef) {
      // Use watchEffect to sync with Slidev's dark mode
      watchEffect(() => {
        isDark.value = slidevDarkRef!.value
      })
    }
  })

  /**
   * Compute the active theme ID based on current dark mode state
   */
  const activeThemeId = computed<number>(() => {
    const autoSync = options.autoSyncDarkMode?.value ?? true

    if (autoSync && isDark.value) {
      // Dark mode: use dark theme settings
      return resolveThemeId(
        options.darkThemeId?.value,
        options.darkTheme?.value,
        DEFAULT_DARK_THEME_ID,
      )
    }

    // Light mode or no auto-sync: use light theme settings
    return resolveThemeId(options.themeId?.value, options.theme?.value, DEFAULT_LIGHT_THEME_ID)
  })

  return {
    /** Whether Slidev is currently in dark mode */
    isDark,
    /** The resolved theme ID to use for D2 rendering */
    activeThemeId,
  }
}

/**
 * Reset initialization state (useful for testing)
 */
export function resetDarkModeInit(): void {
  slidevDarkRef = null
  initializationPromise = null
}
