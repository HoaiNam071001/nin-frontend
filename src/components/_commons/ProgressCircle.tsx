"use client";

const ProgressCircle = ({
  percentage,
  size = 50,
  strokeWidth = 5,
  fontSize = 14,
}) => {
  // Tính toán các giá trị cho SVG
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        {/* Vòng tròn nền */}
        <circle
          className="fill-none stroke-gray-200"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Vòng tròn tiến trình */}
        <circle
          className="fill-none stroke-system"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            strokeLinecap: "round",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>
      {/* Hiển thị phần trăm */}
      <div
        className="absolute font-bold text-gray-800"
        style={{ fontSize: fontSize }}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default ProgressCircle;
