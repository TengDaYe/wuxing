<template>
  <div class="board-scene">
    <canvas ref="canvasRef"
      :width="800"
      :height="600"
      class="game-canvas"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
    ></canvas>
    <div class="grid-overlay">
      <template v-for="(_, rowIndex) in 8" :key="rowIndex">
        <div
          v-for="(_, colIndex) in 8"
          :key="`${rowIndex}-${colIndex}`"
          :style="{
            left: colIndex * 60 + 'px',
            top: rowIndex * 60 + 'px',
            width: '60px',
            height: '60px',
            borderColor: getFillColor(rowIndex, colIndex),
            borderWidth: '2px',
            backgroundColor: getFillColor(rowIndex, colIndex) + '40',
          }"
        ></div>
      </template>
    </div>

    <!-- 棋子实体层 -->
    <div class="entity-layer">
      <div
        v-for="(cell, idx) in flatCells"
        :key="`cell-${idx}`"
        :style="{
          left: cell.x + 'px',
          top: cell.y + 'px',
          transform: cell.rotation ? `rotate(${cell.rotation}deg)` : '',
          transition: 'all 0.3s ease',
        }"
        @mousedown="handleCellMouseDown($event, cell)"
        @mouseup="handleCellMouseUp($event, cell)"
        class="cell-entity"
        :class="`element-${cell.element}`"
      >
        <span class="element-symbol">{{ configELEMENTS[cell.element] }}</span>
      </div>
    </div>

    <!-- 特效层 -->
    <div class="fx-layer">
      <div
        v-if="showMatch"
        class="match-effect"
        :style="{
          left: matchPos.x + 'px',
          top: matchPos.y + 'px',
        }"
      >
        <span class="match-text">消除! 🎯</span>
      </div>
      <span
        v-for="(damage, index) in damageNumbers"
        :key="`damage-${index}`"
        class="damage-number"
        :style="{
          left: damage.x + 'px',
          top: damage.y + 'px',
          opacity: damage.opacity,
          transform: `translateY(-${damage.yOffset}px)`,
        }"
      >
        {{ damage.value }}
      </span>
    </div>

    <!-- 游戏信息面板 -->
    <div class="game-info-panel">
      <div class="info-item">
        <span class="label">关卡</span>
        <span class="value">{{ gameLevel }}</span>
      </div>
      <div class="info-item">
        <span class="label">分数</span>
        <span class="value">{{ gameScore }}</span>
      </div>
      <div class="info-item">
        <span class="label">生命</span>
        <span class="value">{{ gameLife }}</span>
      </div>
      <div class="info-item">
        <span class="label">连击</span>
        <span class="value">{{ comboCount }}</span>
      </div>
    </div>

    <!-- 控制按钮层 -->
    <div class="controls">
      <button class="control-btn pause-btn" @click="handleTogglePause">
        {{ isPaused ? '继续游戏' : '暂停游戏' }}
      </button>
      <button class="control-btn restart-btn" @click="handleRestart">
        重新开始
      </button>
      <button class="control-btn back-btn" @click="handleBackMenu">
        返回菜单
      </button>
    </div>
  </div>

  <!-- 五行说明面板 -->
  <div class="five-elements-info">
    <div 
      v-for="element in wuxingElements"
      :key="element"
      class="element-info"
      :style="{ background: wuxingColors[element] }"
    >
      <span class="element-char">{{ configELEMENTS[element] }}</span>
      <span class="element-desc">{{ descriptionMap[element] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { EventManager, GameEvents } from '../utils/EventManager';
import { GameConfig } from '../data/GameConfig';

const emit = defineEmits<{ (e: 'back-menu'): void }>();

type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

interface Cell {
  x: number;
  y: number;
  row: number;
  col: number;
  element: ElementType;
  rotation: number;
}

interface DamageNumber {
  x: number;
  y: number;
  value: string;
  opacity: number;
  yOffset: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const cells = ref<Cell[]>([]);
const matchPos = ref({ x: 0, y: 0 });
const damageNumbers = ref<DamageNumber[]>([]);
const isPaused = ref(false);
const showMatch = ref(false);

const gameLevel = ref(1);
const gameScore = ref(0);
const gameLife = ref(3);
const comboCount = ref(0);

let selectedCell: Cell | null = null;
let draggingCell: Cell | null = null;

const configELEMENTS: Record<ElementType, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

const wuxingColors: Record<ElementType, string> = {
  wood: '#4CAF50',
  fire: '#F44336',
  earth: '#FF9800',
  metal: '#9E9E9E',
  water: '#2196F3',
};

const wuxingElements: ElementType[] = ['wood', 'fire', 'earth', 'metal', 'water'];

const descriptionMap: Record<ElementType, string> = {
  wood: '生长、繁荣',
  fire: '燃烧、光明',
  earth: '包容、承载',
  metal: '坚韧、锋利',
  water: '流动、智慧',
};

const flatCells = computed(() => cells.value);

const getFillColor = (rowIndex: number, _colIndex: number): string => {
  const colors = ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9E9E9E'];
  return colors[rowIndex % 5];
};

const handleMouseDown = (e: MouseEvent): void => {
  if (!canvasRef.value || isPaused.value) return;
  
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left - 40;
  const y = e.clientY - rect.top - 40;

  selectedCell = null;
  draggingCell = null;

  handleSpawnCell(x, y);
};

const handleMouseMove = (e: MouseEvent): void => {
  if (!canvasRef.value || !draggingCell) return;
  
  const rect = canvasRef.value.getBoundingClientRect();
  draggingCell.x = e.clientX - rect.left - 40;
  draggingCell.y = e.clientY - rect.top - 40;
};

const handleMouseUp = (): void => {
  if (draggingCell && selectedCell) {
    checkMatch();
  }
  draggingCell = null;
  selectedCell = null;
};

const handleCellMouseDown = (e: MouseEvent, cell: Cell): void => {
  e.stopPropagation();
  selectedCell = cell;
  draggingCell = cell;
};

const handleCellMouseUp = (e: MouseEvent, cell: Cell): void => {
  e.stopPropagation();
  if (selectedCell && selectedCell !== cell) {
    const dx = Math.abs(selectedCell.col - cell.col);
    const dy = Math.abs(selectedCell.row - cell.row);
    if (dx + dy === 1) {
      swapCells(selectedCell, cell);
    }
  }
  draggingCell = null;
  selectedCell = null;
};

const swapCells = (cell1: Cell, cell2: Cell): void => {
  const tempX = cell1.x;
  const tempY = cell1.y;
  const tempRow = cell1.row;
  const tempCol = cell1.col;

  cell1.x = cell2.x;
  cell1.y = cell2.y;
  cell1.row = cell2.row;
  cell1.col = cell2.col;

  cell2.x = tempX;
  cell2.y = tempY;
  cell2.row = tempRow;
  cell2.col = tempCol;

  checkMatch();
};

const handleSpawnCell = (x: number, y: number): void => {
  const col = Math.floor(x / 60);
  const row = Math.floor(y / 60);

  if (col < 0 || col >= 8 || row < 0 || row >= 8) return;

  const existingCell = cells.value.find(c => c.row === row && c.col === col);
  if (existingCell) return;

  const element = GameConfig.WUXING.ELEMENTS[row % 5];
  
  const cell: Cell = {
    x: col * 60,
    y: row * 60,
    row,
    col,
    element,
    rotation: Math.random() * 360,
  };
  
  cells.value.push(cell);
  
  EventManager.emit(GameEvents.MATCH_FOUND, {
    cell,
    element,
  });

  checkMatch();
};

const checkMatch = (): void => {
  const matches = findMatches();
  
  if (matches.length >= 3) {
    processMatches(matches);
  }
};

const findMatches = (): Cell[] => {
  const matched: Set<Cell> = new Set();
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      const c1 = cells.value.find(c => c.row === row && c.col === col);
      const c2 = cells.value.find(c => c.row === row && c.col === col + 1);
      const c3 = cells.value.find(c => c.row === row && c.col === col + 2);
      
      if (c1 && c2 && c3 && 
          c1.element === c2.element && 
          c2.element === c3.element) {
        matched.add(c1);
        matched.add(c2);
        matched.add(c3);
      }
    }
  }

  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 6; row++) {
      const c1 = cells.value.find(c => c.row === row && c.col === col);
      const c2 = cells.value.find(c => c.row === row + 1 && c.col === col);
      const c3 = cells.value.find(c => c.row === row + 2 && c.col === col);
      
      if (c1 && c2 && c3 && 
          c1.element === c2.element && 
          c2.element === c3.element) {
        matched.add(c1);
        matched.add(c2);
        matched.add(c3);
      }
    }
  }
  
  return Array.from(matched);
};

const processMatches = (matches: Cell[]): void => {
  comboCount.value++;
  
  const baseScore = matches.length * 10;
  const comboMultiplier = Math.min(comboCount.value, 5);
  const elementBonus = calculateElementBonus(matches);
  const totalScore = baseScore * comboMultiplier + elementBonus;
  
  gameScore.value += totalScore;
  
  matches.forEach(cell => {
    addDamageNumber(cell.x, cell.y, totalScore / matches.length);
  });
  
  matchPos.value = {
    x: matches[0].x,
    y: matches[0].y,
  };
  showMatchEffect();
  
  cells.value = cells.value.filter(c => !matches.includes(c));
  
  EventManager.emit(GameEvents.CELLS_REMOVED, {
    count: matches.length,
    score: totalScore,
    combo: comboCount.value,
  });

  setTimeout(() => {
    checkMatch();
  }, 500);
};

const calculateElementBonus = (cells: Cell[]): number => {
  if (cells.length < 3) return 0;
  
  const elementCount: Record<ElementType, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };
  
  cells.forEach(cell => {
    elementCount[cell.element]++;
  });
  
  let bonus = 0;
  const elements = Object.keys(elementCount) as ElementType[];
  
  for (let i = 0; i < elements.length; i++) {
    const current = elements[i];
    const generating = GameConfig.WUXING.GENERATING_CYCLE[current as keyof typeof GameConfig.WUXING.GENERATING_CYCLE];
    if (elementCount[current as ElementType] > 0 && elementCount[generating as ElementType] > 0) {
      bonus += 20;
    }
  }
  
  return bonus;
};

const showMatchEffect = (): void => {
  showMatch.value = true;
  setTimeout(() => {
    showMatch.value = false;
  }, 500);
};

const addDamageNumber = (x: number, y: number, value: number): void => {
  const num: DamageNumber = {
    x,
    y,
    value: Math.round(value).toString(),
    opacity: 1,
    yOffset: 0,
  };
  
  damageNumbers.value.push(num);
  
  const interval = setInterval(() => {
    num.yOffset += 2;
    num.opacity -= 0.02;
    
    if (num.opacity <= 0) {
      clearInterval(interval);
      damageNumbers.value = damageNumbers.value.filter(n => n !== num);
    }
  }, 16);
};

const handleTogglePause = (): void => {
  isPaused.value = !isPaused.value;
  
  if (isPaused.value) {
    EventManager.emit(GameEvents.GAME_PAUSED);
  } else {
    EventManager.emit(GameEvents.GAME_RESUME);
  }
};

const handleRestart = (): void => {
  cells.value = [];
  gameScore.value = 0;
  gameLevel.value = 1;
  gameLife.value = 3;
  comboCount.value = 0;
  isPaused.value = false;
  
  EventManager.emit(GameEvents.GAME_START, {
    startTime: Date.now(),
    level: gameLevel.value,
  });
};

const handleBackMenu = (): void => {
  emit('back-menu');
};

const initGame = (): void => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const element = GameConfig.WUXING.ELEMENTS[row % 5];
      const cell: Cell = {
        x: col * 60,
        y: row * 60,
        row,
        col,
        element,
        rotation: Math.random() * 360,
      };
      cells.value.push(cell);
    }
  }
  
  const initialMatches = findMatches();
  if (initialMatches.length > 0) {
    cells.value = cells.value.map(cell => ({
      ...cell,
      element: GameConfig.WUXING.ELEMENTS[Math.floor(Math.random() * 5)],
    }));
  }
};

onMounted(() => {
  initGame();
  
  EventManager.on(GameEvents.GAME_START, (data: any) => {
    if (data.level) {
      gameLevel.value = data.level;
    }
  });

  EventManager.on(GameEvents.LEVEL_COMPLETE, () => {
    gameLevel.value++;
  });

  EventManager.on(GameEvents.GAME_OVER, () => {
    gameLife.value = 0;
  });
});

onUnmounted(() => {
  EventManager.clear();
});
</script>

<style lang="css" scoped>
.board-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #252a34;
  overflow: hidden;
}

.game-canvas {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.grid-overlay {
  position: absolute;
  top: 40px;
  left: 40px;
  width: 480px;
  height: 480px;
  display: grid;
  grid-template-columns: repeat(8, 60px);
  grid-template-rows: repeat(8, 60px);
  gap: 2px;
}

.grid-overlay > div {
  box-sizing: border-box;
  border-radius: 4px;
}

.entity-layer {
  position: absolute;
  top: 40px;
  left: 40px;
  width: 480px;
  height: 480px;
  pointer-events: none;
}

.cell-entity {
  position: absolute;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.cell-entity:hover {
  transform: scale(1.1);
}

.cell-entity.element-wood {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
}

.cell-entity.element-fire {
  background: linear-gradient(135deg, #F44336, #C62828);
}

.cell-entity.element-earth {
  background: linear-gradient(135deg, #FF9800, #EF6C00);
}

.cell-entity.element-metal {
  background: linear-gradient(135deg, #9E9E9E, #616161);
}

.cell-entity.element-water {
  background: linear-gradient(135deg, #2196F3, #1565C0);
}

.element-symbol {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.fx-layer {
  position: absolute;
  top: 40px;
  left: 40px;
  width: 480px;
  height: 480px;
  pointer-events: none;
}

.match-effect {
  position: absolute;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.8), transparent);
  border-radius: 50%;
  animation: pulse 0.5s ease-out;
}

@keyframes pulse {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.match-text {
  font-size: 18px;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 0 0 10px #FFD700;
}

.damage-number {
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  animation: floatUp 1s ease-out forwards;
}

@keyframes floatUp {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-50px); opacity: 0; }
}

.game-info-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(0, 0, 0, 0.6);
  padding: 12px;
  border-radius: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  color: white;
}

.info-item .label {
  color: #aaa;
}

.info-item .value {
  font-weight: bold;
  color: #FFD700;
}

.controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.pause-btn {
  background: #FF9800;
  color: white;
}

.pause-btn:hover {
  background: #F57C00;
}

.restart-btn {
  background: #2196F3;
  color: white;
}

.restart-btn:hover {
  background: #1976D2;
}

.back-btn {
  background: #9E9E9E;
  color: white;
}

.back-btn:hover {
  background: #757575;
}

.five-elements-info {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.element-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  min-width: 60px;
}

.element-char {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.element-desc {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
}
</style>
