export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0, // Ensure at least 2 decimal places
    maximumFractionDigits: 2, // Ensure at most 2 decimal places
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const k = 1024; // 1 KB = 1024 Bytes
  const i = Math.floor(Math.log(bytes) / Math.log(k)); // Tính chỉ số của đơn vị

  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(1)); // Chuyển đổi và giới hạn 2 chữ số thập phân
  return `${size} ${units[i]}`;
}
