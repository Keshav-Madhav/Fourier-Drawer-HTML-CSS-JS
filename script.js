/// Constants && Variables

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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

  requestAnimationFrame(gameLoop);
};
gameLoop();