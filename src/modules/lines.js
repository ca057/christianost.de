import Two from 'two.js';

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function loadLines() {
  return fetch('data.json').then(res => res.json());
}

function animatePath(path, onStopCallback) {
  if (path.ending > 0.9999) {
    path.ending = 1;
    onStopCallback();
  }

  path.ending += 0.01;
}

/**
 *
 * @param {HTMLElement} element
 * @param {Object} lineData
 */
function drawLines(element, lineData) {
  if (!element) {
    console.error('No canvas passed, can’t draw lines.');
    return;
  }
  const { clientWidth, clientHeight } = element;
  const two = new Two({
    height: clientHeight,
    width: clientWidth,
  }).appendTo(element);

  const unit = two.height / 10;
  const center = { x: 0, y: 0 };

  const pointsToDraw = lineData.lines.reduce(
    (accum, { value }) => {
      const valueAsRadians = toRadians(360 * value);
      const previousPoint = accum[accum.length - 1];
      const nextPoint = {
        x: previousPoint.x + unit * Math.cos(valueAsRadians),
        y: previousPoint.y + unit * Math.sin(valueAsRadians),
      };

      return [...accum, nextPoint];
    },
    [center],
  );

  const path = two.makePath(
    ...pointsToDraw.reduce((accum, curr) => [...accum, curr.x, curr.y], []),
    true,
  );
  path.curved = true;
  path.linewidth = 5;
  path.ending = 1;

  const boundingClientRect = path.getBoundingClientRect();
  path.translation.set(
    boundingClientRect.width / 2,
    boundingClientRect.height / 2,
  );
  path.ending = 0;

  two.bind('update', () => animatePath(path, () => two.pause())).play();
}

export default function lines(element) {
  try {
    loadLines().then(data => drawLines(element, data));
  } catch (ignoreMe) {
    console.log(ignoreMe);
  }
}
