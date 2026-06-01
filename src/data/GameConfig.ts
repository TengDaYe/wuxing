// GameConfiguration
// 游戏全局配置

export const GameConfig = {
  // 游戏尺寸
  GAME_SIZE: {
    WIDTH: 800,
    HEIGHT: 600,
    CELL_COUNT: 8,
  },
  
  // 棋盘配置
  BOARD: {
    ROWS: 8,
    COLS: 8,
    CELL_SIZE: 60,
    GAP: 2,
  },
  
  // 五行配置
  WUXING: {
    ELEMENTS: ['wood', 'fire', 'earth', 'metal', 'water'] as const,
    ENGLISH: {
      wood: '木',
      fire: '火',
      earth: '土',
      metal: '金',
      water: '水',
    } as const,
    COLORS: {
      wood: '#4CAF50',
      fire: '#F44336',
      earth: '#FF9800',
      metal: '#9E9E9E',
      water: '#2196F3',
    },
    GENERATING_CYCLE: {
      wood: 'fire',
      fire: 'earth',
      earth: 'metal',
      metal: 'water',
      water: 'wood',
    },
    OVERCOMING_CYCLE: {
      wood: 'earth',
      earth: 'water',
      water: 'fire',
      fire: 'metal',
      metal: 'wood',
    },
  },
  // 性能配置
  PERFORMANCE: {
    HIGH: { particleCount: 100, animationFPS: 60 },
    MEDIUM: { particleCount: 50, animationFPS: 60 },
    LOW: { particleCount: 20, animationFPS: 30 },
  },
  
  // 存档配置
  SAVE: {
    KEY: 'xiaoshou_legend_save',
    BACKUP_KEY: 'xiaoshou_legend_backup',
    AUTO_SAVE_INTERVAL: 60000,
  },
  
  // 游戏状态配置
  GAME_STATES: {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    LEVEL_COMPLETE: 'level_complete',
    LEVEL_FAILED: 'level_failed',
    GAME_OVER: 'game_over',
  },
  
  // 默认游戏状态
  DEFAULT_STATE: {
    level: 1,
    score: 0,
    gold: 0,
    life: 3,
    paused: false,
  },
};

// 输出配置
export interface OutputType {
  high: boolean;
  fps: number;
}

// 输入状态
export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

// 鼠标状态
export interface MousePosition {
  x: number;
  y: number;
}

// 点击事件
export interface ClickData {
  x: number;
  y: number;
  timestamp: number;
}

// 场景类型
export type SceneType = 'Menu' | 'LevelSelect' | 'Game' | 'GameOver';

export type WuxingElement = typeof GameConfig.WUXING.ELEMENTS[number];

// 游戏场景配置
export interface SceneConfig {
  level: number;
  stage: number;
  score: number;
  life: number;
  time: number;
}
