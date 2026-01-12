# MCP Apps Demo

Interactive app demos built with [CopilotKit](https://copilotkit.ai) and [MCP Apps](https://github.com/modelcontextprotocol/ext-apps) — showcasing the MCP Apps Extension (SEP-1865) for rendering interactive UIs directly in the chat.

## Featured Apps

| App | Description | Example Prompt |
|-----|-------------|----------------|
| **🏋️ Fitness Coach** | Workout generator with exercise cards, timers, progress | "Create a 20 minute upper body workout" |
| **🍳 Recipe Chef** | Recipe finder with ingredients, steps, nutrition | "Find a quick Italian vegetarian recipe" |
| **📈 Investment Simulator** | Portfolio trading with charts, buy/sell | "Create a $10,000 tech portfolio" |
| **📋 Kanban Board** | Task board with drag-drop cards | "Create a kanban for my project" |

## About This Project

**What This Is:**
- Educational demo showing how to build MCP Apps that render in CopilotKit chat
- Reference for bidirectional communication between chat UI and MCP servers
- Example of tool-to-UI linking via resource metadata

**What This Is NOT:**
- Production applications
- Medical, financial, or professional advice

**Use this to:**
- Learn MCP Apps + CopilotKit integration patterns
- See how interactive UIs can be embedded in chat experiences
- Understand the MCP Apps protocol (JSON-RPC over postMessage)

---

## Quick Start

### Prerequisites
- Node.js 20+
- At least one LLM API key (OpenAI, Anthropic, or Google)

### 1. Install dependencies

```bash
# Frontend
npm install

# MCP Server
cd mcp-server && npm install && cd ..
```

### 2. Configure API keys

Create `.env.local`:

```bash
OPENAI_API_KEY=sk-...
# Or use Anthropic/Google
# ANTHROPIC_API_KEY=sk-ant-...
# GOOGLE_API_KEY=...
```

### 3. Build the MCP App UI

```bash
cd mcp-server && npm run build && cd ..
```

### 4. Start development servers

Terminal 1 - MCP Server:
```bash
cd mcp-server && npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **MCP Server**: http://localhost:3001

---

## Key Features

**Multiple Interactive Apps:**
- 4 distinct MCP Apps demonstrating different UI patterns
- Each app renders directly in the chat sidebar
- AI automatically selects the right app based on your request

**Bidirectional Communication:**
- UIs call MCP tools to update data
- Server responds with updated state
- Real-time UI updates without page refresh

**Rich UI Patterns:**
- Forms, checkboxes, buttons (Recipe Chef)
- CSS-only charts - bar and pie (Investment Simulator)
- HTML5 drag-drop (Kanban Board)
- Timers and animations (Fitness Coach)

---

## How CopilotKit Powers This App

### MCPAppsMiddleware - MCP Server Integration

Connects CopilotKit to MCP servers and discovers UI-enabled tools:

```typescript
const agent = new BasicAgent({
  model: "openai/gpt-4o",
  prompt: "You are an AI Fitness Coach..."
}).use(new MCPAppsMiddleware({
  mcpServers: [
    { type: "http", url: "http://localhost:3001/mcp" }
  ],
}));
```

**Why this matters:** The middleware automatically intercepts tool calls with UI resources, fetches the HTML, and emits activity snapshots for rendering.

### CopilotSidebar - Chat Interface

Provides the chat UI where MCP Apps render:

```tsx
<CopilotKitProvider runtimeUrl="/api/copilotkit" showDevConsole="auto">
  <CopilotSidebar defaultOpen={true} width="50%" />
</CopilotKitProvider>
```

**Why this matters:** MCP Apps render as iframes inside the chat, with full bidirectional communication to the MCP server.

---

## How MCP Apps Work Here

### What are MCP Apps?

[MCP Apps](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/) are interactive HTML/JS applications served by MCP servers that render in sandboxed iframes. They communicate with the host via JSON-RPC over postMessage.

### Tool-to-UI Linking

Tools declare their UI resource via `_meta`:

```typescript
server.registerTool("workout-generator", {
  title: "Generate Workout",
  inputSchema: { duration, focus, equipment, difficulty },
  _meta: {
    "ui/resourceUri": "ui://fitness/workout-app.html"
  },
}, async (params) => ({
  content: [{ type: "text", text: "Workout generated!" }],
  structuredContent: { workout, summary }
}));
```

**Why this matters:** When the AI calls `workout-generator`, the middleware fetches the linked HTML resource and renders it in the chat.

### Resource Registration

HTML templates are registered with `mimeType: "text/html+mcp"`:

```typescript
server.registerResource("fitness-app-template", "ui://fitness/workout-app.html", {
  mimeType: "text/html+mcp",
  title: "Fitness App",
  description: "Interactive workout UI"
}, async () => ({
  contents: [{ uri, mimeType: "text/html+mcp", text: bundledHtml }]
}));
```

**Why this matters:** The special MIME type tells the host that this resource should be rendered as an interactive UI, not displayed as text.

### Bidirectional Communication

The MCP App communicates with the server via JSON-RPC:

```javascript
// Call another MCP tool from the UI
async function callTool(name, args) {
  return mcpApp.sendRequest("tools/call", { name, arguments: args });
}

// Example: Complete an exercise (Fitness Coach)
await callTool("log-exercise-complete", { workoutId, exerciseId });

// Example: Move a card (Kanban Board)
await callTool("move-card", { boardId, cardId, targetColumnId, position: 0 });

// Example: Execute a trade (Investment Simulator)
await callTool("execute-trade", { portfolioId, symbol: "AAPL", action: "buy", quantity: 10 });
```

**Why this matters:** The UI isn't just display — it can trigger server-side actions and receive real-time updates.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                         │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │   Welcome Page      │  │   CopilotKit Sidebar        │  │
│  │   (instructions)    │  │   ┌─────────────────────┐   │  │
│  │                     │  │   │ Chat Messages       │   │  │
│  │                     │  │   │ ┌─────────────────┐ │   │  │
│  │                     │  │   │ │ MCP App iframe  │ │   │  │
│  │                     │  │   │ │ (any of 4 apps) │ │   │  │
│  │                     │  │   │ └─────────────────┘ │   │  │
│  │                     │  │   └─────────────────────┘   │  │
│  └─────────────────────┘  └─────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │ BasicAgent + MCPAppsMiddleware
┌───────────────────────────┴─────────────────────────────────┐
│                     MCP Server (:3001)                       │
│                                                              │
│  Tools:                       Resources:                     │
│  - workout-generator          - ui://fitness/workout-app    │
│  - generate-recipe            - ui://recipe/recipe-app      │
│  - create-portfolio           - ui://trading/trading-app    │
│  - create-board               - ui://kanban/kanban-app      │
│  + helper tools for each      (all mimeType: text/html+mcp) │
│                                                              │
│  Data: exercises, recipes, stocks, board templates          │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User asks "Create a 20 minute upper body workout"
2. AI calls `workout-generator` tool with parameters
3. MCPAppsMiddleware intercepts, executes tool, fetches UI resource
4. Activity snapshot emitted with HTML content
5. CopilotKit renders fitness app iframe in chat
6. User interacts with exercise cards, timer
7. UI calls `log-exercise-complete` via postMessage
8. Server processes, UI updates

---

## Project Structure

```
├── src/
│   └── app/
│       ├── page.tsx                    # Welcome page + CopilotSidebar
│       ├── layout.tsx                  # Root layout
│       └── api/copilotkit/[[...slug]]/ # BasicAgent + MCPAppsMiddleware
├── public/
│   └── sandbox.html                    # Security proxy for iframes
├── mcp-server/
│   ├── server.ts                       # MCP server with all tools/resources
│   ├── src/
│   │   ├── exercises.ts                # Exercise database (21 exercises)
│   │   ├── workout-logic.ts            # Workout generation logic
│   │   ├── recipes.ts                  # Recipe database (12 recipes)
│   │   ├── stocks.ts                   # Stock/portfolio logic (18 stocks)
│   │   └── kanban.ts                   # Board/card logic (4 templates)
│   └── apps/
│       ├── fitness-app.html            # Fitness Coach UI
│       ├── recipe-app.html             # Recipe Chef UI
│       ├── trading-app.html            # Investment Simulator UI
│       ├── kanban-app.html             # Kanban Board UI
│       ├── vite.config.ts              # Bundles all apps to single HTML
│       └── dist/                       # Built outputs
└── package.json
```

---

## Environment Variables

### Frontend (`.env.local`)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (preferred) |
| `ANTHROPIC_API_KEY` | Anthropic API key (alternative) |
| `GOOGLE_API_KEY` | Google API key (alternative) |
| `MCP_SERVER_URL` | MCP server URL (default: `http://localhost:3001/mcp`) |

The app auto-detects which API key is available and uses it.

---

## Tech Stack

**Frontend:**
- Next.js 16
- React 19
- CopilotKit (via `@copilotkitnext/*` packages)
- Tailwind CSS 4

**MCP Server:**
- Node.js 20+
- Express 5
- @modelcontextprotocol/sdk
- Vite + vite-plugin-singlefile

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js frontend |
| `npm run build` | Build for production |
| `cd mcp-server && npm run dev` | Start MCP server (dev mode) |
| `cd mcp-server && npm run build` | Build MCP app UI |
| `cd mcp-server && npm start` | Start MCP server (production) |

---

## Troubleshooting

**Chat not loading:**
- Verify API key is set in `.env.local`
- Check browser console for errors
- Ensure MCP server is running on port 3001

**Workout UI not rendering:**
- Verify MCP server is running: `curl http://localhost:3001/health`
- Check MCP server logs for errors
- Ensure `mcp-server/apps/dist/fitness-app.html` exists (run `npm run build` in mcp-server)

**Timer not working:**
- Browser tab must be focused for accurate timing
- Check for JavaScript errors in iframe console

---

## Learning Resources

**CopilotKit:**
- [CopilotKit Docs](https://docs.copilotkit.ai)
- [Connect MCP Servers](https://docs.copilotkit.ai/connect-mcp-servers)

**MCP Apps:**
- [MCP Apps Announcement](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)
- [SEP-1865 Spec](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1865)
- [ext-apps SDK](https://github.com/modelcontextprotocol/ext-apps)

**MCP Protocol:**
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

---

## License

MIT
