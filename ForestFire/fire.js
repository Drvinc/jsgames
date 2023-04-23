const canvas = document.getElementById('forestCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 100;
const cellSize = canvas.width / gridSize;

const treeStates = {
  EMPTY: 0,
  GREEN: 1,
  BURNING: 2,
  BURNT: 3,
};

const p = 0.02; // Probability of a burnt tree growing into a green tree
const f = 0.001; // Probability of a green tree being hit by lightning and burning

// Initialize the forest grid
let forest = Array.from({ length: gridSize }, () =>
  Array.from({ length: gridSize }, () => treeStates.GREEN)
);

// Main simulation loop
function updateForest() {
  let newForest = JSON.parse(JSON.stringify(forest));

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let currentTree = forest[y][x];

      switch (currentTree) {
        case treeStates.BURNING:
          newForest[y][x] = treeStates.BURNT;
          break;
        case treeStates.BURNT:
          if (Math.random() < p) {
            newForest[y][x] = treeStates.GREEN;
          }
          break;
        case treeStates.GREEN:
          if (
            Math.random() < f ||
            hasBurningNeighbor(forest, x, y)
          ) {
            newForest[y][x] = treeStates.BURNING;
          }
          break;
      }
    }
  }

  forest = newForest;
  drawForest();
  requestAnimationFrame(updateForest);
}

function hasBurningNeighbor(forest, x, y) {
  const neighbors = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dx, dy] of neighbors) {
    let nx = x + dx;
    let ny = y + dy;

    if (
      nx >= 0 &&
      nx < gridSize &&
      ny >= 0 &&
      ny < gridSize &&
      forest[ny][nx] === treeStates.BURNING
    ) {
      return true;
    }
  }

  return false;
}

function drawForest() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      switch (forest[y][x]) {
        case treeStates.EMPTY:
          ctx.fillStyle = 'white';
          break;
        case treeStates.GREEN:
          ctx.fillStyle = 'green';
          break;
        case treeStates.BURNING:
          ctx.fillStyle = 'red';
          break;
        case treeStates.BURNT:
          ctx.fillStyle = 'black';
          break;
      }
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

// Start the simulation
updateForest();