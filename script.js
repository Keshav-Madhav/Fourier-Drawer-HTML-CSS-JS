/// Constants && Variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let time = 0;

let y = [];
let x = [];
let path = [];

const XCircles = { x: canvas.width -50, y: 200};
const YCircles = { x: 150, y: canvas.height -250};



/// Resize Canvas
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  XCircles.x = canvas.width - 350;
  YCircles.y = canvas.height - 250;
}
resizeCanvas();



/// Fourier Transform
const discreteFourierTransform = (y) => { // y : Array of Points
  let X = [];                    // Array of Fourier Transform Coefficients
  const N = y.length;

  for (let k = 0; k < N; k++) {  // Loop through all Frequencies (k)
    let re = 0;
    let im = 0;

    for (let n = 0; n < N; n++) {             // Loop through all Points
      const phi = (Math.PI * 2 * k * n) / N;  // Phase of the Wave
      re += y[n] * Math.cos(phi);             // Real Part
      im -= y[n] * Math.sin(phi);             // Imaginary Part
    }

    re /= N;          // Average of Real Part
    im /= N;          // Average of Imaginary Part

    const freq = k;                            // Frequency
    const amp = Math.sqrt(re * re + im * im);  // Amplitude
    const phase = Math.atan2(im, re);          // Phase

    X[k] = { re, im, freq, amp, phase };       
  }

  return X; 
};
const fourierY = discreteFourierTransform(y);
const fourierX = discreteFourierTransform(x);


const epiCycles = (x, y, rotation, fourier) => {
  for (let i = 0; i < fourier.length; i++) {
    let prevX = x;
    let prevY = y;
    
    let freq = fourier[i].freq;
    let rad = fourier[i].amp;
    let phase = fourier[i].phase;
    x += rad * Math.cos(freq * time + phase + rotation);
    y += rad * Math.sin(freq * time + phase + rotation);

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

  return { x, y };
};

/// Game Loop
const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dt = 2 * Math.PI / fourierY.length;
  time += dt;

  const { x: dx, y: dy } = epiCycles(XCircles.x, XCircles.y, 0, fourierX);
  const { x: cx, y: cy } = epiCycles(YCircles.x, YCircles.y, Math.PI / 2, fourierY);
  let v = { x: dx, y: cy };

  // Add Point to Wave
  path.unshift(v);

  // Draw Line from X Fourier to resulting Point
  ctx.beginPath();
  ctx.moveTo(dx, dy);
  ctx.lineTo(v.x, v.y);
  ctx.stroke();
  ctx.closePath();

  // Draw Line from Y Fourier to resulting Point
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(v.x, v.y);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  for(let i = 0; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();
  ctx.closePath();

  requestAnimationFrame(gameLoop);
};
gameLoop();