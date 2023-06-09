
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 30;
let cellSize = Math.min(window.innerWidth, window.innerHeight) / gridSize;

const controlHeight = 50; // Height reserved for the control buttons
const maxSize = Math.min(window.innerWidth, window.innerHeight - controlHeight);

canvas.width = gridSize * cellSize;
canvas.height = gridSize * cellSize;

// Check if the canvas size exceeds the available size and adjust if needed
if (canvas.width > maxSize) {
  cellSize = Math.floor(maxSize / gridSize);
  canvas.width = gridSize * cellSize;
}
if (canvas.height > maxSize) {
  cellSize = Math.floor(maxSize / gridSize);
  canvas.height = gridSize * cellSize;
}

let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));

function createRandomPatterns(numPatterns) {
  const gliderPatterns = [
    [
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1]
    ],
    [
      [1, 0, 0],
      [0, 1, 1],
      [1, 1, 0]
    ],
    [
      [0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
    [
      [0, 1, 1, 0, 0],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 1],
      [0, 0, 1, 1, 0],
    ],
  ];

  function rotate(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const result = new Array(cols);

      for (let i = 0; i < cols; i++) {
          result[i] = new Array(rows);
          for (let j = 0; j < rows; j++) {
          result[i][j] = matrix[j][cols - 1 - i];
          }
      }

      return result;
  }

  const allPatterns = gliderPatterns.flatMap((pattern) => [
      pattern,
      rotate(pattern),
      rotate(rotate(pattern)),
      rotate(rotate(rotate(pattern))),
  ]);

  const randomPatterns = Array.from({ length: numPatterns }, () =>
  allPatterns[Math.floor(Math.random() * allPatterns.length)]
  );

  randomPatterns.forEach((pattern) => {
      const patternRows = pattern.length;
      const patternCols = pattern[0].length;
      const startRow =
      Math.floor(Math.random() * (gridSize - patternRows + 1));
      const startCol =
      Math.floor(Math.random() * (gridSize - patternCols + 1));

      for (let row = 0; row < patternRows; row++) {
      for (let col = 0; col < patternCols; col++) {
          grid[startRow + row][startCol + col] = pattern[row][col] === 1;
      }
      }
  });
}

let animationId;

ctx.strokeStyle = "#e0e0e0";
ctx.lineWidth = 0.5;

for (let i = 1; i < gridSize; i++) {
  ctx.beginPath();
  ctx.moveTo(i * cellSize, 0);
  ctx.lineTo(i * cellSize, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, i * cellSize);
  ctx.lineTo(canvas.width, i * cellSize);
  ctx.stroke();
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw light and thin grid lines
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 0.5;

  for (let i = 1; i < gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col]) {
        ctx.fillStyle = "#000";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
}

function updateGrid() {
  // rule 1: Any live cell with two or three live neighbors survives.
  // rule 2: Any dead cell with exactly three live neighbors becomes a live cell.
  // rule 3: All other live cells die in the next generation. 
  const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      let liveNeighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newRow = (row + i + gridSize) % gridSize;
          const newCol = (col + j + gridSize) % gridSize;
          if (grid[newRow][newCol]) liveNeighbors++;
        }
      }

      if (grid[row][col] && (liveNeighbors === 2 || liveNeighbors === 3)) {
        newGrid[row][col] = true;
      } else if (!grid[row][col] && liveNeighbors === 3) {
        newGrid[row][col] = true;
      }
    }
  }

  grid = newGrid;
}

function gameLoop() {
  updateGrid();
  drawGrid();
  animationId = requestAnimationFrame(gameLoop);
}

function isGridEmpty() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col]) {
        return false;
      }
    }
  }
  return true;
}

function startGame() {
  if (isGridEmpty()) {
    alert("To start Game of Life, please\n (1) draw on the canvas before Start, or\n (2) click Refresh to get random ships.");
  } else if (!animationId) {
    document.getElementById("start-pause-button").classList.add("executing");
    gameLoop();
  }
}

function pauseGame() {
  if (animationId) {
    document.getElementById("start-pause-button").classList.remove("executing");
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function resetGame() {
  pauseGame();
  isRunning = false;
  startPauseButton.textContent = 'Start';
  document.getElementById("resetBtn").classList.add("executing");
  grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
  drawGrid();
  setTimeout(() => {
    document.getElementById("resetBtn").classList.remove("executing");
  }, 300);
}

function setNumPatterns(n) {
  return Math.floor(Math.random() * n) + 1;
}
const numPatterns = setNumPatterns(3);
createRandomPatterns(numPatterns);
drawGrid();

let isDrawing = false;
let prevRow = null;
let prevCol = null;
let isRunning = false; // Declare and initialize isRunning variable

const startPauseButton = document.getElementById('start-pause-button');
const resetButton = document.getElementById('resetBtn');

resetButton.addEventListener('click', () => {
  resetGame();
});

startPauseButton.addEventListener('click', () => {
  if (isRunning) {
    pauseGame();
    startPauseButton.textContent = 'Start';
    isRunning = false;
  } else {
    startGame();
    if (animationId) {
      startPauseButton.textContent = 'Pause';
      isRunning = true;
    }
  }
});

function toggleCell(row, col) {
  grid[row][col] = !grid[row][col];
  drawGrid();
}

function fillCell(row, col) {
  if (prevRow !== null && prevCol !== null) {
    interpolateCells(prevRow, prevCol, row, col);
  }

  grid[row][col] = true;
  prevRow = row;
  prevCol = col;
  drawGrid();
}

function getCellCoords(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const row = Math.floor(y / cellSize);
  const col = Math.floor(x / cellSize);
  return { row, col };
}

function interpolateCells(prevRow, prevCol, row, col) {
  const dRow = Math.abs(row - prevRow);
  const dCol = Math.abs(col - prevCol);

  const maxDist = Math.max(dRow, dCol);

  for (let i = 1; i <= maxDist; i++) {
    const r = prevRow + Math.round((i / maxDist) * (row - prevRow));
    const c = prevCol + Math.round((i / maxDist) * (col - prevCol));
    grid[r][c] = true;
  }
}


function getCellCoordinates(e, canvas, gridSize) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX || e.touches[0].clientX;
  const y = e.clientY || e.touches[0].clientY;
  const cellSize = canvas.width / gridSize;

  const col = Math.floor((x - rect.left) / cellSize);
  const row = Math.floor((y - rect.top) / cellSize);

  return { row, col };
}
function handleInputEvent(e) {
  e.preventDefault();
  const { row, col } = getCellCoordinates(e, canvas, gridSize);

  if (e.type === 'mousedown' || e.type === 'touchstart') {
      isDrawing = !grid[row][col];
      toggleCell(row, col);
  } else if (isDrawing && (e.type === 'mousemove' || e.type === 'touchmove')) {
      fillCell(row, col);
  } else if (e.type === 'mouseup' || e.type === 'mouseleave' || e.type === 'touchend' || e.type === 'touchcancel') {
      isDrawing = false;
      prevRow = null;
      prevCol = null;
  }
}

canvas.addEventListener('mousedown', handleInputEvent);
canvas.addEventListener('mousemove', handleInputEvent);
canvas.addEventListener('mouseup', handleInputEvent);
canvas.addEventListener('mouseleave', handleInputEvent);

canvas.addEventListener('touchstart', handleInputEvent);
canvas.addEventListener('touchmove', handleInputEvent);
canvas.addEventListener('touchend', handleInputEvent);
canvas.addEventListener('touchcancel', handleInputEvent);

function handleRefresh() {
  // 1. Pause the game and update the button state
  pauseGame();
  startPauseButton.textContent = 'Start';
  isRunning = false;

  // 2. Clear the grid
  grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));

  // 3. Create new random patterns on the grid
  var numPatterns1 = setNumPatterns(3);
  createRandomPatterns(numPatterns1);
  console.log(numPatterns1)

  // 4. Draw the updated grid
  drawGrid();
}

const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', handleRefresh);

function positionControls() {
  const controls = document.querySelector(".controls");
  const canvasRect = canvas.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  if (canvasRect.bottom + 5 + controls.offsetHeight < windowHeight) {
    controls.style.top = (canvasRect.bottom + 5) + 'px';
  } else {
    controls.style.top = (canvasRect.bottom - 5 - controls.offsetHeight) + 'px';
  }

  controls.style.left = ((windowWidth - controls.offsetWidth) / 2) + 'px';
}

window.addEventListener("resize", positionControls);

positionControls();