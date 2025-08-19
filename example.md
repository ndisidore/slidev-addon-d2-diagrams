---
theme: seriph
background: null
highlighter: shiki
css: unocss
mdc: true
transition: fade
colorSchema: light
addons:
  - slidev-addon-d2-diagrams
---

# slidev-addon-d2-diagrams

D2 diagram addon for Slidev

{.mt-4!}

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

Then you can use the `<D2Diagram>` component in your slides:

```vue
<D2Diagram code="A -> B: Hello World" />
```

<D2Diagram code="A -> B: Hello World" />

---

# Basic Diagrams

Simple connections and shapes:

<D2Diagram code="
x -> y: hello world
y -> z: good bye
z -> x: see you later
" />

---

# System Architecture

<D2Diagram code="
users: Users {
shape: person
style.multiple: true
}

load_balancer: Load Balancer {
shape: diamond
}

web_servers: Web Servers {
shape: rectangle
style.multiple: true
}

database: Database {
shape: cylinder
}

cache: Redis Cache {
shape: oval
}

users -> load_balancer: HTTPS requests
load_balancer -> web_servers: Route traffic
web_servers -> database: Query data
web_servers -> cache: Cache lookup
cache -> web_servers: Cached data
database -> web_servers: Fresh data
" />

---

# Styling Options

You can customize the appearance with various props:

<D2Diagram 
  code="
  A: Server {
    style.fill: lightblue
    style.stroke: blue
  }
  B: Client {
    style.fill: lightgreen
    style.stroke: green
  }
  A -> B: API Call {
    style.stroke: red
    style.stroke-width: 3
  }
  "
  sketch="true"
  theme="default"
  maxHeight="300px"
/>

---

# Network Topology

<D2Diagram code="
internet: Internet {
shape: cloud
style.fill: lightblue
}

router: Router {
shape: diamond
}

switch: Switch {
shape: rectangle
}

server1: Web Server 1 {
shape: rectangle
style.fill: lightgreen
}

server2: Web Server 2 {
shape: rectangle
style.fill: lightgreen
}

server3: Database Server {
shape: cylinder
style.fill: orange
}

internet -> router: WAN
router -> switch: LAN
switch -> server1: 192.168.1.10
switch -> server2: 192.168.1.11
switch -> server3: 192.168.1.20

server1 -> server3: DB Query
server2 -> server3: DB Query
" />

---

# Sequence Diagram

<D2Diagram code="
shape: sequence_diagram

user: User
frontend: Frontend
backend: Backend
db: Database

user -> frontend: Login request
frontend -> backend: Authenticate
backend -> db: Check credentials
db -> backend: User data
backend -> frontend: JWT token
frontend -> user: Login success
" />

---

# Component Props

The `<D2Diagram>` component supports various customization options:

- `code`: D2 diagram code (required)
- `theme`: Diagram theme (default: 'default')
- `sketch`: Enable sketch mode (default: false)
- `center`: Center the diagram (default: true)
- `scale`: Scale factor (default: 1)
- `pad`: Padding around diagram (default: 16)
- `width`, `height`: Fixed dimensions
- `maxWidth`, `maxHeight`: Maximum dimensions

---

# Advanced Example

<D2Diagram
code="
direction: right

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

users: User Service {
shape: rectangle
style.fill: '#fff3e0'
}

orders: Order Service {
shape: rectangle
style.fill: '#fce4ec'
}

db: Database {
shape: cylinder
style.fill: '#f1f8e9'
}

client -> api: HTTP Request
api -> auth: Validate Token
auth -> api: Token Valid
api -> users: Get User Data
api -> orders: Get Orders
users -> db: Query Users
orders -> db: Query Orders
db -> users: User Data
db -> orders: Order Data
users -> api: Response
orders -> api: Response
api -> client: JSON Response
"
center="true"
maxHeight="400px"
/>

---

# Learn More

- [D2 Language Documentation](https://d2lang.com/)
- [Slidev Documentation](https://sli.dev/)
- [Plugin Source Code](https://github.com/your-repo/slidev-addon-d2-diagrams)

Create beautiful, interactive diagrams in your Slidev presentations!
