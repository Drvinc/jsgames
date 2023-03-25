const canvas = document.getElementById('solarSystem');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const viewAngle = 20;
const planets = [
    {name: 'Sun', radius: 20, orbitRadius: 0, orbitSpeed: 0},
    {name: 'Mercury', radius: 2, orbitRadius: 60, orbitSpeed: 4.74},
    {name: 'Venus', radius: 4, orbitRadius: 110, orbitSpeed: 3.5},
    {name: 'Earth', radius: 4.5, orbitRadius: 150, orbitSpeed: 2.98},
    {name: 'Mars', radius: 3, orbitRadius: 228, orbitSpeed: 2.41},
    {name: 'Jupiter', radius: 10, orbitRadius: 400, orbitSpeed: 1.31},
    {name: 'Saturn', radius: 8, orbitRadius: 700, orbitSpeed: 0.968},
    {name: 'Uranus', radius: 6, orbitRadius: 1400, orbitSpeed: 0.681},
    {name: 'Neptune', radius: 6, orbitRadius: 2100, orbitSpeed: 0.542},
];

let animationActive = true;
document.getElementById('toggleBtn').addEventListener('click', () => {
    animationActive = !animationActive;
    if (animationActive) {
        document.getElementById('toggleBtn').innerText = 'Pause';
        animate();
    } else {
        document.getElementById('toggleBtn').innerText = 'Resume';
    }
});

function drawPlanet(planet, angle) {
    const x = canvas.width / 2 + Math.cos(angle) * planet.orbitRadius;
    const y = canvas.height / 2 + Math.sin(angle) * planet.orbitRadius * Math.cos(viewAngle * Math.PI / 180);
    ctx.beginPath();
    ctx.arc(x, y, planet.radius, 0, 2 *Math.PI);
    ctx.fillStyle = planet.name === 'Sun' ? 'yellow' : 'white';
    ctx.fill();
    ctx.closePath();
}
    
function animate() {
    if (!animationActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let planet of planets) {
    planet.angle = (planet.angle || 0) + planet.orbitSpeed * Math.PI / 180;
    drawPlanet(planet, planet.angle);
    }

    requestAnimationFrame(animate);
}

animate();