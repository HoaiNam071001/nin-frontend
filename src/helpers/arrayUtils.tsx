// Hàm tìm index của phần tử trong mảng
const findItemIndex = <T,>(array: T[], item: T, key?: keyof T): number => {
  if (key) {
    // Nếu có key, tìm kiếm theo key
    return array.findIndex((i) => i[key] === item[key]);
  }
  // Nếu không có key, so sánh trực tiếp
  return array.findIndex((i) => i === item);
};

// Hàm upsertItem - thêm mới hoặc cập nhật item trong mảng
export const upsertItem = <T,>(array: T[], item: T, key?: keyof T): T[] => {
  const index = findItemIndex(array, item, key);

  if (index === -1) {
    return [...array, item]; // Thêm mới nếu không tìm thấy
  }

  // Cập nhật nếu tìm thấy
  return array.map((i, idx) => (idx === index ? item : i));
};

// Hàm removeItem - xóa item trong mảng
export const removeItem = <T,>(array: T[], item: T, key?: keyof T): T[] => {
  const index = findItemIndex(array, item, key);

  if (index === -1) {
    return array; // Không thay đổi nếu không tìm thấy
  }

  // Xóa phần tử nếu tìm thấy
  return array.filter((_, idx) => idx !== index);
};
