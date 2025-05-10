// components/PieChart.tsx
import { vibrantColors } from "@/constants";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export interface PieChartData {
  label: string;
  value: number;
  extends?: any;
}

interface PieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  customTooltip?: (data: PieChartData) => JSX.Element | string;
  showLegend?: boolean;
  centerContent?: JSX.Element | string; // Thêm prop để truyền nội dung vào giữa
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 400,
  height = 400,
  innerRadius = 0,
  outerRadius = Math.min(width, height) / 2 - 40,
  customTooltip,
  showLegend = true,
  centerContent, // Nhận nội dung để hiển thị ở giữa
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState<
    JSX.Element | string | null
  >(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [colors, setColors] = useState<string[]>([]);
  const hasData = data?.some((d) => d.value > 0);

  useEffect(() => {
    if (!svgRef.current || !data || !containerRef.current) return;

    // Kiểm tra xem có dữ liệu hợp lệ không

    // Xóa nội dung SVG cũ
    d3.select(svgRef.current).selectAll("*").remove();

    if (!hasData) {
      // Hiển thị thông điệp khi không có dữ liệu
      d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "gray")
        .attr("font-size", "16px")
        .text("No data available");
      return;
    }

    // Tạo SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Tạo pie generator
    const pie = d3
      .pie<PieChartData>()
      .sort(null)
      .value((d) => d.value);

    // Tạo arc generator
    const arc = d3
      .arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    // Tạo arc cho nhãn (đặt nhãn ra ngoài pie chart, cách xa hơn)
    const labelArc = d3
      .arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(outerRadius + 20)
      .outerRadius(outerRadius + 30);

    // Tạo màu sắc đậm và tươi hơn
    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.label))
      .range(vibrantColors);

    // Lưu trữ màu sắc để sử dụng trong legend
    const colorRange = data.map((d) => color(d.label));
    setColors(colorRange);

    // Tính tổng giá trị để hiển thị phần trăm
    const total = d3.sum(data, (d) => d.value);

    // Vẽ các phần của pie chart
    const arcs = svg
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Vẽ các phần của pie chart với hiệu ứng
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("opacity", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 1).style("cursor", "pointer");

        // Lấy vị trí của thẻ cha (position: relative)
        const containerRect = containerRef.current!.getBoundingClientRect();
        const svgRect = svgRef.current!.getBoundingClientRect();

        // Tính toán vị trí tâm của phần (arc) trong hệ tọa độ SVG
        const [x, y] = arc.centroid(d);

        // Chuyển đổi tọa độ từ hệ SVG sang tọa độ toàn cục
        const globalX = svgRect.left + x + width / 2 + window.scrollX;
        const globalY = svgRect.top + y + height / 2 + window.scrollY;

        // Chuyển đổi tọa độ toàn cục thành tọa độ tương đối so với thẻ cha
        const relativeX = globalX - containerRect.left;
        const relativeY = globalY - containerRect.top;

        setTooltipPosition({
          x: relativeX,
          y: relativeY,
        });

        // Hiển thị tooltip
        const content = customTooltip
          ? customTooltip(d.data)
          : `${d.data.label}: ${d.data.value} (${(
              (d.data.value / total) *
              100
            ).toFixed(1)}%)`;
        setTooltipContent(content);
        setTooltipVisible(true);
      })
      .on("mousemove", function (event) {
        // Lấy vị trí của thẻ cha (position: relative)
        const containerRect = containerRef.current!.getBoundingClientRect();

        // Tọa độ toàn cục của chuột
        const globalX = event.pageX + 10;
        const globalY = event.pageY + 10;

        // Chuyển đổi tọa độ toàn cục thành tọa độ tương đối so với thẻ cha
        const relativeX = globalX - containerRect.left;
        const relativeY = globalY - containerRect.top;

        setTooltipPosition({
          x: relativeX,
          y: relativeY,
        });
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.8);
        setTooltipVisible(false);
        setTooltipContent(null);
      })
      .transition()
      .duration(750)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(i(t))!;
      });

    // Thêm nhãn bên ngoài pie chart
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("font-size", "14px")
      .text((d) => `${((d.data.value / total) * 100).toFixed(1)}%`);
  }, [data, width, height, innerRadius, outerRadius, customTooltip]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col justify-center items-center"
    >
      <div className="relative">
        <svg ref={svgRef}></svg>
        {hasData && centerContent && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center p-4"
            style={{
              width: `${innerRadius * 2}px`, // Đảm bảo nội dung không vượt quá innerRadius
              height: `${innerRadius * 2}px`,
            }}
          >
            {centerContent}
          </div>
        )}
      </div>
      {tooltipVisible && tooltipContent && (
        <div
          ref={tooltipRef}
          className="absolute bg-white rounded-md shadow-lg p-2 text-sm z-20"
          style={{
            top: `${tooltipPosition.y}px`,
            left: `${tooltipPosition.x}px`,
            pointerEvents: "none",
          }}
        >
          {tooltipContent}
        </div>
      )}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4 mt-4 max-w-full">
          {data?.map((item, index) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: colors[index] }}
              ></span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;
