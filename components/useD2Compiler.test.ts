import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'

// Mock D2 - must be before importing useD2Compiler
const mockCompile = vi.fn()
const mockRender = vi.fn()

vi.mock('@terrastruct/d2', () => {
  return {
    D2: class MockD2 {
      compile = mockCompile
      render = mockRender
    },
  }
})

// Import after mock is set up
import { useD2Compiler } from './useD2Compiler'

describe('useD2Compiler', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementations
    mockCompile.mockResolvedValue({
      diagram: { name: 'test' },
      renderOptions: {},
    })
    mockRender.mockResolvedValue('<svg>mocked</svg>')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('initializes with loading state for non-empty code', () => {
    // Use non-empty code to test loading state (empty code resolves immediately)
    const code = ref('A -> B')
    const themeId = ref(0)

    const { loading, svgContent, error } = useD2Compiler({ code, themeId })

    // Initially loading before async compile completes
    expect(loading.value).toBe(true)
    expect(svgContent.value).toBe('')
    expect(error.value).toBe(null)
  })

  it('skips compilation for empty code', async () => {
    const code = ref('')
    const themeId = ref(0)

    const { loading, svgContent, error } = useD2Compiler({ code, themeId })

    await nextTick()
    await nextTick()

    expect(loading.value).toBe(false)
    expect(svgContent.value).toBe('')
    expect(error.value).toBe(null)
    expect(mockCompile).not.toHaveBeenCalled()
  })

  it('compiles code and returns SVG', async () => {
    const code = ref('A -> B')
    const themeId = ref(0)

    const { loading, svgContent, error } = useD2Compiler({ code, themeId })

    await nextTick()
    await nextTick()

    expect(loading.value).toBe(false)
    expect(svgContent.value).toBe('<svg>mocked</svg>')
    expect(error.value).toBe(null)
    expect(mockCompile).toHaveBeenCalledWith('A -> B', { options: expect.any(Object) })
    expect(mockRender).toHaveBeenCalled()
  })

  it('handles compilation errors gracefully', async () => {
    mockCompile.mockRejectedValue(new Error('Syntax error'))

    const code = ref('invalid code {{{')
    const themeId = ref(0)

    const { loading, svgContent, error } = useD2Compiler({ code, themeId })

    await nextTick()
    await nextTick()

    expect(loading.value).toBe(false)
    expect(svgContent.value).toBe('')
    expect(error.value).toBe('Syntax error')
  })

  it('recompiles when code changes', async () => {
    const code = ref('A -> B')
    const themeId = ref(0)

    useD2Compiler({ code, themeId })

    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledTimes(1)

    // Change code
    code.value = 'C -> D'
    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledTimes(2)
    expect(mockCompile).toHaveBeenLastCalledWith('C -> D', { options: expect.any(Object) })
  })

  it('recompiles when theme changes', async () => {
    const code = ref('A -> B')
    const themeId = ref(0)

    useD2Compiler({ code, themeId })

    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledTimes(1)

    // Change theme
    themeId.value = 200
    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledTimes(2)
  })

  it('applies compile options correctly', async () => {
    const code = ref('A -> B')
    const themeId = ref(6)
    const sketch = ref(true)
    const layoutEngine = ref<'dagre' | 'elk'>('elk')

    useD2Compiler({
      code,
      themeId,
      sketch,
      layoutEngine,
    })

    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledWith('A -> B', {
      options: {
        sketch: true,
        themeID: 6,
        darkThemeID: undefined,
        center: true,
        scale: 1,
        pad: 100,
        layout: 'elk',
      },
    })
  })

  it('supports file system imports', async () => {
    const code = ref('main content')
    const themeId = ref(0)
    const fs = ref({
      'imported.d2': 'x: {shape: circle}',
    })
    const inputPath = ref('main.d2')

    useD2Compiler({
      code,
      themeId,
      fs,
      inputPath,
    })

    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledWith({
      fs: {
        'imported.d2': 'x: {shape: circle}',
        'main.d2': 'main content',
      },
      inputPath: 'main.d2',
      options: expect.any(Object),
    })
  })

  it('applies render options correctly', async () => {
    const code = ref('A -> B')
    const themeId = ref(0)
    const animateInterval = ref(1000)
    const target = ref('layers.x.*')
    const forceAppendix = ref(true)

    useD2Compiler({
      code,
      themeId,
      animateInterval,
      target,
      forceAppendix,
    })

    await nextTick()
    await nextTick()

    expect(mockRender).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        animateInterval: 1000,
        target: 'layers.x.*',
        forceAppendix: true,
        noXMLTag: true,
      })
    )
  })

  it('exposes compile function for manual recompilation', async () => {
    const code = ref('A -> B')
    const themeId = ref(0)

    const { compile } = useD2Compiler({ code, themeId })

    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledTimes(1)

    // Manually trigger recompile
    await compile()

    expect(mockCompile).toHaveBeenCalledTimes(2)
  })

  it('exposes compiled diagram for advanced use', async () => {
    const mockDiagram = { name: 'test-diagram', shapes: [] }
    mockCompile.mockResolvedValue({
      diagram: mockDiagram,
      renderOptions: {},
    })

    const code = ref('A -> B')
    const themeId = ref(0)

    const { diagram } = useD2Compiler({ code, themeId })

    await nextTick()
    await nextTick()

    expect(diagram.value).toEqual(mockDiagram)
  })
})
