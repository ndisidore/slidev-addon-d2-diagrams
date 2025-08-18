<template>
  <div class="d2-diagram-container" :style="containerStyle">
    <div v-if="loading" class="d2-loading">Loading diagram...</div>
    <div v-else-if="error" class="d2-error">Error rendering diagram: {{ error }}</div>
    <div v-else v-html="svgContent" class="d2-diagram"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { D2 } from '@terrastruct/d2'

interface Props {
  code: string
  theme?: string
  sketch?: boolean
  center?: boolean
  scale?: number
  pad?: number
  width?: string | number
  height?: string | number
  maxWidth?: string
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'default',
  sketch: false,
  center: true,
  scale: 1,
  pad: 16,
  maxWidth: '100%',
  maxHeight: '500px',
})

const loading = ref(true)
const error = ref<string | null>(null)
const svgContent = ref<string>('')

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

onMounted(async () => {
  try {
    const d2 = new D2()

    const compileResult = await d2.compile(props.code)

    const renderOptions = {
      sketch: props.sketch,
      center: props.center,
      scale: props.scale,
      pad: props.pad,
    }

    const svg = await d2.render(compileResult.diagram, renderOptions)
    svgContent.value = svg
  } catch (e) {
    console.error('D2Diagram: Error occurred', e)
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
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
