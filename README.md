# slidev-addon-d2-diagrams

A [Slidev](https://sli.dev/) addon for rendering [D2](https://d2lang.com/) diagrams in your presentations with full theme support, dark mode sync, and animations.

## Features

- Render D2 diagrams directly in Slidev presentations
- Automatic dark mode theme sync with Slidev
- Support for all D2 themes (20+ built-in themes)
- Sketch/hand-drawn mode
- Multi-board animations
- File imports (`@import` directive support)
- Multiple layout engines (dagre, elk)
- Reactive updates when code changes
- TypeScript support

## Installation

```bash
npm install slidev-addon-d2-diagrams
```

## Usage

Add the addon to your `slides.md` frontmatter:

```yaml
---
addons:
  - slidev-addon-d2-diagrams
---
```

Then use the `D2Diagram` component in your slides:

```vue
<D2Diagram code="A -> B: Hello World" />
```

## Props

### Required

| Prop | Type | Description |
|------|------|-------------|
| `code` | `string` | D2 diagram source code |

### Theme Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `themeId` | `number` | - | Numeric theme ID (takes precedence over `theme`) |
| `theme` | `string` | - | Named theme (see [Available Themes](#available-themes)) |
| `darkThemeId` | `number` | `200` | Theme ID for dark mode |
| `darkTheme` | `string` | - | Named theme for dark mode |
| `autoSyncDarkMode` | `boolean` | `true` | Sync theme with Slidev dark mode |

### Rendering Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sketch` | `boolean` | `false` | Enable sketch/hand-drawn style |
| `center` | `boolean` | `true` | Center the diagram |
| `scale` | `number` | `1` | Scale factor for output |
| `pad` | `number` | `100` | Padding around diagram (pixels) |
| `layoutEngine` | `'dagre' \| 'elk'` | `'dagre'` | Layout algorithm |

### Animation Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animateInterval` | `number` | - | Milliseconds between boards (for multi-board diagrams) |
| `target` | `string` | - | Specific board to render (e.g., `'layers.x.*'`) |

### Import Support

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fs` | `Record<string, string>` | - | Virtual file system for D2 imports |
| `inputPath` | `string` | `'index.d2'` | Main input file path when using `fs` |

### Output Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `forceAppendix` | `boolean` | `false` | Add appendix for tooltips/links |

### Container Sizing

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string \| number` | - | Fixed container width |
| `height` | `string \| number` | - | Fixed container height |
| `maxWidth` | `string` | `'100%'` | Maximum container width |
| `maxHeight` | `string` | `'500px'` | Maximum container height |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `compiled` | `string` (SVG) | Emitted when diagram is successfully compiled |
| `error` | `string` | Emitted when compilation fails |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `loading` | - | Custom loading state |
| `error` | `{ error: string }` | Custom error state |

## Available Themes

### Light Themes
- `neutral-default` (0)
- `neutral-grey` (1)
- `flagship-terrastruct` (3)
- `cool-classics` (4)
- `mixed-berry-blue` (5)
- `grape-soda` (6)
- `aubergine` (7)
- `colorblind-clear` (8)
- `vanilla-nitro-cola` (100)
- `orange-creamsicle` (101)
- `shirley-temple` (102)
- `earth-tones` (103)
- `everglade-green` (104)
- `buttered-toast` (105)
- `terminal` (300)
- `terminal-grayscale` (301)
- `origami` (302)

### Dark Themes
- `dark-mauve` (200)
- `dark-flagship-terrastruct` (201)

## Examples

### Basic Diagram

```vue
<D2Diagram code="client -> server: Request" />
```

### With Theme

```vue
<D2Diagram
  code="A -> B -> C"
  theme="grape-soda"
  dark-theme="dark-mauve"
/>
```

### Sketch Mode

```vue
<D2Diagram
  code="user -> app: Login"
  sketch
/>
```

### With Animation (Multi-board)

```vue
<D2Diagram
  :code="`
    layers: {
      step1: { A }
      step2: { A -> B }
      step3: { A -> B -> C }
    }
  `"
  target="*"
  :animate-interval="1000"
/>
```

### With File Imports

```vue
<D2Diagram
  code="main: @import 'shared.d2'"
  :fs="{ 'shared.d2': 'x: {shape: circle}' }"
/>
```

### Custom Loading/Error States

```vue
<D2Diagram code="A -> B">
  <template #loading>
    <span>Rendering diagram...</span>
  </template>
  <template #error="{ error }">
    <span style="color: red">Failed: {{ error }}</span>
  </template>
</D2Diagram>
```

### ELK Layout Engine

```vue
<D2Diagram
  code="A -> B; B -> C; C -> A"
  layout-engine="elk"
/>
```

## Dark Mode

By default, the component automatically syncs with Slidev's dark mode. When Slidev is in dark mode, the diagram will use the `darkTheme` or `darkThemeId` prop (defaulting to `dark-mauve`).

To disable auto-sync:

```vue
<D2Diagram
  code="A -> B"
  :auto-sync-dark-mode="false"
  theme="terminal"
/>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format:fix
```

## License

MIT
