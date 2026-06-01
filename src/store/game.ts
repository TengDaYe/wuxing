// game.ts
// 游戏商店模块
// 用于游戏场景中的状态管理

import { reactive, toRefs } from 'vue';
import { GameConfig } from '../data/GameConfig';

export default class GameStore {
  // 响应式游戏状态
  private state = reactive({
    scene: GameConfig.GAME_STATES.MENU,
    level: 1,
    stage: 1,
    score: 0,
    life: 3,
    time: 0,
    active: false,
  });

  // 获取当前引用
  get current() {
    return toRefs(this.state);
  }

  /**
   * 设置游戏场景
   */
  setCurrentScene(sceneName: string): void {
    this.state.scene = sceneName;
  }

  /**
   * 加载关卡配置
   */
  loadLevel(levelId: number, stage: number): void {
    this.state.level = levelId;
    this.state.stage = stage;
    this.state.score = 0;
    this.state.life = 3;
    this.state.time = 0;
  }

  /**
   * 更新分数
   */
  addScore(points: number): void {
    this.state.score += points;
  }

  /**
   * 扣减生命
   */
  takeDamage(damage: number): void {
    if (this.state.life > 0) {
      this.state.life -= damage;
      this.state.score = Math.max(0, this.state.score - damage * 10);
    }
  }

  /**
   * 更新 UI
   */
  updateUI(): void {
    // 更新 UI 框架调用
    // 这里会触发 UI 组件重新渲染
  }

  /**
   * 游戏激活
   */
  activate(): void {
    this.state.active = true;
  }

  /**
   * 游戏暂停
   */
  pause(): void {
    this.state.active = false;
  }

  /**
   * 游戏恢复
   */
  resume(): void {
    this.state.active = true;
  }

  handleGameClick(x: number, y: number): void {
    console.log(`[GameStore] 点击位置: (${x}, ${y})`);
  }

  handleKeyPress(key: string): void {
    console.log(`[GameStore] 按键按下: ${key}`);
  }

  handleKeyRelease(key: string): void {
    console.log(`[GameStore] 按键释放: ${key}`);
  }
}
