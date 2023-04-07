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
  { id: 'Musculocut', x: 425, y: 30, connections: ['Lateral', 'Superior', 'Middle','C5', 'C6', 'C7'] },
  { id: 'Axillary', x: 425, y: 80, connections: ['Posterior', 'Superior','C5', 'C6'] },
  { id: 'Radial', x: 425, y: 130, connections: ['Posterior','Superior','Middle','Inferior','C5','C6','C7','C8','T1'] },
  { id: 'Median', x: 425, y: 180, connections: ['Medial','Lateral','Inferior','Middle','Superior','C6','C7','C8','T1'] },
  { id: 'Ulnar', x: 425, y: 230, connections: ['Medial','Inferior','C8','T1'] },
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
  ['Lateral', 'Musculocut'],
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


function highlightNode(id, state) {
  const node = findNode(id);
  if (state) {
    node.rect.setAttribute('class', 'highlight-node');
  } else {
    node.rect.removeAttribute('class');
  }
}

function highlightEdge(edge, state) {
  if (state) {
    edge.line.setAttribute('class', 'highlight-edge');
  } else {
    edge.line.setAttribute('class', edge.className);
  }
}

function shouldHighlightEdge(edge, node) {
  const [from, to] = edge;
  const isConnectedDirectly = from === node.id || to === node.id;
  const isConnectedIndirectly = node.connections.includes(from) && node.connections.includes(to);

  return isConnectedDirectly || isConnectedIndirectly;
}

function handleMouseEnter(node) {
  highlightNode(node.id, true);
  node.connections.forEach(connectionId => highlightNode(connectionId, true));

  drawnAnteriorEdges.concat(drawnPosteriorEdges).forEach(edgeObj => {
    if (shouldHighlightEdge([edgeObj.from, edgeObj.to], node)) {
      highlightEdge(edgeObj, true);
    }
  });
}

function handleMouseLeave(node) {
  highlightNode(node.id, false);
  node.connections.forEach(connectionId => highlightNode(connectionId, false));

  drawnAnteriorEdges.concat(drawnPosteriorEdges).forEach(edgeObj => {
    if (shouldHighlightEdge([edgeObj.from, edgeObj.to], node)) {
      highlightEdge(edgeObj, false);
    }
  });
}

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

  // Add the rect element to the node object
  node.rect = rect;

  rect.addEventListener('mouseenter', () => handleMouseEnter(node));
  rect.addEventListener('mouseleave', () => handleMouseLeave(node));
  text.addEventListener('mouseenter', () => handleMouseEnter(node));
  text.addEventListener('mouseleave', () => handleMouseLeave(node));
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

  return line;
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

const drawnAnteriorEdges = anteriorEdges.map(edge => ({
  from: edge[0],
  to: edge[1],
  className: 'anterior',
  line: drawEdge(findNode(edge[0]), findNode(edge[1]), 'anterior'),
}));

const drawnPosteriorEdges = posteriorEdges.map(edge => ({
  from: edge[0],
  to: edge[1],
  className: 'posterior',
  line: drawEdge(findNode(edge[0]), findNode(edge[1]), 'posterior'),
}));