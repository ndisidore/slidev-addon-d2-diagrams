import { describe, it, expect } from 'vitest'
import { D2 } from '@terrastruct/d2'

describe('D2 Component Integration', () => {
  it('should compile and render basic D2 diagram', async () => {
    const d2 = new D2()
    const testCode = 'A -> B: Hello World'

    const compileResult = await d2.compile(testCode)
    expect(compileResult).toBeDefined()
    expect(compileResult.diagram).toBeDefined()

    const svg = await d2.render(compileResult.diagram, {
      sketch: false,
      center: true,
      scale: 1,
      pad: 16,
    })

    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
    expect(svg.length).toBeGreaterThan(1000)
  })

  it('should handle styled diagrams', async () => {
    const d2 = new D2()
    const styledCode = `
      A: Server {
        style.fill: lightblue
        style.stroke: blue
      }
      B: Client {
        style.fill: lightgreen
        style.stroke: green
      }
      A -> B: API Call
    `

    const compileResult = await d2.compile(styledCode)
    const svg = await d2.render(compileResult.diagram, {
      sketch: false,
      center: true,
      scale: 1,
      pad: 16,
    })

    expect(svg).toContain('<svg')
    expect(svg).toContain('lightblue')
    expect(svg).toContain('lightgreen')
  })

  it('should handle sequence diagrams', async () => {
    const d2 = new D2()
    const sequenceCode = `
      shape: sequence_diagram
      
      user: User
      frontend: Frontend
      backend: Backend
      
      user -> frontend: Login request
      frontend -> backend: Authenticate
      backend -> frontend: JWT token
    `

    const compileResult = await d2.compile(sequenceCode)
    const svg = await d2.render(compileResult.diagram, {
      sketch: false,
      center: true,
      scale: 1,
      pad: 16,
    })

    expect(svg).toContain('<svg')
    expect(svg.length).toBeGreaterThan(5000)
  })

  it('should handle different shapes', async () => {
    const d2 = new D2()
    const shapesCode = `
      person: Person {
        shape: person
      }
      db: Database {
        shape: cylinder
      }
      cloud: Cloud Service {
        shape: cloud
      }
      
      person -> db: Query
      db -> cloud: Backup
    `

    const compileResult = await d2.compile(shapesCode)
    const svg = await d2.render(compileResult.diagram, {
      sketch: false,
      center: true,
      scale: 1,
      pad: 16,
    })

    expect(svg).toContain('<svg')
    expect(svg.length).toBeGreaterThan(3000)
  })

  it('should handle render options', async () => {
    const d2 = new D2()
    const testCode = 'A -> B: Test'

    const compileResult = await d2.compile(testCode)

    // Test sketch mode
    const sketchSvg = await d2.render(compileResult.diagram, {
      sketch: true,
      center: true,
      scale: 1,
      pad: 16,
    })

    // Test different scale
    const scaledSvg = await d2.render(compileResult.diagram, {
      sketch: false,
      center: true,
      scale: 2,
      pad: 32,
    })

    expect(sketchSvg).toContain('<svg')
    expect(scaledSvg).toContain('<svg')
    expect(sketchSvg).not.toEqual(scaledSvg)
  })
})
