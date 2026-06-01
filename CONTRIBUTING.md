# Contributing

Thanks for your interest in Wuxing. The project is intentionally small and approachable, so contributions can range from documentation fixes to core gameplay work.

## Development Setup

```bash
pnpm install
pnpm run dev
```

Before opening a pull request, run:

```bash
pnpm run build
```

## Contribution Areas

- Gameplay logic: board generation, match detection, gravity, refill, scoring, and level goals.
- Wuxing rules: generating and overcoming cycle effects.
- UI polish: responsive layout, visual feedback, accessibility, and keyboard interaction.
- Documentation: README, architecture notes, rules explanations, and examples.
- Tests: board logic and scoring behavior.

## Pull Request Guidelines

- Keep changes focused and easy to review.
- Include a clear description of the problem and solution.
- Add tests when changing shared gameplay logic.
- Keep generated files and dependencies out of commits unless they are intentional.
- Make sure `pnpm run build` passes.

## Code Style

- Prefer TypeScript types over `any` where practical.
- Keep Vue components focused on rendering and interaction.
- Move reusable game logic into utilities or composables.
- Use existing project conventions before introducing new abstractions.

## Reporting Issues

When opening an issue, include:

- What happened.
- What you expected.
- Steps to reproduce.
- Browser and operating system if the issue is visual or interactive.
