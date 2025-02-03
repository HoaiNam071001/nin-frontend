type HighlightedTextProps = {
  text: string;
  keyword: string;
  highlightClass?: string; // Tùy chỉnh class nếu cần
  className?: string; // Tùy chỉnh class nếu cần
};

const HighlightedText = ({
  text,
  keyword,
  className,
  highlightClass = "text-system font-semibold",
}: HighlightedTextProps) => {
  if (!keyword || !text) return <>{text}</>;

  const regex = new RegExp(`(${keyword})`, "gi"); // Regex tìm từ khóa
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={index} className={highlightClass}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default HighlightedText;
