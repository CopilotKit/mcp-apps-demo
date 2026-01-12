"use client";

import { CopilotKitProvider, CopilotSidebar } from "@copilotkitnext/react";

export const dynamic = "force-dynamic";

export default function FitnessCoachPage() {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit" showDevConsole="auto">
      <AppLayout />
    </CopilotKitProvider>
  );
}

function AppLayout() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
        {/* Header */}
        <section className="space-y-4 text-center">
          <div className="text-6xl mb-2">💪</div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            AI Fitness Coach
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Get personalized workouts powered by AI. Just tell me your goals and I&apos;ll create
            an interactive workout that tracks your progress right in the chat.
          </p>
        </section>

        {/* Quick Start Guide */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Try These Prompts</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Create a 20 minute upper body workout for beginners with no equipment",
              "I want a 30 minute full body workout with dumbbells, intermediate level",
              "Give me a quick 15 minute cardio session",
              "I need a 45 minute leg day workout for advanced lifters",
            ].map((prompt, i) => (
              <div
                key={i}
                className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition"
              >
                &ldquo;{prompt}&rdquo;
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-slate-900 mb-2">Personalized</h3>
            <p className="text-sm text-slate-600">
              Workouts tailored to your equipment, time, and fitness level
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-3xl mb-3">⏱️</div>
            <h3 className="font-semibold text-slate-900 mb-2">Rest Timer</h3>
            <p className="text-sm text-slate-600">
              Built-in timer tracks rest periods between exercises
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-slate-900 mb-2">Progress Tracking</h3>
            <p className="text-sm text-slate-600">
              See your workout progress and celebrate when you finish
            </p>
          </div>
        </section>

        {/* MCP Apps Info */}
        <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">
          <p className="font-medium text-blue-900 mb-2">
            🔧 This demo showcases MCP Apps
          </p>
          <p className="text-blue-800">
            The workout UI renders directly in the chat using the MCP Apps Extension (SEP-1865).
            It communicates bidirectionally with the MCP server to track progress and modify workouts.
          </p>
          <p className="mt-2 text-xs text-blue-600">
            Make sure the MCP server is running: <code className="bg-blue-100 px-1 rounded">cd mcp-server && npm run dev</code>
          </p>
        </section>
      </main>

      {/* CopilotKit Sidebar */}
      <CopilotSidebar
        defaultOpen={true}
        width="50%"
        className="border-l border-slate-200"
      />
    </div>
  );
}
