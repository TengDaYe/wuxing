# Wuxing

Wuxing is an open-source browser game prototype built with Vue 3, TypeScript, and Vite. It explores match-board gameplay inspired by the Chinese five elements: wood, fire, earth, metal, and water.

The project is currently in early development. Its goal is to become a readable, playable, and reusable example for cultural game mechanics, rule-driven gameplay experiments, and lightweight web game development.

## Why This Project Exists

Many small web games demonstrate matching, scoring, or board interaction in isolation. Wuxing focuses on combining those ideas with a traditional five-elements ruleset:

- Wood, fire, earth, metal, and water as first-class gameplay elements.
- Generating and overcoming cycles as future rule extensions.
- A Vue-based interface that is easy for web developers to inspect and modify.
- A small codebase suitable for learning, experimentation, and contribution.

## Current Features

- 8x8 interactive board.
- Five element pieces with distinct colors and Chinese labels.
- Horizontal and vertical match detection.
- Score, combo, level, and life UI.
- Pause, restart, and back-to-menu controls.
- Global event manager for game lifecycle events.
- TypeScript build validation.

## Planned Features

- Stable no-initial-match board generation.
- Swap rollback when no match is created.
- Piece gravity, refill, and chain reactions.
- Five-elements overcoming and generating rule effects.
- Level objectives and failure conditions.
- Sound effects and improved visual feedback.
- Unit tests for board and scoring logic.
- Playable GitHub Pages demo.

See [ROADMAP.md](./ROADMAP.md) for the project plan.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- pnpm

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the local development server:

```bash
pnpm run dev
```

Build for production:

```bash
pnpm run build
```

Preview the production build:

```bash
pnpm run preview
```

## Project Structure

```text
src/
  components/
    BoardScene.vue      # Main board and game interaction
    MenuScene.vue       # Start menu and game instructions
  data/
    GameConfig.ts       # Board, element, save, and state configuration
  store/
    GameStore.ts        # Singleton game state store
    game.ts             # Lightweight scene store used by menu prototype
  types/
    game-state.ts       # Shared game state constants and types
  utils/
    EventManager.ts     # Global event bus
    GameManager.ts      # Game lifecycle manager
```

## Open Source Goals

This repository is maintained as an open-source learning and experimentation project. Contributions that improve the core gameplay loop, documentation, accessibility, tests, and code organization are welcome.

Good first contribution areas:

- Fix small TypeScript issues.
- Improve README and gameplay docs.
- Add board logic tests.
- Refactor board logic out of Vue components.
- Improve mobile layout and controls.

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

MIT. See [LICENSE](./LICENSE).
