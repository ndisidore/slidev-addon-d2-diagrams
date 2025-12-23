<template>
  <div
    class="d2-diagram-container"
    :style="containerStyle"
    role="img"
    :aria-label="ariaLabel"
    :aria-busy="loading"
  >
    <div v-if="loading" class="d2-loading" aria-live="polite">
      <slot name="loading">Loading diagram...</slot>
    </div>
    <div v-else-if="error" class="d2-error" role="alert">
      <slot name="error" :error="error">Error rendering diagram: {{ error }}</slot>
    </div>
    <div v-else v-html="svgContent" class="d2-diagram"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef, watch } from 'vue'
import { useD2Compiler } from './useD2Compiler'
import { useDarkModeTheme } from './useDarkModeTheme'
import type { D2DiagramProps } from './types'
import { D2_DIAGRAM_DEFAULTS } from './types'

const props = withDefaults(defineProps<D2DiagramProps>(), {
  autoSyncDarkMode: D2_DIAGRAM_DEFAULTS.autoSyncDarkMode,
  sketch: D2_DIAGRAM_DEFAULTS.sketch,
  center: D2_DIAGRAM_DEFAULTS.center,
  scale: D2_DIAGRAM_DEFAULTS.scale,
  pad: D2_DIAGRAM_DEFAULTS.pad,
  layoutEngine: D2_DIAGRAM_DEFAULTS.layoutEngine,
  forceAppendix: D2_DIAGRAM_DEFAULTS.forceAppendix,
  inputPath: D2_DIAGRAM_DEFAULTS.inputPath,
  maxWidth: D2_DIAGRAM_DEFAULTS.maxWidth,
  maxHeight: D2_DIAGRAM_DEFAULTS.maxHeight,
})

const emit = defineEmits<{
  /** Emitted when diagram is successfully compiled */
  (e: 'compiled', svg: string): void
  /** Emitted when compilation fails */
  (e: 'error', error: string): void
}>()

// Dark mode theme integration
const { activeThemeId } = useDarkModeTheme({
  themeId: toRef(props, 'themeId'),
  theme: toRef(props, 'theme'),
  darkThemeId: toRef(props, 'darkThemeId'),
  darkTheme: toRef(props, 'darkTheme'),
  autoSyncDarkMode: toRef(props, 'autoSyncDarkMode'),
})

// D2 compilation
const { svgContent, error, loading } = useD2Compiler({
  code: toRef(props, 'code'),
  themeId: activeThemeId,
  darkThemeId: toRef(props, 'darkThemeId'),
  sketch: toRef(props, 'sketch'),
  center: toRef(props, 'center'),
  scale: toRef(props, 'scale'),
  pad: toRef(props, 'pad'),
  layoutEngine: toRef(props, 'layoutEngine'),
  animateInterval: toRef(props, 'animateInterval'),
  target: toRef(props, 'target'),
  fs: toRef(props, 'fs'),
  inputPath: toRef(props, 'inputPath'),
  forceAppendix: toRef(props, 'forceAppendix'),
})

// Emit events on state changes
watch(svgContent, (svg) => {
  if (svg) emit('compiled', svg)
})

watch(error, (err) => {
  if (err) emit('error', err)
})

// Container styling
const containerStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  if (props.maxWidth) {
    style.maxWidth = props.maxWidth
  }
  if (props.maxHeight) {
    style.maxHeight = props.maxHeight
  }

  return style
})

// Accessibility label
const ariaLabel = computed(() => {
  if (!props.code) return 'D2 Diagram'
  // Create a brief description from the first line of code
  const firstLine = props.code.split('\n')[0].trim()
  const truncated = firstLine.length > 50 ? `${firstLine.slice(0, 50)}...` : firstLine
  return `D2 Diagram: ${truncated}`
})
</script>

<style scoped>
.d2-diagram-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  overflow: hidden;
}

.d2-loading {
  color: #666;
  font-style: italic;
}

.d2-error {
  color: #e74c3c;
  font-family: monospace;
  background: #fdf2f2;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
  max-width: 100%;
  overflow-wrap: break-word;
}

.d2-diagram {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.d2-diagram :deep(svg) {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
}
</style>
