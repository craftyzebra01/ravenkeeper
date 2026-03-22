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

## Testing

Tests use Vitest and are co-located next to source files (`*.test.js`). Tests call `gameReducer` directly with fabricated state — no mocks or async needed for game logic tests.
