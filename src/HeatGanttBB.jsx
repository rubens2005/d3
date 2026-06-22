import { useMemo } from 'react';
import * as d3 from 'd3';

const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.3;

export const HeatGanttBB = ({ width, height, data, schedule, interval }) => {
  data = interval;
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
  const freq = (d) => d[3];
  const min = 0;
  const max = d3.max(data.map((d) => earlyFinish(d)));

  //  data = data.filter((d, i) => i < qtd * 10);

  const n = 15; // 15 atividades
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const fillScale = useMemo(() => {
    return d3.scalePow().domain([0, 10000]).range([0, 1]).exponent(0.5);
  }, [data, height]);

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
        <rect
          x={xScale(earlyStart(d))}
          y={yScale(group(d))}
          width={xScale(duration(d)) + 0.08}
          height={yScale.bandwidth()}
          fill="#3429d5"
          opacity={fillScale(freq(d))}
        />
      </g>
    );
  });

  const gantt = schedule.map((d, i) => {
    const losango = () => {
      const x0 = xScale(earlyStart(d)) - 5;
      const y0 = yScale(group(d)) + yScale.bandwidth() * 0.3;
      const h = yScale.bandwidth() * 0.4;
      const xCentro = x0 + 5;
      const yCentro = y0 + h / 2;
      // Definição dos 4 pontos do losango: Superior, Direito, Inferior, Esquerdo
      const points = `${xCentro},${y0} ${x0 + 10},${yCentro} ${xCentro},${y0 + h} ${x0},${yCentro}`;
      return (
        <polygon points={points} opacity={1} fill={'black'} fillOpacity={1} />
      );
    };
    const y = yScale(group(d));
    if (y === undefined) {
      return null;
    }
    return (
      <g key={i}>
        {
          <text
            x={xScale(0) - 25}
            y={y + yScale.bandwidth() / 2}
            textAnchor="start"
            alignmentBaseline="central"
            fontSize={12}
          >
            {group(d)}
          </text>
        }
        {duration(d) > 0 ? (
          <rect
            x={xScale(earlyStart(d))}
            y={yScale(group(d)) + yScale.bandwidth() * 0.3}
            width={xScale(duration(d))}
            height={yScale.bandwidth() * 0.4}
            opacity={1}
            fill={critical[d[0]] === 1 ? '#ff2d2d' : '#f9f000'}
            fillOpacity={1}
            rx={1}
          />
        ) : (
          losango()
        )}
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill="#a7a3cb" opacity={0.2} />
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
