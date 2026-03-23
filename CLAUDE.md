# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Ravenkeeper is a Blood on the Clocktower Storyteller assistant — a React app that helps a game moderator (Storyteller) run a session by managing players, assigning roles, and stepping through night phase actions.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint
npm run test      # Run all tests (vitest)
npx vitest run src/utils/gameLogic.test.js  # Run a single test file
```

## Architecture

All game state lives in a single `useReducer` in `App.jsx`, powered by `gameReducer` from `src/utils/gameLogic.js`. Everything flows down as props; components dispatch actions upward.

### Game State Shape

```js
{
  phase: 'setup' | 'preGame' | 'firstNight' | 'day' | 'otherNight',
  overlay: 'main' | 'grimoire' | 'role_info' | 'script_order',
  players: [{ name, dead, deadVoteUsed?, role? }],
  script: { name, roles, firstNight: [string], otherNight: [string] },
  roles: [...],          // active script's roles
  actionQueue: [action]  // drives the Night component step-by-step
}
```

Phase transitions follow: `setup → preGame → firstNight → day ↔ otherNight`.

The `overlay` field controls what's rendered. When `overlay === 'main'`, the `phase` determines the view. Any other overlay value renders that overlay on top (toggling the same overlay again returns to `'main'`).

### Night Action Queue

The `actionQueue` is built during phase transitions in `gameReducer`:
- `setup → preGame`: creates one action per player to reveal their role (preGame role reveal)
- `preGame → firstNight`: builds ordered actions from `script.firstNight`, which is an array of role names and special action names (`'Dusk'`, `'Dawn'`, `'Minion Info'`, `'Demon Info'`)

The `Night` component renders `actionQueue[0]`; `next_action` removes it.

### Script Data

Scripts are JSON files in `src/data/scripts/` and aggregated in `src/data/scripts/allScripts.js`. Each script has:
```json
{ "name": "...", "roles": [...], "firstNight": [...], "otherNight": [...] }
```
`firstNight`/`otherNight` arrays contain role names and special action names in wake-up order.

### Role Assignment

`assignRoles()` in `gameLogic.js` uses a `roleCounts` table indexed by `players.length - 5` (valid range: 5–15 players) to determine how many townsfolk/outsider/minion/demon roles to pick, then shuffles and assigns them.

### Key Files

- `src/utils/gameLogic.js` — `gameReducer`, `initialGame`, `assignRoles`, `shuffleArray`, phase transition logic
- `src/utils/gameHelper.js` — duplicate utility functions (in-progress extraction; prefer `gameLogic.js` as the source of truth for now)
- `src/App.jsx` — root component, owns all state, routes rendering by phase/overlay
- `src/components/Night.jsx` — renders the current action from `actionQueue`
- `src/components/Grimoire.jsx` — player list management + script selection (used in setup and day phases)
- `src/data/scripts/allScripts.js` — aggregates all script JSON files

## Design System

The app uses a **dark, content-focused design** — minimal chrome, high contrast text, and role-type color coding as the primary visual language. It's intended to be readable at arm's length on a laptop or tablet while the Storyteller runs a game.

### Stack

Tailwind CSS v4 via `@tailwindcss/vite`. No `tailwind.config.js` — Tailwind scans source files automatically. **Always write complete class name strings** (e.g. `bg-blue-950`) rather than constructing them dynamically (e.g. `` `bg-${color}-950` ``), or Tailwind will not include them in the build.

### Color Palette

| Token | Usage |
|---|---|
| `bg-slate-950` | Page background |
| `bg-slate-900` | Deep card / night action panels |
| `bg-slate-800` | Standard card (player rows, neutral panels) |
| `bg-slate-700` | Button backgrounds, secondary surfaces |
| `bg-indigo-600` | Primary action buttons (Start Game, Next, Add) |

### Role Type Colors

Defined in `src/utils/roleColors.js` and shared across all components that need them. Import from there — never redefine locally.

| Role type | Color | Tailwind class |
|---|---|---|
| Townsfolk | Dark blue | `bg-blue-950` |
| Outsider | Light blue | `bg-blue-800` |
| Minion | Light red | `bg-red-800` |
| Demon | Dark red | `bg-red-950` |

These colors are applied consistently in three places:
- **Player rows** in `PlayersDisplay` — the entire row background
- **Script order steps** in `ScriptOrder` — each step card; special actions (Dusk, Dawn, etc.) fall back to `bg-slate-700`
- **Hidden message reveal panel** in `Night` — the panel shown after tapping Reveal; the card itself stays `bg-slate-800`

### Layout

- Page: `min-h-screen bg-slate-950 flex flex-col items-center p-6`
- Content column: `w-full max-w-2xl flex flex-col gap-4` — 672px max, centered, items expand to fill it
- Bottom nav: three equal-width `flex-1` buttons in a `flex gap-2` row, always at the bottom of the column

### Component Conventions

- Cards/rows: `rounded-lg px-4 py-3` with one of the slate backgrounds
- Section containers: `flex flex-col gap-4` (between sections) or `gap-2` (between list items)
- Primary buttons: `bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium px-4 py-2 transition-colors`
- Secondary/ghost buttons: `bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors`
- Destructive (Kill): `bg-rose-800 hover:bg-rose-700`
- Warning (Dead Vote): `bg-amber-700 hover:bg-amber-600`
- Disabled/used: `bg-slate-700 text-slate-500 cursor-not-allowed`
- Labels above inputs: `text-xs text-slate-400 font-medium uppercase tracking-wide`

## Testing

Tests use Vitest and are co-located next to source files (`*.test.js`). Tests call `gameReducer` directly with fabricated state — no mocks or async needed for game logic tests.
