# slidev-addon-d2-diagrams

A Slidev addon for rendering D2 diagrams in your presentations.

## Installation

```bash
npm install slidev-addon-d2-diagrams
```

## Usage

Add the addon to your `slides.md`:

```yaml
---
addons:
  - d2-diagrams
---
```

Then use the D2Diagram component in your slides:

```vue
<D2Diagram :code="d2Code" />
```

### Props

- `code` (string, required): The D2 diagram code
- `theme` (string): Theme to use (default: 'default')
- `sketch` (boolean): Enable sketch mode (default: false)
- `center` (boolean): Center the diagram (default: true)
- `scale` (number): Scale factor (default: 1)
- `pad` (number): Padding around diagram (default: 16)
- `width` (string|number): Container width
- `height` (string|number): Container height
- `maxWidth` (string): Maximum width (default: '100%')
- `maxHeight` (string): Maximum height (default: '500px')

### Example

```vue
<D2Diagram
  :code="`
    server: Web Server
    client: Client
    client -> server: HTTP Request
    server -> client: HTTP Response
  `"
  sketch
  scale="1.2"
/>
```

## License

MIT
