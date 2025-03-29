"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { createRoot, Root } from "react-dom/client";
import { formatNumber } from "@/helpers";

export interface BarChartPoint {
  label: string;
  value: number;
  extends?: any;
}

interface BarChartProps {
  data: BarChartPoint[];
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  barWidth?: number;
  barGap?: number;
  padding?: number;
  TooltipComponent?: React.FC<{ d: BarChartPoint }>;
  lineColor?: string;
  xAxisColor?: string;
  yAxisColor?: string;
  columnColor?: string;
  tickLabelColor?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 400,
  margin = { top: 20, right: 30, bottom: 30, left: 70 },
  barWidth = 100,
  barGap = 30,
  padding = 0.5,
  TooltipComponent,
  lineColor = "#a1a8cc",
  xAxisColor = "#a1a8cc",
  yAxisColor = "#a1a8cc",
  columnColor = "#4169E1",
  tickLabelColor = "#555555",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const yAxisRef = useRef<SVGSVGElement>(null);
  const chartContentRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipRootRef = useRef<Root | null>(null);

  // Tạo root ngay lập tức khi component mount
  if (tooltipRef.current && !tooltipRootRef.current) {
    tooltipRootRef.current = createRoot(tooltipRef.current);
  }

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (tooltipRootRef.current && tooltipRef.current) {
        tooltipRootRef.current.unmount();
        tooltipRootRef.current = null;
      }
    };
  }, []);

  // Hàm render tooltip
  const renderTooltip = (d: BarChartPoint) => {
    if (!tooltipRef.current) return;

    if (TooltipComponent && tooltipRootRef.current) {
      tooltipRootRef.current.render(<TooltipComponent d={d} />);
    } else {
      tooltipRef.current.innerHTML = `${formatNumber(d.value)}`;
    }
  };

  useEffect(() => {
    if (!svgRef.current || !yAxisRef.current || !chartContentRef.current)
      return;

    d3.select(svgRef.current).selectAll("*").remove();
    d3.select(yAxisRef.current).selectAll("*").remove();

    const chartWidth =
      data.length * (barWidth + barGap) - barGap + margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", chartWidth)
      .attr("height", height);

    const innerWidth = chartWidth;

    const g = svg.append("g").attr("transform", `translate(0,${margin.top})`);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .range([innerHeight, 0]);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(padding);

    const lineGroup = g.append("g").attr("class", "hover-line");

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.label) as number)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.value))
      .attr("fill", columnColor)
      .on("mouseover", (event, d) => {
        if (tooltipRef.current && chartContentRef.current) {
          tooltipRef.current.style.display = "block";

          const scrollLeft = chartContentRef.current.scrollLeft || 0;
          const x =
            (xScale(d.label) as number) +
            xScale.bandwidth() / 2 +
            margin.left -
            scrollLeft;
          const y = yScale(d.value) + margin.top;

          const chartRect = chartContentRef.current.getBoundingClientRect();
          const tooltipRect = tooltipRef.current.getBoundingClientRect();
          const chartLeft = margin.left;
          const chartRight = chartRect.width + margin.left;
          const chartTop = margin.top;
          const chartBottom = height - margin.bottom;

          let tooltipX = x - tooltipRect.width / 2;
          if (tooltipX < chartLeft) {
            tooltipX = chartLeft;
          }
          if (tooltipX + tooltipRect.width > chartRight) {
            tooltipX = chartRight - tooltipRect.width;
          }

          let tooltipY = y - tooltipRect.height - 5;
          let isAbove = true;

          if (tooltipY < chartTop) {
            tooltipY = y + (innerHeight - yScale(d.value)) + 5;
            isAbove = false;
          }
          if (tooltipY + tooltipRect.height > chartBottom) {
            tooltipY = chartBottom - tooltipRect.height;
          }

          tooltipRef.current.style.left = `${tooltipX}px`;
          tooltipRef.current.style.top = `${tooltipY}px`;

          // Gọi hàm render tooltip
          renderTooltip(d);
        }

        lineGroup
          .selectAll(".hover-line")
          .data([d])
          .join("line")
          .attr("class", "hover-line")
          .attr("x1", 0)
          .attr("x2", () => (xScale(d.label) as number) + xScale.bandwidth())
          .attr("y1", () => yScale(d.value))
          .attr("y2", () => yScale(d.value))
          .attr("stroke", lineColor)
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "5,5");
      })
      .on("mouseout", () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "none";
        }
        lineGroup.selectAll(".hover-line").remove();
      });

    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    xAxis.select(".domain").attr("stroke", xAxisColor);
    xAxis.selectAll(".tick line").attr("stroke", xAxisColor);

    const yAxis = d3
      .select(yAxisRef.current)
      .attr("width", margin.left)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yScale));

    yAxis.select(".domain").attr("stroke", yAxisColor);
    yAxis.selectAll(".tick line").attr("stroke", yAxisColor);

    d3.selectAll("g.tick text")
      .style("font-size", "14px")
      .style("fill", tickLabelColor);

    d3.selectAll("text.y-axis-label").style("font-size", "14px");
  }, [
    data,
    height,
    margin,
    barWidth,
    barGap,
    TooltipComponent,
    lineColor,
    xAxisColor,
    yAxisColor,
    tickLabelColor,
  ]);

  return (
    <div
      className="w-full overflow-auto"
      style={{ display: "flex", position: "relative" }}
    >
      <svg ref={yAxisRef} style={{ flexShrink: 0 }}></svg>
      <div ref={chartContentRef} style={{ overflowX: "auto" }}>
        <svg ref={svgRef}></svg>
      </div>
      <div
        ref={tooltipRef}
        className="absolute z-50 shadow border border-stroke rounded-md bg-white"
        style={{
          display: "none",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};

export default BarChart;
