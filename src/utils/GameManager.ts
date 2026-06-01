/**
 * GameManager
 * 游戏管理器
 */

import { EventManager } from './EventManager';
import { GameStore } from '../store/GameStore';

class GameManagerClass {
  private store: GameStore;
  private isGameActive: boolean = false;

  constructor() {
    this.store = GameStore.getInstance();
    
    EventManager.on('game_start', this.handleGameStart);
    EventManager.on('game_paused', this.handleGamePause);
    EventManager.on('game_resume', this.handleGameResume);
    EventManager.on('game_over', this.handleGameOver);
  }

  private handleGameStart = () => {
    this.isGameActive = true;
    console.log('[GameManager] 游戏开始');
  };

  private handleGamePause = () => {
    this.isGameActive = false;
    console.log('[GameManager] 游戏暂停');
  };

  private handleGameResume = () => {
    this.isGameActive = true;
    console.log('[GameManager] 游戏继续');
  };

  private handleGameOver = () => {
    this.isGameActive = false;
    console.log('[GameManager] 游戏结束');
  };

  checkGameState(): boolean {
    return this.isGameActive;
  }

  getConfig(): any {
    return this.store?.sceneConfig || {};
  }

  getState(): string {
    return this.store?.gameState?.status || 'idle';
  }
}

export const GameManager = new GameManagerClass();
export default GameManager;
