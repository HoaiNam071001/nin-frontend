"use client";

import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface DataPoint {
  date: Date;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 400,
  margin = { top: 20, right: 30, bottom: 30, left: 40 },
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    // Tính toán chiều rộng của biểu đồ dựa trên số lượng điểm dữ liệu và chiều rộng cột
    const columnWidth = 100;
    const chartWidth = data.length * columnWidth + margin.left + margin.right;
    const svg = d3
      .select(svgRef.current)
      .attr("width", chartWidth)
      .attr("height", height);

    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .range([innerHeight, 0]);

    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value));

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    g.append("g").call(d3.axisLeft(yScale));
  }, [data, height, margin]);

  return (
    <div ref={containerRef} style={{ overflowX: "auto" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineChart;
