import Two from 'two.js';
import { ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants';

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

  lineData.lines
    .reduce(
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
    )
    .map((point, index, pointList) => {
      const nextPoint = pointList[index + 1];
      if (!nextPoint) {
        return null;
      }
      const line = two.makeLine(point.x, point.y, nextPoint.x, nextPoint.y);
      line.linewidth = 5;
      return line;
    })
    .filter(Boolean);

  two.update();
}

export default function lines(element) {
  loadLines().then(data => drawLines(element, data));
}
