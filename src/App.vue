<template>
  <div id="app">
    <MenuScene v-if="currentScene === 'Menu'" @start-game="handleStartGame" />
    <BoardScene v-else-if="currentScene === 'Game'" @back-menu="handleBackMenu" />
    <div v-else class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MenuScene from './components/MenuScene.vue';
import BoardScene from './components/BoardScene.vue';
import { EventManager, GameEvents } from './utils/EventManager';

// 当前场景
const currentScene = ref('Menu');

/**
 * 开始游戏
 */
const handleStartGame = () => {
  console.log('[App] 开始游戏');
  currentScene.value = 'Game';
  
  // 发射游戏开始事件
  EventManager.emit(GameEvents.GAME_START, { 
    startTime: Date.now(),
    level: 1 
  });
};

/**
 * 返回菜单
 */
const handleBackMenu = () => {
  console.log('[App] 返回菜单');
  currentScene.value = 'Menu';
};

/**
 * 组件挂载
 */
onMounted(() => {
  console.log('[App] 组件挂载完成');
  
  // 监听场景切换事件
  EventManager.on('switch_scene', (scene: string) => {
    currentScene.value = scene;
  });
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  position: relative;
  background: #1a1a2e;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  margin-top: 20px;
  font-size: 16px;
}
</style>
