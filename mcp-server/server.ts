/**
 * MCP Server for AI Fitness Coach demo.
 * Registers workout-generator tool with fitness-app UI resource.
 *
 * Pattern from: v2.x/apps/react/demo/mcp-apps/server.ts
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import express, { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolResult,
  isInitializeRequest,
  ReadResourceResult,
  Resource,
} from "@modelcontextprotocol/sdk/types.js";
import { InMemoryEventStore } from "@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js";
import cors from "cors";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Import workout logic
import {
  generateWorkout,
  adjustWorkoutDifficulty,
  completeExercise,
  skipExercise,
  getWorkoutProgress,
  getNextExercise,
  Workout,
} from "./src/workout-logic.js";
import { getExerciseById } from "./src/exercises.js";

// Import recipe logic
import {
  generateRecipe,
  adjustServings as adjustRecipeServings,
  getRecipeById,
  Recipe,
} from "./src/recipes.js";

// Import trading logic
import {
  createPortfolio,
  executeTrade,
  refreshPrices,
  getStocks,
  Portfolio,
} from "./src/stocks.js";

// Import kanban logic
import {
  createBoard,
  addCard,
  updateCard,
  deleteCard,
  moveCard,
  Board,
} from "./src/kanban.js";

// MCP Apps Extension protocol constant
const RESOURCE_URI_META_KEY = "ui/resourceUri";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store active workouts by session (in production, use proper storage)
const activeWorkouts: Map<string, Workout> = new Map();

// Store active recipes by session
const activeRecipes: Map<string, Recipe> = new Map();

// Store active portfolios by session
const activePortfolios: Map<string, Portfolio> = new Map();

// Store active boards by session
const activeBoards: Map<string, Board> = new Map();

// Load UI HTML file from apps/dist/
const loadHtml = async (name: string): Promise<string> => {
  const htmlPath = path.join(__dirname, "apps", "dist", `${name}.html`);
  try {
    return await fs.readFile(htmlPath, "utf-8");
  } catch {
    // Return placeholder HTML if not yet built
    return `<!DOCTYPE html>
<html>
<head><title>${name}</title></head>
<body>
  <div style="padding: 20px; font-family: system-ui;">
    <h2>Fitness App Loading...</h2>
    <p>The fitness app UI needs to be built. Run:</p>
    <code>npm run build:app</code>
  </div>
</body>
</html>`;
  }
};

// Create the MCP server instance
const getServer = async () => {
  const server = new McpServer(
    {
      name: "fitness-coach-mcp-server",
      version: "1.0.0",
    },
    { capabilities: { logging: {} } }
  );

  // Load app HTML files
  const fitnessAppHtml = await loadHtml("fitness-app");
  const recipeAppHtml = await loadHtml("recipe-app");
  const tradingAppHtml = await loadHtml("trading-app");
  const kanbanAppHtml = await loadHtml("kanban-app");

  // Helper to register a resource
  const registerResource = (resource: Resource, htmlContent: string) => {
    server.registerResource(
      resource.name,
      resource.uri,
      resource,
      async (): Promise<ReadResourceResult> => ({
        contents: [
          {
            uri: resource.uri,
            mimeType: resource.mimeType,
            text: htmlContent,
          },
        ],
      })
    );
    return resource;
  };

  // Register the fitness app UI resource
  const fitnessResource = registerResource(
    {
      name: "fitness-app-template",
      uri: "ui://fitness/workout-app.html",
      title: "Fitness App",
      description: "Interactive workout UI with exercise cards, timer, and progress tracking",
      mimeType: "text/html+mcp",
    },
    fitnessAppHtml
  );

  // Register the recipe app UI resource
  const recipeResource = registerResource(
    {
      name: "recipe-app-template",
      uri: "ui://recipe/recipe-app.html",
      title: "Recipe Chef",
      description: "Interactive recipe UI with ingredients checklist, steps, and nutrition info",
      mimeType: "text/html+mcp",
    },
    recipeAppHtml
  );

  // Register the trading app UI resource
  const tradingResource = registerResource(
    {
      name: "trading-app-template",
      uri: "ui://trading/trading-app.html",
      title: "Investment Simulator",
      description: "Interactive portfolio UI with holdings, charts, and trading",
      mimeType: "text/html+mcp",
    },
    tradingAppHtml
  );

  // Register the kanban app UI resource
  const kanbanResource = registerResource(
    {
      name: "kanban-app-template",
      uri: "ui://kanban/kanban-app.html",
      title: "Kanban Board",
      description: "Interactive task board with drag-drop cards and columns",
      mimeType: "text/html+mcp",
    },
    kanbanAppHtml
  );

  // Register workout-generator tool (main tool with UI)
  server.registerTool(
    "workout-generator",
    {
      title: "Generate Workout",
      description:
        "Generates a personalized workout based on duration, focus area, equipment, and difficulty. Returns an interactive UI for the workout.",
      inputSchema: {
        duration: z
          .number()
          .describe("Workout duration in minutes (15, 30, 45, or 60)"),
        focus: z
          .enum(["full_body", "upper_body", "lower_body", "cardio", "core"])
          .describe("Focus area for the workout"),
        equipment: z
          .enum(["none", "dumbbells", "full_gym"])
          .describe("Available equipment level"),
        difficulty: z
          .enum(["beginner", "intermediate", "advanced"])
          .describe("Difficulty level"),
      },
      _meta: {
        [RESOURCE_URI_META_KEY]: fitnessResource.uri,
      },
    },
    async ({ duration, focus, equipment, difficulty }): Promise<CallToolResult> => {
      // Generate the workout
      const workout = generateWorkout({
        duration: duration as 15 | 30 | 45 | 60,
        focus,
        equipment,
        difficulty,
      });

      // Store workout for later modifications
      activeWorkouts.set(workout.id, workout);

      // Return both text summary and structured content for UI
      const exerciseList = workout.exercises
        .map((we) => `- ${we.exercise.icon} ${we.exercise.name}: ${we.sets}×${we.reps}`)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Generated ${workout.actualDurationMinutes} minute ${focus} workout (${difficulty}):\n\n${exerciseList}\n\nEstimated calories: ${workout.totalCalories}`,
          },
        ],
        structuredContent: {
          workout,
          summary: {
            exerciseCount: workout.exercises.length,
            duration: workout.actualDurationMinutes,
            calories: workout.totalCalories,
            focus: workout.focusArea,
            difficulty: workout.difficulty,
          },
        },
      };
    }
  );

  // Register log-exercise-complete tool (helper for UI callbacks)
  server.registerTool(
    "log-exercise-complete",
    {
      title: "Log Exercise Complete",
      description: "Records that an exercise has been completed in the current workout",
      inputSchema: {
        workoutId: z.string().describe("The workout ID"),
        exerciseId: z.string().describe("The exercise ID that was completed"),
        setsCompleted: z.number().describe("Number of sets actually completed"),
        feedback: z.string().optional().describe("Optional feedback about the exercise"),
      },
    },
    async ({ workoutId, exerciseId, setsCompleted, feedback }): Promise<CallToolResult> => {
      const workout = activeWorkouts.get(workoutId);
      if (!workout) {
        return {
          content: [{ type: "text", text: `Workout ${workoutId} not found.` }],
          structuredContent: { success: false, error: "Workout not found" },
        };
      }

      // Update the workout
      const updatedWorkout = completeExercise(workout, exerciseId, setsCompleted);
      activeWorkouts.set(workoutId, updatedWorkout);

      const progress = getWorkoutProgress(updatedWorkout);
      const nextExercise = getNextExercise(updatedWorkout);
      const exercise = getExerciseById(exerciseId);

      return {
        content: [
          {
            type: "text",
            text: `Completed ${exercise?.name || exerciseId} (${setsCompleted} sets). Progress: ${progress}%${
              feedback ? ` Feedback: ${feedback}` : ""
            }`,
          },
        ],
        structuredContent: {
          success: true,
          progress,
          nextExercise: nextExercise
            ? {
                id: nextExercise.exercise.id,
                name: nextExercise.exercise.name,
                sets: nextExercise.sets,
                reps: nextExercise.reps,
              }
            : null,
          isComplete: progress === 100,
        },
      };
    }
  );

  // Register adjust-workout tool (helper for making workout harder/easier)
  server.registerTool(
    "adjust-workout",
    {
      title: "Adjust Workout",
      description: "Modifies the current workout to make it harder, easier, or skip an exercise",
      inputSchema: {
        workoutId: z.string().describe("The workout ID"),
        modification: z
          .enum(["harder", "easier", "skip"])
          .describe("Type of modification"),
        exerciseId: z
          .string()
          .optional()
          .describe("Exercise ID (required for skip)"),
      },
    },
    async ({ workoutId, modification, exerciseId }): Promise<CallToolResult> => {
      const workout = activeWorkouts.get(workoutId);
      if (!workout) {
        return {
          content: [{ type: "text", text: `Workout ${workoutId} not found.` }],
          structuredContent: { success: false, error: "Workout not found" },
        };
      }

      let updatedWorkout: Workout;
      let message: string;

      if (modification === "skip") {
        if (!exerciseId) {
          return {
            content: [{ type: "text", text: "Exercise ID required for skip." }],
            structuredContent: { success: false, error: "Exercise ID required" },
          };
        }
        updatedWorkout = skipExercise(workout, exerciseId);
        const exercise = getExerciseById(exerciseId);
        message = `Skipped ${exercise?.name || exerciseId}. Workout now has ${updatedWorkout.exercises.length} exercises.`;
      } else {
        updatedWorkout = adjustWorkoutDifficulty(workout, modification);
        message = `Made workout ${modification}. New estimated duration: ${updatedWorkout.actualDurationMinutes} minutes.`;
      }

      activeWorkouts.set(workoutId, updatedWorkout);

      return {
        content: [{ type: "text", text: message }],
        structuredContent: {
          success: true,
          updatedWorkout,
          message,
        },
      };
    }
  );

  // ============================================
  // RECIPE CHEF TOOLS
  // ============================================

  // Register generate-recipe tool (main tool with UI)
  server.registerTool(
    "generate-recipe",
    {
      title: "Generate Recipe",
      description:
        "Generates a recipe based on cuisine, dietary preferences, and time constraints. Returns an interactive UI for the recipe.",
      inputSchema: {
        cuisine: z
          .enum(["italian", "mexican", "asian", "american", "mediterranean"])
          .describe("Type of cuisine"),
        dietary: z
          .enum(["none", "vegetarian", "vegan", "gluten-free", "keto"])
          .describe("Dietary restriction"),
        servings: z
          .number()
          .min(1)
          .max(12)
          .describe("Number of servings (1-12)"),
        maxTime: z
          .number()
          .describe("Maximum total time in minutes (prep + cook)"),
      },
      _meta: {
        [RESOURCE_URI_META_KEY]: recipeResource.uri,
      },
    },
    async ({ cuisine, dietary, servings, maxTime }): Promise<CallToolResult> => {
      // Generate the recipe
      const recipe = generateRecipe({
        cuisine,
        dietary,
        maxTime,
        servings,
      });

      // Store recipe for later modifications
      activeRecipes.set(recipe.id, recipe);

      // Build ingredient list summary
      const ingredientList = recipe.ingredients
        .slice(0, 5)
        .map((ing) => `${ing.amount} ${ing.unit} ${ing.name}`)
        .join(", ");

      const totalTime = recipe.prepTime + recipe.cookTime;

      return {
        content: [
          {
            type: "text",
            text: `Found recipe: ${recipe.icon} ${recipe.name}\n\n${recipe.description}\n\nTime: ${totalTime} min | Servings: ${recipe.servings} | Difficulty: ${recipe.difficulty}\n\nKey ingredients: ${ingredientList}...`,
          },
        ],
        structuredContent: {
          recipe,
          summary: {
            name: recipe.name,
            totalTime,
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            cuisine: recipe.cuisine,
          },
        },
      };
    }
  );

  // Register adjust-servings tool (helper for UI callbacks)
  server.registerTool(
    "adjust-servings",
    {
      title: "Adjust Servings",
      description: "Adjusts recipe ingredient amounts for a different number of servings",
      inputSchema: {
        recipeId: z.string().describe("The recipe ID"),
        newServings: z.number().min(1).max(12).describe("New number of servings"),
      },
    },
    async ({ recipeId, newServings }): Promise<CallToolResult> => {
      const recipe = activeRecipes.get(recipeId) || getRecipeById(recipeId);
      if (!recipe) {
        return {
          content: [{ type: "text", text: `Recipe ${recipeId} not found.` }],
          structuredContent: { success: false, error: "Recipe not found" },
        };
      }

      // Adjust the recipe
      const adjustedRecipe = adjustRecipeServings(recipe, newServings);

      // Update stored recipe
      activeRecipes.set(recipeId, adjustedRecipe);

      return {
        content: [
          {
            type: "text",
            text: `Adjusted ${recipe.name} to ${newServings} servings.`,
          },
        ],
        structuredContent: {
          success: true,
          recipe: adjustedRecipe,
        },
      };
    }
  );

  // ============================================
  // INVESTMENT SIMULATOR TOOLS
  // ============================================

  // Register create-portfolio tool (main tool with UI)
  server.registerTool(
    "create-portfolio",
    {
      title: "Create Portfolio",
      description:
        "Creates an investment portfolio based on initial balance, risk tolerance, and focus area. Returns an interactive UI for trading.",
      inputSchema: {
        initialBalance: z
          .number()
          .min(1000)
          .max(1000000)
          .describe("Starting cash balance (1000-1000000)"),
        riskTolerance: z
          .enum(["conservative", "moderate", "aggressive"])
          .describe("Risk tolerance level"),
        focus: z
          .enum(["tech", "healthcare", "diversified", "growth", "dividend"])
          .describe("Portfolio focus area"),
      },
      _meta: {
        [RESOURCE_URI_META_KEY]: tradingResource.uri,
      },
    },
    async ({ initialBalance, riskTolerance, focus }): Promise<CallToolResult> => {
      // Create the portfolio
      const { portfolio, availableStocks } = createPortfolio({
        initialBalance,
        riskTolerance,
        focus,
      });

      // Store portfolio for later trades
      activePortfolios.set(portfolio.id, portfolio);

      // Build holdings summary
      const holdingsSummary = portfolio.holdings
        .slice(0, 3)
        .map((h) => `${h.symbol}: ${h.shares} shares`)
        .join(", ");

      const plSign = portfolio.totalProfitLoss >= 0 ? "+" : "";

      return {
        content: [
          {
            type: "text",
            text: `Created ${focus} portfolio ($${initialBalance.toLocaleString()}, ${riskTolerance} risk):\n\nTotal Value: $${portfolio.totalValue.toLocaleString()}\nP/L: ${plSign}$${portfolio.totalProfitLoss.toFixed(2)}\nCash: $${portfolio.cash.toLocaleString()}\n\nHoldings: ${holdingsSummary}...`,
          },
        ],
        structuredContent: {
          portfolio,
          availableStocks,
          summary: {
            totalValue: portfolio.totalValue,
            profitLoss: portfolio.totalProfitLoss,
            cash: portfolio.cash,
            holdingsCount: portfolio.holdings.length,
            allocation: portfolio.allocation,
          },
        },
      };
    }
  );

  // Register execute-trade tool (helper for UI callbacks)
  server.registerTool(
    "execute-trade",
    {
      title: "Execute Trade",
      description: "Buys or sells shares of a stock in the portfolio",
      inputSchema: {
        portfolioId: z.string().describe("The portfolio ID"),
        symbol: z.string().describe("Stock symbol to trade"),
        action: z.enum(["buy", "sell"]).describe("Trade action"),
        quantity: z.number().min(1).describe("Number of shares"),
      },
    },
    async ({ portfolioId, symbol, action, quantity }): Promise<CallToolResult> => {
      const result = executeTrade(portfolioId, symbol, action, quantity);

      if (!result.success) {
        return {
          content: [{ type: "text", text: result.message }],
          structuredContent: { success: false, error: result.message },
        };
      }

      // Update stored portfolio
      if (result.portfolio) {
        activePortfolios.set(portfolioId, result.portfolio);
      }

      // Get available stocks for the UI
      const allStocks = getStocks();
      const holdingSymbols = new Set(result.portfolio?.holdings.map((h) => h.symbol) || []);
      const availableStocks = allStocks.filter((s) => !holdingSymbols.has(s.symbol));

      return {
        content: [{ type: "text", text: result.message }],
        structuredContent: {
          success: true,
          trade: result.trade,
          portfolio: result.portfolio,
          availableStocks,
        },
      };
    }
  );

  // Register refresh-prices tool (helper for UI)
  server.registerTool(
    "refresh-prices",
    {
      title: "Refresh Prices",
      description: "Simulates market movement by updating stock prices",
      inputSchema: {
        portfolioId: z.string().describe("The portfolio ID"),
      },
    },
    async ({ portfolioId }): Promise<CallToolResult> => {
      const result = refreshPrices(portfolioId);

      if (!result) {
        return {
          content: [{ type: "text", text: `Portfolio ${portfolioId} not found.` }],
          structuredContent: { success: false, error: "Portfolio not found" },
        };
      }

      // Update stored portfolio
      activePortfolios.set(portfolioId, result.portfolio);

      const plSign = result.portfolio.totalProfitLoss >= 0 ? "+" : "";

      return {
        content: [
          {
            type: "text",
            text: `Prices refreshed. Portfolio: $${result.portfolio.totalValue.toLocaleString()} (${plSign}$${result.portfolio.totalProfitLoss.toFixed(2)})`,
          },
        ],
        structuredContent: {
          success: true,
          portfolio: result.portfolio,
          availableStocks: result.availableStocks,
        },
      };
    }
  );

  // ============================================
  // KANBAN BOARD TOOLS
  // ============================================

  // Register create-board tool (main tool with UI)
  server.registerTool(
    "create-board",
    {
      title: "Create Kanban Board",
      description:
        "Creates a kanban board for project management with customizable columns and cards. Returns an interactive drag-drop UI.",
      inputSchema: {
        projectName: z.string().describe("Name for the project board"),
        template: z
          .enum(["blank", "software", "marketing", "personal"])
          .describe("Board template with pre-configured columns and sample cards"),
      },
      _meta: {
        [RESOURCE_URI_META_KEY]: kanbanResource.uri,
      },
    },
    async ({ projectName, template }): Promise<CallToolResult> => {
      // Create the board
      const board = createBoard(projectName, template);

      // Store board for later operations
      activeBoards.set(board.id, board);

      const totalCards = board.columns.reduce((sum, c) => sum + c.cards.length, 0);

      return {
        content: [
          {
            type: "text",
            text: `Created "${projectName}" board (${template} template):\n\nColumns: ${board.columns.map((c) => c.name).join(", ")}\nTotal cards: ${totalCards}`,
          },
        ],
        structuredContent: {
          board,
          summary: {
            name: board.name,
            columnsCount: board.columns.length,
            cardsCount: totalCards,
            template,
          },
        },
      };
    }
  );

  // Register move-card tool (helper for drag-drop)
  server.registerTool(
    "move-card",
    {
      title: "Move Card",
      description: "Moves a card to a different column on the board",
      inputSchema: {
        boardId: z.string().describe("The board ID"),
        cardId: z.string().describe("The card ID to move"),
        targetColumnId: z.string().describe("Target column ID"),
        position: z.number().optional().describe("Position in column (default: end)"),
      },
    },
    async ({ boardId, cardId, targetColumnId, position }): Promise<CallToolResult> => {
      const result = moveCard(boardId, cardId, targetColumnId, position);

      if (!result.success) {
        return {
          content: [{ type: "text", text: result.message }],
          structuredContent: { success: false, error: result.message },
        };
      }

      // Update stored board
      if (result.board) {
        activeBoards.set(boardId, result.board);
      }

      return {
        content: [{ type: "text", text: result.message }],
        structuredContent: {
          success: true,
          board: result.board,
          card: result.card,
        },
      };
    }
  );

  // Register add-card tool (helper for UI)
  server.registerTool(
    "add-card",
    {
      title: "Add Card",
      description: "Adds a new card to a column",
      inputSchema: {
        boardId: z.string().describe("The board ID"),
        columnId: z.string().describe("The column ID"),
        title: z.string().describe("Card title"),
        description: z.string().optional().describe("Card description"),
        priority: z.enum(["low", "medium", "high"]).optional().describe("Card priority"),
      },
    },
    async ({ boardId, columnId, title, description, priority }): Promise<CallToolResult> => {
      const result = addCard(boardId, columnId, {
        title,
        description,
        priority: priority || "medium",
        tags: [],
      });

      if (!result.success) {
        return {
          content: [{ type: "text", text: result.message }],
          structuredContent: { success: false, error: result.message },
        };
      }

      // Update stored board
      if (result.board) {
        activeBoards.set(boardId, result.board);
      }

      return {
        content: [{ type: "text", text: result.message }],
        structuredContent: {
          success: true,
          board: result.board,
          card: result.card,
        },
      };
    }
  );

  // Register update-card tool (helper for UI)
  server.registerTool(
    "update-card",
    {
      title: "Update Card",
      description: "Updates an existing card's title, description, or priority",
      inputSchema: {
        boardId: z.string().describe("The board ID"),
        cardId: z.string().describe("The card ID"),
        updates: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
            priority: z.enum(["low", "medium", "high"]).optional(),
          })
          .describe("Fields to update"),
      },
    },
    async ({ boardId, cardId, updates }): Promise<CallToolResult> => {
      const result = updateCard(boardId, cardId, updates);

      if (!result.success) {
        return {
          content: [{ type: "text", text: result.message }],
          structuredContent: { success: false, error: result.message },
        };
      }

      // Update stored board
      if (result.board) {
        activeBoards.set(boardId, result.board);
      }

      return {
        content: [{ type: "text", text: result.message }],
        structuredContent: {
          success: true,
          board: result.board,
          card: result.card,
        },
      };
    }
  );

  // Register delete-card tool (helper for UI)
  server.registerTool(
    "delete-card",
    {
      title: "Delete Card",
      description: "Removes a card from the board",
      inputSchema: {
        boardId: z.string().describe("The board ID"),
        cardId: z.string().describe("The card ID to delete"),
      },
    },
    async ({ boardId, cardId }): Promise<CallToolResult> => {
      const result = deleteCard(boardId, cardId);

      if (!result.success) {
        return {
          content: [{ type: "text", text: result.message }],
          structuredContent: { success: false, error: result.message },
        };
      }

      // Update stored board
      if (result.board) {
        activeBoards.set(boardId, result.board);
      }

      return {
        content: [{ type: "text", text: result.message }],
        structuredContent: {
          success: true,
          board: result.board,
          deletedCard: result.card,
        },
      };
    }
  );

  return server;
};

// Express server setup
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id"],
  })
);

// Session management for MCP connections
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// MCP POST handler - main entry point for MCP requests
const mcpPostHandler = async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  try {
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // Existing session
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New session initialization - eventStore enables resumability for MCP Apps
      const eventStore = new InMemoryEventStore();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        eventStore,
        onsessioninitialized: (sid) => {
          console.log(`[MCP] Session initialized: ${sid}`);
          transports[sid] = transport;
        },
      });

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports[sid]) {
          console.log(`[MCP] Session closed: ${sid}`);
          delete transports[sid];
        }
      };

      const server = await getServer();
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    } else {
      // Invalid request
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Bad Request: No valid session ID" },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("[MCP] Error handling request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
};

// Routes
app.post("/mcp", mcpPostHandler);

app.get("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }
  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
});

app.delete("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }
  try {
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error("[MCP] Error handling session termination:", error);
    if (!res.headersSent) {
      res.status(500).send("Error processing session termination");
    }
  }
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    server: "fitness-coach-mcp",
    sessions: Object.keys(transports).length,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[Fitness Coach MCP Server] Running at http://localhost:${PORT}/mcp`);
  console.log(`[Health Check] http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n[MCP] Shutting down...");
  for (const sessionId in transports) {
    try {
      await transports[sessionId].close();
      delete transports[sessionId];
    } catch (error) {
      console.error(`[MCP] Error closing session ${sessionId}:`, error);
    }
  }
  process.exit(0);
});
