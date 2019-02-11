import Two from 'two.js';

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function loadLines() {
  return fetch('data.json').then(res => res.json());
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

  const unit = two.height / lineData.lines.length;
  const center = { x: two.width / 2, y: two.height / 2 };

  let lastPoint = center;

  lineData.lines.forEach(({ value }) => {
    const line = two.makeLine(0, 0, unit, 0);

    const valueAsRadians = toRadians(360 * value);
    const nextPoint = {
      x: lastPoint.x + unit * Math.cos(valueAsRadians),
      y: lastPoint.y + unit * Math.sin(valueAsRadians),
    };

    line.translation.set(lastPoint.x, lastPoint.y);
    line.linewidth = 5;
    line.rotation = valueAsRadians;

    lastPoint = nextPoint;
  });

  two.update();
}

export default function lines(element) {
  loadLines().then(data => drawLines(element, data));
}
