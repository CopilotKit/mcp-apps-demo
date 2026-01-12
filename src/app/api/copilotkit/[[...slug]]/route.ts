/**
 * CopilotKit API route with MCP Apps middleware.
 * Connects to the fitness coach MCP server and enables UI-enabled tools.
 *
 * Reference: v2.x/apps/react/demo/src/app/api/copilotkit-mcp/[[...slug]]/route.ts
 */

import { CopilotRuntime, createCopilotEndpoint, InMemoryAgentRunner } from "@copilotkitnext/runtime";
import { handle } from "hono/vercel";
import { BasicAgent } from "@copilotkitnext/agent";
import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware";

// Determine which LLM model to use based on available API keys
const determineModel = () => {
  if (process.env.OPENAI_API_KEY?.trim()) {
    return "openai/gpt-5.2";
  }
  if (process.env.ANTHROPIC_API_KEY?.trim()) {
    return "anthropic/claude-sonnet-4.5";
  }
  if (process.env.GOOGLE_API_KEY?.trim()) {
    return "google/gemini-2.5-pro";
  }
  return "openai/gpt-5.2";
};

// Create the agent with multi-app assistant persona and MCP Apps middleware
const agent = new BasicAgent({
  model: determineModel(),
  prompt: `You are an AI assistant with access to 4 interactive apps that render in the chat. Each app provides a rich UI for specific tasks.

## Available Apps

### 1. Fitness Coach (workout-generator)
Create personalized workouts with interactive exercise cards, timers, and progress tracking.
- Parameters: duration (15/30/45/60 min), focus (full_body/upper_body/lower_body/cardio/core), equipment (none/dumbbells/full_gym), difficulty (beginner/intermediate/advanced)
- Example: "Create a 30 minute upper body workout for beginners with no equipment"

### 2. Recipe Chef (generate-recipe)
Find recipes with ingredients checklist, step-by-step instructions, and nutrition info.
- Parameters: cuisine (italian/mexican/asian/american/mediterranean), dietary (none/vegetarian/vegan/gluten-free/keto), servings (1-12), maxTime (prep+cook in minutes)
- Example: "Find a quick Italian vegetarian recipe for 4 people"

### 3. Investment Simulator (create-portfolio)
Create mock investment portfolios with holdings, charts, and trading.
- Parameters: initialBalance (1000-1000000), riskTolerance (conservative/moderate/aggressive), focus (tech/healthcare/diversified/growth/dividend)
- Example: "Create a $10,000 aggressive tech-focused portfolio"

### 4. Kanban Board (create-board)
Create task boards with drag-drop cards and columns.
- Parameters: projectName (string), template (blank/software/marketing/personal)
- Example: "Create a kanban board for my software project"

## Guidelines
- When a user's request matches an app, use the appropriate tool to render the interactive UI
- Ask clarifying questions if key parameters are missing
- Each app has helper tools for interactions (adjust workout, execute trade, move card, etc.)
- Be helpful and guide users through the interactive features`,
  temperature: 0.7,
}).use(new MCPAppsMiddleware({
  mcpServers: [
    { type: "http", url: process.env.MCP_SERVER_URL || "http://localhost:3001/mcp" }
  ],
}));

// Create CopilotKit runtime
const runtime = new CopilotRuntime({
  agents: {
    default: agent,
  },
  runner: new InMemoryAgentRunner(),
});

// Create Hono endpoint
const app = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handle(app);
export const POST = handle(app);
