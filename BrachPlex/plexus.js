const nodes = [
  { id: 'C5', x: 50, y: 30 },
  { id: 'C6', x: 50, y: 80 },
  { id: 'C7', x: 50, y: 130 },
  { id: 'C8', x: 50, y: 180 },
  { id: 'T1', x: 50, y: 230 },
  { id: 'Superior', x: 175, y: 55 },
  { id: 'Middle', x: 175, y: 130 },
  { id: 'Inferior', x: 175, y: 205 },
  { id: 'Lateral', x: 300, y: 55 },
  { id: 'Posterior', x: 300, y: 130 },
  { id: 'Medial', x: 300, y: 205 },
  { id: 'Musculocutaneous', x: 425, y: 30 },
  { id: 'Axillary', x: 425, y: 80 },
  { id: 'Radial', x: 425, y: 130 },
  { id: 'Median', x: 425, y: 180 },
  { id: 'Ulnar', x: 425, y: 230 },
];

const anteriorEdges = [
  ['C5', 'Superior'],
  ['C6', 'Superior'],
  ['C7', 'Middle'],
  ['C8', 'Inferior'],
  ['T1', 'Inferior'],
  ['Superior', 'Lateral'],
  ['Middle', 'Lateral'],
  ['Inferior', 'Medial'],
  ['Lateral', 'Musculocutaneous'],
  ['Lateral', 'Median'],
  ['Medial', 'Median'],
  ['Medial', 'Ulnar'],
];

const posteriorEdges = [
  ['Superior', 'Posterior'],
  ['Middle', 'Posterior'],
  ['Inferior', 'Posterior'],
  ['Posterior', 'Axillary'],
  ['Posterior', 'Radial'],
];

const svg = document.querySelector('svg');

function adjustSvgViewBox() {
  const width = Math.max(document.documentElement.clientWidth, 475);
  const height = Math.max(document.documentElement.clientHeight, 275);
  const aspectRatio = width / height;
  const viewBoxWidth = aspectRatio < 475 / 275 ? 475 : 275 * aspectRatio;
  const viewBoxHeight = aspectRatio < 475 / 275 ? 475 / aspectRatio : 275;
  svg.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
}

adjustSvgViewBox();
window.addEventListener('resize', adjustSvgViewBox);

nodes.forEach(node => {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', node.x - 30);
  rect.setAttribute('y', node.y - 12.5);
  rect.setAttribute('width', 60);
  rect.setAttribute('height', 25);
  rect.setAttribute('rx', 5);
  rect.setAttribute('ry', 5);
  svg.appendChild(rect);

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', node.x);
  text.setAttribute('y', node.y);
  text.textContent = node.id;
  svg.appendChild(text);
});

function drawEdge(fromNode, toNode, className) {
  const startX = fromNode.x + 30;
  const startY = fromNode.y;
  const endX = toNode.x - 30;
  const endY = toNode.y;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', startX);
  line.setAttribute('y1', startY);
  line.setAttribute('x2', endX);
  line.setAttribute('y2', endY);
  line.setAttribute('class', className);
  svg.appendChild(line);
}

function findNode(id) {
  return nodes.find(node => node.id === id);
}

anteriorEdges.forEach(edge => {
  drawEdge(findNode(edge[0]), findNode(edge[1]), 'anterior');
});

posteriorEdges.forEach(edge => {
  drawEdge(findNode(edge[0]), findNode(edge[1]), 'posterior');
});