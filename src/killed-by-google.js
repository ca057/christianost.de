import 'regenerator-runtime/runtime';
// TODO: import seperate things
import * as d3 from 'd3';

// TODO: make it a separate input file and remove the style loader
import './css/killed-by-google.css';

// FIXME: remove me
import localData from './graveyard';

const SVG_ID = '#visualisation';
const KBG_JSON =
  'https://raw.githubusercontent.com/codyogden/killedbygoogle/master/graveyard.json';
const MARGINS = { top: 20, right: 20, bottom: 20, left: 20 };
const MAX_HEIGHT = 750;

function clearSvg(id) {
  d3.select(`${id} > *`).remove();
}

function getWidthAndHeight(element) {
  const { width, height } = element.getBoundingClientRect();
  return {
    width,
    height,
  };
}

async function fetchData(url) {
  const response = await fetch(url);
  if (response.status >= 400) {
    throw new Error('fetching data failed');
  }
  return response.json();
}

function prepareData(rawData) {
  if (!Array.isArray(rawData)) throw new Error('Data is not an array.');
  return rawData.map(({ dateClose, dateOpen, ...p }) => ({
    ...p,
    dateClose: new Date(dateClose),
    dateOpen: new Date(dateOpen),
  }));
}

function renderVisualisation(killedByGoogle) {
  const { width, height } = getWidthAndHeight(document.querySelector(SVG_ID));

  const vis = d3
    .select(SVG_ID)
    .attr('width', width)
    .attr('height', Math.max([height, MAX_HEIGHT]))
    .attr('transform', `translate(${MARGINS.left},${MARGINS.top})`);

  const tooltip = d3.select('#tooltip');

  const xRange = d3
    .scaleTime()
    .domain([
      d3.min(killedByGoogle, d => d.dateOpen),
      d3.max(killedByGoogle, d => d.dateClose),
    ])
    .range([MARGINS.left, width - MARGINS.right]);

  const yRange = d3
    .scaleBand()
    .domain(killedByGoogle.map(p => p.name))
    .range([MAX_HEIGHT - MARGINS.top, MARGINS.bottom])
    .padding(1);

  const xAxis = d3.axisBottom().scale(xRange);

  clearSvg(SVG_ID);

  vis
    .append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${MAX_HEIGHT - MARGINS.bottom})`)
    .call(xAxis);

  vis
    .selectAll('lines')
    .data(killedByGoogle)
    .enter()
    .append('line')
    .attr('x1', d => xRange(d.dateOpen))
    .attr('x2', d => xRange(d.dateClose))
    .attr('y1', d => yRange(d.name))
    .attr('y2', d => yRange(d.name))
    .attr('stroke', 'grey')
    .attr('stroke-width', 3)
    .attr('stroke-linecap', 'round')
    .attr('cursor', 'pointer')
    .on('mouseover', d => {
      tooltip
        .transition(d3.easeExpOut)
        .duration(200)
        .style('opacity', 1);
      tooltip
        .html(d.name)
        .style('left', `${d3.event.pageX}px`)
        .style('top', `${d3.event.pageY - 28}px`);
    })
    .on('mouseleave', () => {
      tooltip
        .transition(d3.easeExpIn)
        .duration(300)
        .style('opacity', 0);
    });
}

function renderLoading(isLoading) {
  const { width, height } = getWidthAndHeight(document.querySelector(SVG_ID));
  const margin = width * 0.05;

  let topOffset = margin;
  const lineCreationCalls = [];

  while (topOffset < height) {
    const y = topOffset;
    lineCreationCalls.push(
      () =>
        new Promise(finishedDrawing => {
          setTimeout(() => {
            d3.select(SVG_ID)
              .append('line')
              .attr('class', 'line_loading')
              .attr('x1', margin)
              .attr('x2', width - margin)
              .attr('y1', y)
              .attr('y2', y);
            finishedDrawing();
          }, 20);
        }),
    );

    topOffset += margin;
  }

  lineCreationCalls.reduce(
    (lastLineCall, currentLineCall) => lastLineCall.then(currentLineCall),
    Promise.resolve(),
  );
}

async function main() {
  try {
    renderLoading(true);
    // const data = localData;
    // const data = await fetchData(KBG_JSON);

    // renderVisualisation(prepareData(data));
  } catch (error) {
    console.log(error);
  }
}

const { readyState } = document;
if (['complete', 'loaded', 'interactive'].includes(readyState)) {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
