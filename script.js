/** @type {HTMLButtonElement} */
const startButton = document.getElementById('start');
/** @type {HTMLButtonElement} */
const resetButton = document.getElementById('reset');
/** @type {HTMLInputElement} */
const sourceInput = document.getElementById('source');
/** @type {HTMLInputElement} */
const qualityInput = document.getElementById('quality');
/** @type {HTMLInputElement} */
const methodInput = document.getElementById('method');
/** @type {HTMLInputElement} */
const iterationInput = document.getElementById('iteration');
/** @type {HTMLInputElement} */
const waitInput = document.getElementById('wait');
/** @type {HTMLFormElement} */
const form = document.getElementById('form');
/** @type {HTMLCanvasElement} */
const originalCanvas = document.getElementById('originalCanvas');
/** @type {HTMLCanvasElement} */
const resultCanvas = document.getElementById('resultCanvas');
/** @type {HTMLOutputElement} */
const resultOutput = document.getElementById('result');
/** @type {HTMLProgressElement} */
const progress = document.getElementById('progress');


const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = 900;

async function setCanvas(canvas, image) {
  const ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
}

async function clearCanvas(canvas) {
  canvas.width = DEFAULT_WIDTH;
  canvas.height = DEFAULT_HEIGHT;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

sourceInput.addEventListener('input', async event => {
  const files = sourceInput.files;
  progress.value = 0;
  if (files) {
    const image = await createImageBitmap(files[0]);
    setCanvas(originalCanvas, image);
  } else {
    clearCanvas(originalCanvas);
    clearCanvas(resultCanvas);
  }
});

startButton.addEventListener('click', async () => {
  sourceInput.required = true;
  if (!form.checkValidity()) return;

  resultOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const quality = parseInt(qualityInput.value) / 100;
  const iteration = parseInt(iterationInput.value);
  const type = methodInput.value;
  const wait = parseInt(waitInput.value) / 1000;

  setCanvas(resultCanvas, originalCanvas);
  const ctx = resultCanvas.getContext('2d');
  progress.max = iteration;
  for (let i = 0; i < iteration; i++) {
    const image = await new Promise(resolve => resultCanvas.toBlob(resolve, type, quality))
      .then(createImageBitmap);
    ctx.drawImage(image, 0, 0);
    progress.value = i + 1;
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
  }
});

resetButton.addEventListener('click', () => {
  sourceInput.required = false;
  clearCanvas(originalCanvas);
  clearCanvas(resultCanvas);
  progress.value = 0;
});
