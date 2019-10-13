import * as d3 from 'd3';

import './css/killed-by-google.css';

const SVG_ID = '#visualisation';
const visElement = document.querySelector(SVG_ID);
const KBG_JSON =
  'https://raw.githubusercontent.com/codyogden/killedbygoogle/master/graveyard.json';

const MARGINS = { top: 20, right: 20, bottom: 20, left: 20 };
const { width: WIDTH, height } = visElement.getBoundingClientRect();
const HEIGHT = 750;

const vis = d3
  .select(SVG_ID)
  .attr('width', WIDTH)
  .attr('height', Math.max(HEIGHT, height))
  .attr('transform', `translate(${MARGINS.left},${MARGINS.top})`);

d3.json(KBG_JSON).then(data => {
  const killedByGoogle = data.map(({ dateClose, dateOpen, ...p }, index) => ({
    ...p,
    dateClose: new Date(dateClose),
    dateOpen: new Date(dateOpen),
    index,
  }));
  const tooltip = d3.select('#tooltip');

  const xRange = d3
    .scaleTime()
    .domain([
      d3.min(killedByGoogle, d => d.dateOpen),
      d3.max(killedByGoogle, d => d.dateClose),
    ])
    .range([MARGINS.left, WIDTH - MARGINS.right]);

  const yRange = d3
    .scaleBand()
    .domain(killedByGoogle.map(p => p.name))
    .range([HEIGHT - MARGINS.top, MARGINS.bottom])
    .padding(1);

  const xAxis = d3.axisBottom().scale(xRange);

  vis
    .append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${HEIGHT - MARGINS.bottom})`)
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
});
