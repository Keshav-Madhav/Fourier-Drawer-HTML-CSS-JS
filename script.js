/// Constants && Variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let time = [];

let y = [];
let x = [];
let xArrTemp = [];
let yArrTemp = [];
let fourierX = [];
let fourierY = [];
let path = [];

const XCircles = { x: canvas.width / 2, y: 100};
const YCircles = { x: 100, y: canvas.height / 2};

let drawPathFlag = false;
let userDrawFlag = true;

/// Resize Canvas
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  XCircles.x = canvas.width / 2;
  YCircles.y = canvas.height / 2;
}
resizeCanvas();


/// Mouse Events
let drawing = false;
canvas.addEventListener('mousedown', (e) => {
  if(userDrawFlag){
    drawing = true;
    xArrTemp.push(e.clientX - canvas.width / 2);
    yArrTemp.push(e.clientY - canvas.height / 2);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if(drawing && userDrawFlag) {
    xArrTemp.push(e.clientX - canvas.width / 2);
    yArrTemp.push(e.clientY - canvas.height / 2);
  }
});

canvas.addEventListener('mouseup', () => {
  if(userDrawFlag){
    drawing = false;
    x.push(xArrTemp);
    y.push(yArrTemp);
    xArrTemp = [];
    yArrTemp = [];
  }
});

window.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') {
    if(userDrawFlag) {
      userDrawFlag = false;
      drawPathFlag = true;
      console.log(x, y);
      startDrawing();
    } else {
      userDrawFlag = true;
      drawPathFlag = false;
      x = [];
      y = [];
      fourierX = [];
      fourierY = [];
      xArrTemp = [];
      yArrTemp = [];
      time = [];
    }
  }
});


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

const makeFouriers = () => {
  x.forEach((arr) => {
    tempFourier = discreteFourierTransform(arr);
    tempFourier.sort((a, b) => b.amp - a.amp);
    fourierX.push(tempFourier);
  });

  y.forEach((arr) => {
    tempFourier = discreteFourierTransform(arr);
    tempFourier.sort((a, b) => b.amp - a.amp);
    fourierY.push(tempFourier);
  });
}

const epiCycles = (x, y, rotation, fourier, t) => {
  for (let i = 0; i < fourier.length; i++) {
    let prevX = x;
    let prevY = y;
    
    let freq = fourier[i].freq;
    let rad = fourier[i].amp;
    let phase = fourier[i].phase;
    x += rad * Math.cos(freq * t + phase + rotation);
    y += rad * Math.sin(freq * t + phase + rotation);

    // Draw Circle
    ctx.strokeStyle = '#ffffff40'; 
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(prevX, prevY, rad, 0, Math.PI * 2);
    ctx.stroke(); 
    ctx.closePath();

    // Draw Point on Circle
    ctx.fillStyle = '#ffffff05';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    
    // Draw Line from Circle to Point
    ctx.strokeStyle = '#ffffff80'
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke()
  }

  return { x, y };
};

const drawPath = (fourY, fourX, index) => {
  const dt = 2 * Math.PI / fourY.length;
  time[index] += dt;

  const { x: dx, y: dy } = epiCycles(XCircles.x, XCircles.y, 0, fourX, time[index]);
  const { x: cx, y: cy } = epiCycles(YCircles.x, YCircles.y, Math.PI / 2, fourY, time[index]);
  let v = { x: dx, y: cy };

  // Add Point to Wave
  path[index].unshift(v);

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
  for(let i = 0; i < path[index].length; i++) {
    ctx.lineTo(path[index][i].x, path[index][i].y);
  }
  ctx.stroke();
  ctx.closePath();
  
  if(time[index] >= 2 * Math.PI) {
    time[index] = 0;
    path[index] = [];
  }
}

const startDrawing = () => {
  makeFouriers();
  drawPathFlag = true;
  userDrawFlag = false;
  time = [];
  path = [];
}

/// Game Loop
const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(drawPathFlag) {
    for(let i = 0; i < fourierY.length; i++) {
      time.push(0);
      path.push([]);
      drawPath(fourierY[i], fourierX[i], i);
    }
  }

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  if(userDrawFlag) {
    for (let i = 0; i < x.length; i++) {
      ctx.beginPath();
      ctx.moveTo(x[i][0] + canvas.width / 2, y[i][0] + canvas.height / 2);
      for (let j = 1; j < x[i].length; j++) {
        ctx.lineTo(x[i][j] + canvas.width / 2, y[i][j] + canvas.height / 2);
      }
      ctx.stroke();
      ctx.closePath();
    }

    if(xArrTemp.length > 0) {
      ctx.beginPath();
      ctx.moveTo(xArrTemp[0] + canvas.width / 2, yArrTemp[0] + canvas.height / 2);
      for (let i = 1; i < xArrTemp.length; i++) {
        ctx.lineTo(xArrTemp[i] + canvas.width / 2, yArrTemp[i] + canvas.height / 2);
      }
      ctx.stroke();
      ctx.closePath();
    }
  }

  requestAnimationFrame(gameLoop);
};
gameLoop();