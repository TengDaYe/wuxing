<template>
  <div class="menu-scene">
    <canvas ref="canvas" 
      :width="800"
      :height="600"
      class="game-canvas"
      @mousedown="handleCanvasMouseDown"
    ></canvas>
    
    <!-- 游戏封面 -->
    <div class="cover-layer">
      <h1 class="title">消守传说</h1>
      <h2 class="subtitle">五行篇</h2>
      <h3 class="subtitle">WEB 版本</h3>
    </div>
    
    <!-- 开始游戏按钮 -->
    <div class="play-section">
      <button class="action-btn play-btn" @click="startGame">
        <span>开始游戏</span>
        <kbd>/</kbd>
      </button>
    </div>
    
    <!-- 关于按钮 -->
    <div class="about-section">
      <button class="action-btn info-btn" @click="showAbout">
        <span>游戏说明</span>
        <kbd>?</kbd>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted, onUnmounted } from 'vue';
import { eventEmitter, GameEvents } from '../utils/EventManager';
import { GameConfig } from '../data/GameConfig';
import GameStoreClass from '../store/game';

const emit = defineEmits(['start-game']);

const canvas = ref();
const gameStore = new GameStoreClass();

const startGame = () => {
  emit('start-game');
  eventEmitter.emit(GameEvents.GAME_START, { startTime: Date.now() });
};

/**
 * 显示游戏说明
 */
const showAbout = () => {
  const aboutText = `
消守传说 - 五行篇

【游戏说明】
这是一款以中国五行相生相克为核心的消除对战游戏。

【核心玩法】
在 8x8 棋盘上生成五行棋子，将相同的五行类型连成一线即可消除。

【五行配置】
🌿 木 🌱 - 对应木属性元素
🔥 火 🔥 - 对应火属性元素
🌾 土 🍁 - 对应土属性元素
⚔️ 金 ⚔️ - 对应金属性元素
💧 水 💧 - 对应水属性元素

【五行相克】
🧱 木克土 → 木 → 土 (消除)
🔧 土克水 → 土 → 水 (消除)
🌊 水克火 → 水 → 火 (消除)
🔥 火克金 → 火 → 金 (消除)
⚔️ 金克木 → 金 → 木 (消除)

【操作方式】
键盘 W/A/S/D 或方向键移动
鼠标也可以操作
点击生成对应的五行棋子

【游戏目标】
通过五行消除对战，积累得分！
  `;
  
  alert(aboutText);
};

/**
 * 加载游戏
 */
onMounted(async () => {
  // 等待 DOM 更新
  await nextTick();
  
  // 设置初始场景
  gameStore.setCurrentScene('Menu');
  
  // 绑定游戏事件
  bindGameEvents();
});

const bindGameEvents = () => {
  canvas.value.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = canvas.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gameStore.handleGameClick(x, y);
  });

  canvas.value.addEventListener('touchstart', (e: TouchEvent) => {
    e.preventDefault();
    const rect = canvas.value.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    gameStore.handleGameClick(x, y);
  });

  const keyState = new Map<string, boolean>();

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.code;
    keyState.set(key, true);
    gameStore.handleKeyPress(key);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.code;
    keyState.set(key, false);
    gameStore.handleKeyRelease(key);
  };

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  canvas.value.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'Key1') {
      startGame();
    } else if (e.code === 'Key2') {
      showAbout();
    }
  });
};

const handleCanvasMouseDown = (e: MouseEvent) => {
  if (!canvas.value) return;
  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  gameStore.handleGameClick(x, y);
};
</script>

<style lang="css" scoped>
.menu-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    #1e3d59 0%,
    #155799 50%,
    #1e3d59 100%
  );
  overflow: hidden;
}

.cover-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  transition: transform 0.5s ease;
}

.title {
  font-size: 5em;
  font-weight: 900;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
  margin: 0;
  background: linear-gradient(45deg, #FF6B35, #f09819, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(255,190,69,0.3));
}

.subtitle {
  font-size: 2.5em;
  font-weight: 700;
  margin: 0.2em 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
  background: linear-gradient(45deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.play-section, 
.about-section {
  position: absolute;
  bottom: 10%;
  padding: 20px;
}

.action-btn {
  position: relative;
  padding: 15px 40px;
  font-size: 1.2em;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  overflow: hidden;
  transition: color 0.3s;
}

.play-btn {
  color: #f09819;
  border: none;
  background: none;
  margin-right: 20px;
}

.info-btn {
  color: #3498db;
  border: none;
}

.action-btn span {
  display: block;
}

kbd {
  font-family: monospace;
  font-size: 0.8em;
  padding: 2px 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  margin-left: 8px;
  border: 1px solid rgba(255,255,255,0.3);
}

.action-btn:hover {
  color: #fff;
}

.game-canvas {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  outline: none;
}
</style>