import { useMemo } from 'react';
import * as d3 from 'd3';

const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.3;

export const HeatGanttAA = ({ width, height, data, schedule }) => {
  const qtd = data.length;
  const names = [
    'S',
    'a1',
    'a2',
    'a3',
    'a4',
    'a5',
    'a6',
    'a7',
    'a8',
    'a9',
    'a10',
    'a11',
    'a12',
    'a13',
    'E',
  ];
  const critical = [0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0];
  const group = (d) => `${typeof d === 'number' ? names[d] : names[d[0]]}`;
  const earlyStart = (d) => d[1];
  const earlyFinish = (d) => d[2];
  const duration = (d) => d[2] - d[1];
  const min = 0;
  const max = d3.max(data.map((d) => earlyFinish(d)));

  data = data.filter((d, i) => i < qtd * 15);

  const n = 15; // 15 atividades
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis is for groups since the barplot is horizontal
  const groups = Array.from({ length: n }, (_, i) => group(i));
  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .domain(groups)
      .range([0, boundsHeight])
      .padding(BAR_PADDING);
  }, [data, height]);

  // X axis
  const xScale = useMemo(() => {
    return d3.scaleLinear().domain([min, max]).range([0, boundsWidth]);
  }, [data, width]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    const y = yScale(group(d));
    if (y === undefined) {
      return null;
    }
    return (
      <g key={i}>
        {false && (
          <rect
            x={xScale(earlyStart(d))}
            y={yScale(group(d))}
            width={0}
            height={yScale.bandwidth()}
            opacity={0.85}
            fill="#3429d5"
            fillOpacity={0.4}
            strokeWidth={0}
            rx={0}
          />
        )}
        <rect
          x={xScale(earlyFinish(d)) - 2}
          y={yScale(group(d))}
          width={2}
          height={yScale.bandwidth()}
          opacity={0.85}
          fill="#3429d5"
          fillOpacity={0.4}
          strokeWidth={0}
          rx={0}
        />
        {i < 15 && (
          <text
            x={xScale(0) - 25}
            y={y + yScale.bandwidth() / 2}
            textAnchor="start"
            alignmentBaseline="central"
            fontSize={12}
          >
            {group(d)}
          </text>
        )}
      </g>
    );
  });

  const gantt = schedule.map((d, i) => {
    const y = yScale(group(d));
    if (y === undefined) {
      return null;
    }
    return (
      <g key={i}>
        <rect
          x={xScale(earlyStart(d))}
          y={yScale(group(d)) + yScale.bandwidth() * 0.3}
          width={xScale(duration(d))}
          height={yScale.bandwidth() * 0.4}
          opacity={1}
          fill={critical[d[0]] === 1 ? '#ff2d2d' : '#f9f000'}
          fillOpacity={1}
          rx={2}
        />
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          {allShapes}
          {gantt}
        </g>
      </svg>
    </div>
  );
};
