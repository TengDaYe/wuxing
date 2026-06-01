/**
 * 游戏状态类型定义
 */

export const GameState = {
  GAME_START: 'start',
  GAME_PLAYING: 'playing',
  GAME_PAUSE: 'paused',
  GAME_END: 'end',
  GAME_GAME_OVER: 'game_over',
  GAME_EXIT: 'exit',
} as const;

export type GameState = typeof GameState[keyof typeof GameState];
