# Roadmap

Wuxing is early-stage. This roadmap keeps the project direction visible and gives contributors concrete places to help.

## Phase 1: Stabilize the Prototype

- Keep `pnpm run build` passing.
- Replace remaining Vite starter content with project-specific assets and copy.
- Consolidate duplicated game store implementations.
- Move board matching and scoring logic out of `BoardScene.vue`.
- Add unit tests for match detection and score calculation.

## Phase 2: Complete the Core Loop

- Generate boards without initial matches.
- Swap adjacent pieces and rollback invalid moves.
- Remove matched pieces, apply gravity, and refill the board.
- Detect chain reactions and reset combo state correctly.
- Add level goals, win conditions, and loss conditions.

## Phase 3: Deepen the Wuxing Rules

- Add generating-cycle bonuses.
- Add overcoming-cycle interactions.
- Document the rules clearly for players and contributors.
- Make rule effects configurable from `GameConfig.ts`.

## Phase 4: Improve Player Experience

- Add sound effects and animation polish.
- Improve mobile and touch controls.
- Add accessibility labels and keyboard support.
- Publish a GitHub Pages demo.
- Prepare versioned releases.

## Phase 5: Contributor Experience

- Add issue templates.
- Add pull request templates.
- Add automated tests in CI.
- Add architecture documentation for new contributors.
