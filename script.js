/// Constants && Variables

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let time = 0;
let radius = 100;

let wave = []

const circlePosX = 200;
const circlePosY = 200;

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

  time += 0.03;

  let x = circlePosX;
  let y = circlePosY;

  for (let i = 0; i < 10; i++) {
    let prevX = x;
    let prevY = y;
    
    let n = i * 2 + 1;
    let rad = radius * (4 / (n * Math.PI))
    x += rad * Math.cos(n * time);
    y += rad * Math.sin(n * time);

    // Draw Circle
    ctx.strokeStyle = '#ffffff70'; 
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(prevX, prevY, rad, 0, Math.PI * 2);
    ctx.stroke(); 
    ctx.closePath();

    // Draw Point on Circle
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    
    // Draw Line from Circle to Point
    ctx.strokeStyle = '#ffffff'
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke()
  }

  // Add Point to Wave
  wave.unshift(y);

  // Draw Line from Last Point to Wave
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(circlePosX + 200, y);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  for(let i = 0; i < wave.length; i++) {
    ctx.lineTo(circlePosX + 200 + i, wave[i]);
  }
  ctx.stroke();
  ctx.closePath();

  requestAnimationFrame(gameLoop);
};
gameLoop();