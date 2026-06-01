// GameStore
// 游戏状态管理
// 使用 Vue 3 Composition API 实现响应式状态管理

import { reactive, ref, watch } from 'vue';
import { GameConfig } from '../data/GameConfig';
import { EventManager, GameEvents } from '../utils/EventManager';

export class GameStore {
  private static instance: GameStore;
  
  // 游戏场景相关
  currentScene: string;
  sceneConfig: Record<string, any>;
  
  // 游戏状态
  readonly gameState: Record<string, any>;
  
  // 输入状态
  readonly inputState: Record<string, any>;
  readonly mousePosition: Record<string, any>;
  readonly mouseClicked: Record<string, any>;
  
  // 存档管理
  private readonly SAVE_KEY: string;
  
  private constructor() {
    this.SAVE_KEY = GameConfig.SAVE.KEY;
    
    // 创建响应式状态
    this.currentScene = 'Menu';
    this.sceneConfig = {};
    
    // 响应式游戏状态
    this.gameState = reactive({
      active: false,
      paused: false,
      loaded: false,
      currentLevel: 1,
    });
    
    // 响应式输入状态
    this.inputState = reactive({
      up: false,
      down: false,
      left: false,
      right: false,
    });
    
    // 响应式鼠标位置
    this.mousePosition = ref({ x: 0, y: 0 });
    
    // 响应式鼠标点击
    this.mouseClicked = ref({ x: 0, y: 0, timestamp: 0 });
    
    // 加载存档
    this.load();
    
    // 监听游戏状态变化并自动保存
    this.watchGameState();
  }
  
  static getInstance(): GameStore {
    if (!this.instance) {
      this.instance = new GameStore();
    }
    return this.instance;
  }
  
  get state() {
    return {
      scene: this.currentScene,
      config: this.sceneConfig,
      game: this.gameState,
      input: this.inputState,
      mouse: this.mousePosition.value,
      click: this.mouseClicked.value,
    };
  }
  
  /**
   * 保存游戏状态
   */
  async save(): Promise<void> {
    try {
      const data = {
        ...this.gameState,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
      EventManager.emit(GameEvents.SAVE_COMPLETE, { success: true });
    } catch (error) {
      console.error('Failed to save:', error);
      EventManager.emit(GameEvents.SAVE_COMPLETE, { success: false });
    }
  }
  
  /**
   * 加载游戏状态
   */
  async load(): Promise<void> {
    try {
      const data = localStorage.getItem(this.SAVE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // 合并状态，避免覆盖响应式状态
        Object.keys(parsed).forEach(key => {
          if (this.gameState.hasOwnProperty(key)) {
            (this.gameState as any)[key] = parsed[key];
          }
        });
        EventManager.emit(GameEvents.LOAD_COMPLETE, parsed);
      }
    } catch (error) {
      console.error('Failed to load save:', error);
    }
  }
  
  /**
   * 监听游戏状态变化并自动保存
   */
  private watchGameState(): void {
    watch(
      () => this.gameState,
      () => {
        this.save();
      },
      { deep: true }
    );
  }
  
  /**
   * 设置游戏场景
   */
  setCurrentScene(sceneName: string): void {
    this.currentScene = sceneName;
  }
  
  /**
   * 加载场景配置
   */
  loadLevel(levelId: number, stage: number): void {
    this.gameState.currentLevel = levelId;
    this.sceneConfig[`${levelId}-${stage}`] = {
      level: levelId,
      stage: stage,
      score: 0,
      life: 3,
    };
  }
  
  /**
   * 更新 UI
   */
  updateUI(): void {
    // 更新 UI 框架调用
    EventManager.emit(GameEvents.UI_UPDATE, this.state);
  }
  
  /**
   * 处理游戏点击
   */
  handleGameClick(x: number, y: number): void {
    this.mouseClicked.value = { x, y, timestamp: Date.now() };
    EventManager.emit(GameEvents.GAME_CLICK, { x, y });
  }
  
  /**
   * 处理键盘输入
   */
  handleKeyPress(key: string): void {
    switch (key) {
      case 'KeyW':
      case 'ArrowUp':
        this.inputState.up = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.inputState.down = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.inputState.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.inputState.right = true;
        break;
    }
    
    EventManager.emit(GameEvents.GAME_INPUT_STATE_CHANGED, { 
      key, 
      state: this.inputState 
    });
  }
  
  /**
   * 处理键盘释放
   */
  handleKeyRelease(key: string): void {
    switch (key) {
      case 'KeyW':
      case 'ArrowUp':
        this.inputState.up = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.inputState.down = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.inputState.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.inputState.right = false;
        break;
    }
  }
}
