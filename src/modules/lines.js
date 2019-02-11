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
  console.log({ two, unit });

  let lastPoint = center;

  lineData.lines.slice(0, 2).forEach(({ value }) => {
    const line = two.makeLine(0, 0, unit, 0);
    line.linewidth = 5;
    line.translation.set(center.x, center.y);
    const valueAsRadians = toRadians(360 * value);
    line.rotation = valueAsRadians;

    // x = cx + r * cos(a)
    // y = cy + r * sin(a)
    console.log({
      nextX: center.x + unit * Math.cos(valueAsRadians),
      nextY: center.y + unit * Math.sin(valueAsRadians),
      valueAsRadians,
      valueAsDegrees: 360 * value,
    });
    two.makeCircle(
      center.x + unit * Math.cos(valueAsRadians),
      center.y + unit * Math.sin(valueAsRadians),
      5,
    );

    console.log(line, 360 * value);
  });

  // two.makeCircle(center.x, center.y, 5);

  two.update();
}

export default function lines(element) {
  loadLines().then(data => drawLines(element, data));
}
