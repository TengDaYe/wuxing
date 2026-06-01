import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 导入游戏管理器
import { GameManager } from './utils/GameManager';
import { EventManager, GameEvents } from './utils/EventManager';

// 创建 Vue 应用
const app = createApp(App)

// 全局事件总线初始化
console.log('[Main] 初始化游戏引擎...')

// 监听游戏开始事件
EventManager.on(GameEvents.GAME_START, (data: any) => {
  console.log('[Main] 游戏开始:', data)
  GameManager.checkGameState()
})

// 监听游戏结束事件
EventManager.on(GameEvents.GAME_OVER, () => {
  console.log('[Main] 游戏结束')
})

// 监听关卡完成事件
EventManager.on(GameEvents.LEVEL_COMPLETE, (data: any) => {
  console.log('[Main] 关卡完成:', data)
})

// 监听错误事件
EventManager.on(GameEvents.MEMORY_WARNING, () => {
  console.warn('[Main] 内存警告')
})

// 全局错误处理
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[Main] 全局错误:', { message, source, lineno, colno, error })
  EventManager.emit(GameEvents.MEMORY_WARNING, { error })
  return false
}

// 卸载时清理
window.onunload = () => {
  console.log('[Main] 游戏卸载，清理资源...')
  EventManager.clear()
}

// 启动应用
app.mount('#app')

console.log('[Main] 游戏引擎启动完成!')
