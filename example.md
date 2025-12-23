---
background: null
highlighter: shiki
css: unocss
mdc: true
transition: fade
colorSchema: auto
addons:
  - ./slidev-addon-d2-diagrams
---

# slidev-addon-d2-diagrams

D2 diagram addon for Slidev with theme support and dark mode sync

<div class="mt-4"></div>

---

# Usage

Install the addon via npm:

```bash
npm i slidev-addon-d2-diagrams
```

Add the `addons` option in your [headmatter](https://sli.dev/custom/#headmatter):

```yaml
---
addons:
  - slidev-addon-d2-diagrams
---
```

Then use the `<D2Diagram>` component in your slides:

```vue
<D2Diagram code="A -> B: Hello World" />
```

<D2Diagram code="A -> B: Hello World" />

---

# Basic Diagrams

Simple connections and shapes:

<D2Diagram code="x -> y: hello world" />

---

# Themes

Use the `theme` prop with named themes:

<div class="grid grid-cols-2 gap-4">
<div>

**Grape Soda**

<D2Diagram code="A -> B" theme="grape-soda" max-height="150px" fit />

</div>
<div>

**Terminal**

<D2Diagram code="A -> B" theme="terminal" max-height="150px" fit />

</div>
</div>

---

# Dark Mode Support

The component automatically syncs with Slidev's dark mode.

<D2Diagram
  code="client -> server: Request"
  theme="flagship-terrastruct"
  dark-theme="dark-flagship-terrastruct"
  max-height="200px"
/>

---

# Sketch Mode

Enable hand-drawn style with the `sketch` prop:

<div class="grid grid-cols-2 gap-4">
<div>

**Normal**

<D2Diagram code="A -> B -> C" max-height="180px" />

</div>
<div>

**Sketch**

<D2Diagram code="A -> B -> C" sketch max-height="180px" />

</div>
</div>

---

# Database Schema

<script setup>
const databaseSchema = `users: {
  shape: sql_table
  id: int {constraint: primary_key}
  name: string
  email: string
}

posts: {
  shape: sql_table
  id: int {constraint: primary_key}
  user_id: int {constraint: foreign_key}
  title: string
  content: text
}

users.id -> posts.user_id`
</script>

<D2Diagram
  :code="databaseSchema"
  theme="cool-classics"
  dark-theme="dark-mauve"
  max-height="350px"
/>

---

# System Architecture

<script setup>
const microservicesArch = `direction: right

client: Client App {
  shape: rectangle
  style.fill: '#e1f5fe'
}

api: API Gateway {
  shape: hexagon
  style.fill: '#f3e5f5'
}

auth: Auth Service {
  shape: oval
  style.fill: '#e8f5e8'
}

client -> api: HTTP Request
api -> auth: Validate Token
auth -> api: Token Valid
api -> client: Response`
</script>

<D2Diagram
  :code="microservicesArch"
  max-height="350px"
/>

---

# Network Topology

<script setup>
const networkTopology = `internet: Internet {
  shape: cloud
  style.fill: lightblue
}

router: Router {
  shape: diamond
}

switch: Switch

server1: Web Server 1 {
  shape: rectangle
  style.fill: lightgreen
}

server2: Web Server 2 {
  shape: rectangle
  style.fill: lightgreen
}

db: Database {
  shape: cylinder
  style.fill: orange
}

internet -> router
router -> switch
switch -> server1
switch -> server2
server1 -> db
server2 -> db`
</script>

<D2Diagram
  :code="networkTopology"
  theme="earth-tones"
  dark-theme="dark-mauve"
  max-height="380px"
/>

---

# Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | required | D2 diagram source |
| `theme` | `string` | - | Named theme |
| `dark-theme` | `string` | - | Dark mode theme |
| `sketch` | `boolean` | `false` | Hand-drawn style |
| `layout-engine` | `string` | `dagre` | `dagre` or `elk` |
| `max-height` | `string` | `500px` | Max container height |
| `fit` | `boolean` | `false` | Scale diagram to fit container |

---

# Learn More

- [D2 Language Documentation](https://d2lang.com/)
- [Slidev Documentation](https://sli.dev/)
- [Source Code](https://github.com/ndisidore/slidev-addon-d2-diagrams)

Create beautiful diagrams in your Slidev presentations!
