export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return value.toLocaleString("vi-VN"); // Định dạng số theo chuẩn Việt Nam
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const k = 1024; // 1 KB = 1024 Bytes
  const i = Math.floor(Math.log(bytes) / Math.log(k)); // Tính chỉ số của đơn vị

  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2)); // Chuyển đổi và giới hạn 2 chữ số thập phân
  return `${size} ${units[i]}`;
}