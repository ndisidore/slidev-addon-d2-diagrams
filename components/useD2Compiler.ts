import { ref, watch, shallowRef, type Ref, type ComputedRef } from 'vue'
import { D2, type CompileOptions, type RenderOptions, type Diagram } from '@terrastruct/d2'
import type { LayoutEngine, D2FileSystem } from './types'

export interface UseD2CompilerOptions {
  /** D2 diagram source code */
  code: Ref<string> | ComputedRef<string>
  /** Theme ID to use */
  themeId: Ref<number> | ComputedRef<number>
  /** Theme ID for dark mode (optional) */
  darkThemeId?: Ref<number | undefined> | ComputedRef<number | undefined>
  /** Enable sketch mode */
  sketch?: Ref<boolean> | ComputedRef<boolean>
  /** Center the diagram */
  center?: Ref<boolean> | ComputedRef<boolean>
  /** Scale factor */
  scale?: Ref<number> | ComputedRef<number>
  /** Padding around diagram */
  pad?: Ref<number> | ComputedRef<number>
  /** Layout engine */
  layoutEngine?: Ref<LayoutEngine> | ComputedRef<LayoutEngine>
  /** Animation interval for multi-board diagrams */
  animateInterval?: Ref<number | undefined> | ComputedRef<number | undefined>
  /** Target board to render */
  target?: Ref<string | undefined> | ComputedRef<string | undefined>
  /** Virtual file system for imports */
  fs?: Ref<D2FileSystem | undefined> | ComputedRef<D2FileSystem | undefined>
  /** Input path when using fs */
  inputPath?: Ref<string> | ComputedRef<string>
  /** Add appendix for tooltips/links */
  forceAppendix?: Ref<boolean> | ComputedRef<boolean>
}

export interface UseD2CompilerReturn {
  /** Rendered SVG content */
  svgContent: Ref<string>
  /** Error message if compilation failed */
  error: Ref<string | null>
  /** Whether compilation is in progress */
  loading: Ref<boolean>
  /** The compiled diagram (for advanced use) */
  diagram: Ref<Diagram | null>
  /** Manually trigger recompilation */
  compile: () => Promise<void>
}

/**
 * Composable for compiling and rendering D2 diagrams
 *
 * @example
 * ```ts
 * const { svgContent, error, loading } = useD2Compiler({
 *   code: toRef(props, 'code'),
 *   themeId: activeThemeId,
 *   sketch: toRef(props, 'sketch'),
 * })
 * ```
 */
export function useD2Compiler(options: UseD2CompilerOptions): UseD2CompilerReturn {
  const svgContent = ref<string>('')
  const error = ref<string | null>(null)
  const loading = ref(true)
  const diagram = shallowRef<Diagram | null>(null)

  // Cache D2 instance for reuse
  const d2Instance = shallowRef<D2 | null>(null)

  /**
   * Get or create D2 instance
   */
  const getD2 = (): D2 => {
    if (!d2Instance.value) {
      d2Instance.value = new D2()
    }
    return d2Instance.value
  }

  /**
   * Build compile options from reactive refs
   */
  const buildCompileOptions = (): CompileOptions => {
    return {
      sketch: options.sketch?.value ?? false,
      themeID: options.themeId.value,
      darkThemeID: options.darkThemeId?.value,
      center: options.center?.value ?? true,
      scale: options.scale?.value ?? 1,
      pad: options.pad?.value ?? 100,
      layout: options.layoutEngine?.value ?? 'dagre',
    }
  }

  /**
   * Build render options from reactive refs
   */
  const buildRenderOptions = (): RenderOptions => {
    return {
      sketch: options.sketch?.value ?? false,
      themeID: options.themeId.value,
      darkThemeID: options.darkThemeId?.value,
      center: options.center?.value ?? true,
      scale: options.scale?.value ?? 1,
      pad: options.pad?.value ?? 100,
      animateInterval: options.animateInterval?.value,
      target: options.target?.value,
      forceAppendix: options.forceAppendix?.value ?? false,
      noXMLTag: true, // Always omit XML tag for HTML embedding
    }
  }

  /**
   * Compile and render the D2 diagram
   */
  const compile = async (): Promise<void> => {
    const codeValue = options.code.value

    // Skip if no code
    if (!codeValue?.trim()) {
      svgContent.value = ''
      error.value = null
      loading.value = false
      diagram.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      const d2 = getD2()
      const compileOpts = buildCompileOptions()
      const renderOpts = buildRenderOptions()

      let compileResult

      // Check if using file system imports
      if (options.fs?.value && Object.keys(options.fs.value).length > 0) {
        // Compile with file system
        const inputPath = options.inputPath?.value ?? 'index.d2'
        const fs = {
          ...options.fs.value,
          [inputPath]: codeValue,
        }
        compileResult = await d2.compile({
          fs,
          inputPath,
          options: compileOpts,
        })
      } else {
        compileResult = await d2.compile(codeValue, { options: compileOpts })
      }

      // Store the compiled diagram
      diagram.value = compileResult.diagram

      // Merge render options with any diagram-specific config
      const finalRenderOpts: RenderOptions = {
        ...renderOpts,
        ...compileResult.renderOptions,
        // Ensure our settings take precedence over diagram defaults
        themeID: renderOpts.themeID,
        darkThemeID: renderOpts.darkThemeID,
        sketch: renderOpts.sketch,
      }

      // Render to SVG
      const svg = await d2.render(compileResult.diagram, finalRenderOpts)
      svgContent.value = svg
    } catch (e) {
      console.error('D2Diagram: Compilation error', e)
      error.value = e instanceof Error ? e.message : 'Unknown compilation error'
      svgContent.value = ''
      diagram.value = null
    } finally {
      loading.value = false
    }
  }

  // Watch for changes and recompile
  watch(
    [
      options.code,
      options.themeId,
      () => options.darkThemeId?.value,
      () => options.sketch?.value,
      () => options.center?.value,
      () => options.scale?.value,
      () => options.pad?.value,
      () => options.layoutEngine?.value,
      () => options.animateInterval?.value,
      () => options.target?.value,
      () => options.fs?.value,
      () => options.forceAppendix?.value,
    ],
    () => {
      compile()
    },
    { immediate: true }
  )

  return {
    svgContent,
    error,
    loading,
    diagram,
    compile,
  }
}
