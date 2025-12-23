/**
 * D2 Theme catalog mapping
 * Reference: https://d2lang.com/tour/themes/
 */
export const D2_THEMES = {
  // Light themes
  'neutral-default': 0,
  'neutral-grey': 1,
  'flagship-terrastruct': 3,
  'cool-classics': 4,
  'mixed-berry-blue': 5,
  'grape-soda': 6,
  aubergine: 7,
  'colorblind-clear': 8,
  'vanilla-nitro-cola': 100,
  'orange-creamsicle': 101,
  'shirley-temple': 102,
  'earth-tones': 103,
  'everglade-green': 104,
  'buttered-toast': 105,
  // Special themes
  terminal: 300,
  'terminal-grayscale': 301,
  origami: 302,
  // Dark themes
  'dark-mauve': 200,
  'dark-flagship-terrastruct': 201,
} as const

export type D2ThemeName = keyof typeof D2_THEMES
export type D2ThemeId = (typeof D2_THEMES)[D2ThemeName]

export type LayoutEngine = 'dagre' | 'elk'

/**
 * File system mapping for D2 imports
 * Keys are file paths, values are D2 code content
 */
export type D2FileSystem = Record<string, string>

/**
 * Props for the D2Diagram component
 */
export interface D2DiagramProps {
  /** D2 diagram source code (required) */
  code: string

  // Theme options
  /** Numeric theme ID (takes precedence over theme name) */
  themeId?: number
  /** Named theme from D2_THEMES */
  theme?: D2ThemeName
  /** Numeric theme ID for dark mode */
  darkThemeId?: number
  /** Named theme for dark mode */
  darkTheme?: D2ThemeName
  /** Automatically sync theme with Slidev dark mode (default: true) */
  autoSyncDarkMode?: boolean

  // Rendering options
  /** Enable sketch/hand-drawn style (default: false) */
  sketch?: boolean
  /** Center the diagram (default: true) */
  center?: boolean
  /** Scale factor for output (default: 1) */
  scale?: number
  /** Padding around diagram in pixels (default: 100) */
  pad?: number
  /** Layout engine to use (default: 'dagre') */
  layoutEngine?: LayoutEngine

  // Animation options (for multi-board diagrams)
  /** Milliseconds between boards for animation */
  animateInterval?: number
  /** Specific board to render (for multi-board diagrams) */
  target?: string

  // Import support
  /** Virtual file system for D2 imports */
  fs?: D2FileSystem
  /** Main input file path when using fs (default: 'index.d2') */
  inputPath?: string

  // Output options
  /** Add appendix for tooltips and links (default: false) */
  forceAppendix?: boolean

  // Container sizing
  /** Fixed container width */
  width?: string | number
  /** Fixed container height */
  height?: string | number
  /** Maximum container width (default: '100%') */
  maxWidth?: string
  /** Maximum container height (default: '500px') */
  maxHeight?: string
  /** Scale diagram to fit within container bounds (default: false) */
  fit?: boolean
}

/**
 * Default values for D2DiagramProps
 */
export const D2_DIAGRAM_DEFAULTS = {
  autoSyncDarkMode: true,
  sketch: false,
  center: true,
  scale: 1,
  pad: 100,
  layoutEngine: 'dagre' as LayoutEngine,
  forceAppendix: false,
  inputPath: 'index.d2',
  maxWidth: '100%',
  maxHeight: '500px',
  fit: false,
} as const

/**
 * Default light theme ID
 */
export const DEFAULT_LIGHT_THEME_ID = D2_THEMES['neutral-default']

/**
 * Default dark theme ID
 */
export const DEFAULT_DARK_THEME_ID = D2_THEMES['dark-mauve']

/**
 * Resolve a theme name to its numeric ID
 */
export function resolveThemeId(
  themeId?: number,
  themeName?: D2ThemeName,
  defaultId: number = DEFAULT_LIGHT_THEME_ID,
): number {
  if (themeId !== undefined) return themeId
  if (themeName && themeName in D2_THEMES) {
    return D2_THEMES[themeName]
  }
  return defaultId
}
