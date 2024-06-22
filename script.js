/// Constants && Variables

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let time = 0;
let radius = 100;

/// Resize Canvas
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();


/// Game Loop
const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  time -= 0.03;

  ctx.strokeStyle = 'white'; 
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(200, 200, radius, 0, Math.PI * 2);
  ctx.stroke(); 
  ctx.closePath();

  let x = 200 + radius * Math.cos(time);
  let y = 200 + radius * Math.sin(time);

  ctx.beginPath();
  ctx.moveTo(200, 200);
  ctx.lineTo(x, y);
  ctx.stroke()

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill(); // Fill the shape
  ctx.closePath();


  requestAnimationFrame(gameLoop);
};
gameLoop();