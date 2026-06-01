// EventManager
// 全局事件总线
// 用于组件间通信和触发游戏事件

type EventCallback = (...args: any[]) => void;

export class EventManager {
  private static events: Map<string, EventCallback[]> = new Map();
  
  /**
   * 订阅事件
   * @param event 事件名
   * @param callback 回调函数
   * @example
   * EventManager.on('level_complete', (levelId) => {
   *   console.log(`Level ${levelId} completed!`);
   * });
   */
  static on(
    event: string, 
    callback: EventCallback
  ): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }
  
  /**
   * 取消订阅事件
   * @param event 事件名
   * @param callback 回调函数
   */
  static off(
    event: string, 
    callback: EventCallback
  ): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  /**
   * 广播事件
   * @param event 事件名
   * @param args 事件参数
   * @example
   * EventManager.emit('game_started', { level: 1, score: 0 });
   */
  static emit(
    event: string, 
    ...args: any[]
  ): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(...args));
    }
  }
  
  /**
   * 清除所有事件
   */
  static clear(): void {
    this.events.clear();
  }
}

// 全局事件发射器实例
// 用于替代 EventManager.on / EventManager.emit 调用，简化代码
export const eventEmitter = {
  /**
   * 订阅事件
   */
  on: (event: string, callback: EventCallback) => {
    EventManager.on(event, callback);
  },
  /**
   * 广播事件
   */
  emit: (event: string, ...args: any[]) => {
    EventManager.emit(event, ...args);
    return args;
  },
};

// 事件常量定义
export const GameEvents = {
  // 游戏状态事件
  GAME_START: 'game_start',
  GAME_PAUSED: 'game_paused',
  GAME_RESUME: 'game_resume',
  GAME_OVER: 'game_over',
  
  // 关卡事件
  LEVEL_START: 'level_start',
  LEVEL_COMPLETE: 'level_complete',
  LEVEL_FAILED: 'level_failed',
  LEVEL_NEXT: 'level_next',
  
  // 战斗事件
  COMBO_HIT: 'combo_hit',
  MATCH_FOUND: 'match_found',
  CELLS_REMOVED: 'cells_removed',
  TOWER_ATTACK: 'tower_attack',
  MONSTER_HIT: 'monster_hit',
  PROJECTILE_HIT: 'projectile_hit',
  
  // UI 事件
  UI_UPDATE: 'ui_update',
  DIALOG_OPEN: 'dialog_open',
  DIALOG_CLOSE: 'dialog_close',
  
  // 成就系统事件
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  
  // 存档系统事件
  SAVE_COMPLETE: 'save_complete',
  LOAD_COMPLETE: 'load_complete',
  
  // 游戏流程事件
  GAME_INPUT_STATE_CHANGED: 'game_input_state_changed',
  GAME_MOUSE_POSITION_CHANGED: 'game_mouse_position_changed',
  GAME_CLICK: 'game_click',
  
  // 性能监控事件
  FPS_UPDATE: 'fps_update',
  MEMORY_WARNING: 'memory_warning',
};

// 输出事件类型
export interface OutputEvent {
  event: string;
  timestamp: number;
  params?: Record<string, any>;
}

// 输出常量
export const GameEventsConstants = {
  FPS_THRESHOLD: 30,
  MEMORY_WARNING_THRESHOLD: 100, // MB
};
