import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

// Mock D2 - must be before importing component
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

// Mock @slidev/client
vi.mock('@slidev/client', () => ({
  useDark: () => ({
    isDark: ref(false),
  }),
}))

// Import after mocks are set up
import D2Diagram from './D2Diagram.vue'

describe('D2Diagram', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockCompile.mockResolvedValue({
      diagram: { name: 'test' },
      renderOptions: {},
    })
    mockRender.mockResolvedValue('<svg><rect /></svg>')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders loading state initially', () => {
    const wrapper = mount(D2Diagram, {
      props: { code: 'A -> B' },
    })

    expect(wrapper.find('.d2-loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading diagram...')
  })

  it('renders SVG content after compilation', async () => {
    const wrapper = mount(D2Diagram, {
      props: { code: 'A -> B' },
    })

    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.find('.d2-loading').exists()).toBe(false)
    expect(wrapper.find('.d2-diagram').exists()).toBe(true)
    expect(wrapper.html()).toContain('<svg>')
  })

  it('shows error message on compilation failure', async () => {
    mockCompile.mockRejectedValue(new Error('Test error'))

    const wrapper = mount(D2Diagram, {
      props: { code: 'invalid' },
    })

    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.find('.d2-error').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test error')
  })

  it('emits compiled event on success', async () => {
    const wrapper = mount(D2Diagram, {
      props: { code: 'A -> B' },
    })

    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.emitted('compiled')).toBeTruthy()
    expect(wrapper.emitted('compiled')![0]).toEqual(['<svg><rect /></svg>'])
  })

  it('emits error event on failure', async () => {
    mockCompile.mockRejectedValue(new Error('Compilation failed'))

    const wrapper = mount(D2Diagram, {
      props: { code: 'invalid' },
    })

    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.emitted('error')).toBeTruthy()
    expect(wrapper.emitted('error')![0]).toEqual(['Compilation failed'])
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(D2Diagram, {
      props: { code: 'Server -> Database' },
    })

    const container = wrapper.find('.d2-diagram-container')
    expect(container.attributes('role')).toBe('img')
    expect(container.attributes('aria-label')).toContain('D2 Diagram')
    expect(container.attributes('aria-busy')).toBe('true')
  })

  it('updates aria-busy when loading completes', async () => {
    const wrapper = mount(D2Diagram, {
      props: { code: 'A -> B' },
    })

    expect(wrapper.find('.d2-diagram-container').attributes('aria-busy')).toBe('true')

    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.find('.d2-diagram-container').attributes('aria-busy')).toBe('false')
  })

  it('applies container styles correctly', () => {
    const wrapper = mount(D2Diagram, {
      props: {
        code: 'A -> B',
        width: 500,
        height: '400px',
        maxWidth: '800px',
        maxHeight: '600px',
      },
    })

    const container = wrapper.find('.d2-diagram-container')
    const style = container.attributes('style')

    expect(style).toContain('width: 500px')
    expect(style).toContain('height: 400px')
    expect(style).toContain('max-width: 800px')
    expect(style).toContain('max-height: 600px')
  })

  it('recompiles when code prop changes', async () => {
    const wrapper = mount(D2Diagram, {
      props: { code: 'A -> B' },
    })

    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledTimes(1)

    await wrapper.setProps({ code: 'C -> D' })
    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledTimes(2)
  })

  it('passes sketch mode to compiler', async () => {
    mount(D2Diagram, {
      props: {
        code: 'A -> B',
        sketch: true,
      },
    })

    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledWith('A -> B', {
      options: expect.objectContaining({ sketch: true }),
    })
  })

  it('passes theme to compiler', async () => {
    mount(D2Diagram, {
      props: {
        code: 'A -> B',
        themeId: 6,
      },
    })

    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledWith('A -> B', {
      options: expect.objectContaining({ themeID: 6 }),
    })
  })

  it('passes layout engine to compiler', async () => {
    mount(D2Diagram, {
      props: {
        code: 'A -> B',
        layoutEngine: 'elk',
      },
    })

    await nextTick()
    await nextTick()

    expect(mockCompile).toHaveBeenCalledWith('A -> B', {
      options: expect.objectContaining({ layout: 'elk' }),
    })
  })

  it('supports custom loading slot', () => {
    const wrapper = mount(D2Diagram, {
      props: { code: 'A -> B' },
      slots: {
        loading: '<span class="custom-loading">Please wait...</span>',
      },
    })

    expect(wrapper.find('.custom-loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('Please wait...')
  })

  it('supports custom error slot', async () => {
    mockCompile.mockRejectedValue(new Error('Custom error'))

    const wrapper = mount(D2Diagram, {
      props: { code: 'invalid' },
      slots: {
        error: '<span class="custom-error">Oops!</span>',
      },
    })

    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.find('.custom-error').exists()).toBe(true)
    expect(wrapper.text()).toContain('Oops!')
  })

  it('handles empty code gracefully', async () => {
    const wrapper = mount(D2Diagram, {
      props: { code: '' },
    })

    await nextTick()
    await nextTick()

    expect(wrapper.find('.d2-loading').exists()).toBe(false)
    expect(wrapper.find('.d2-error').exists()).toBe(false)
    expect(mockCompile).not.toHaveBeenCalled()
  })

  it('handles whitespace-only code gracefully', async () => {
    mount(D2Diagram, {
      props: { code: '   \n\t  ' },
    })

    await nextTick()
    await nextTick()

    expect(mockCompile).not.toHaveBeenCalled()
  })

  it('applies fit class when fit prop is true', async () => {
    const wrapper = mount(D2Diagram, {
      props: { code: 'A -> B', fit: true },
    })

    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.find('.d2-diagram.d2-fit').exists()).toBe(true)
  })

  it('does not apply fit class when fit prop is false', async () => {
    const wrapper = mount(D2Diagram, {
      props: { code: 'A -> B', fit: false },
    })

    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.find('.d2-diagram').exists()).toBe(true)
    expect(wrapper.find('.d2-diagram.d2-fit').exists()).toBe(false)
  })

  it('processes SVG to remove dimensions when fit is true', async () => {
    // D2 generates nested SVGs - outer has viewBox, inner has explicit dimensions
    mockRender.mockResolvedValue(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 258 600" preserveAspectRatio="xMinYMin meet">' +
        '<svg class="d2-inner" width="258" height="600" viewBox="-101 -101 258 600"><rect /></svg>' +
        '</svg>',
    )

    const wrapper = mount(D2Diagram, {
      props: { code: 'A -> B', fit: true },
    })

    await nextTick()
    await nextTick()
    await nextTick()

    const html = wrapper.html()
    // All explicit dimensions should be removed (CSS controls sizing)
    expect(html).not.toContain('width="258"')
    expect(html).not.toContain('height="600"')
    // ViewBox should be preserved
    expect(html).toContain('viewBox="0 0 258 600"')
  })

  it('preserves original SVG when fit is false', async () => {
    mockRender.mockResolvedValue('<svg width="277" height="455"><rect /></svg>')

    const wrapper = mount(D2Diagram, {
      props: { code: 'A -> B', fit: false },
    })

    await nextTick()
    await nextTick()
    await nextTick()

    const html = wrapper.html()
    expect(html).toContain('width="277"')
    expect(html).toContain('height="455"')
  })
})
