export const getAbbreviatedName = (fullName: string | undefined) => {
  if (!fullName) return "U"; // Nếu không có tên, trả về 'U' làm mặc định
  const nameParts = fullName.split(" ");

  // Lấy chữ cái đầu của phần tên đầu tiên và phần tên cuối cùng
  const firstInitial = nameParts[0].charAt(0).toUpperCase(); // Lấy chữ cái đầu của tên đầu tiên
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase(); // Lấy chữ cái đầu của tên cuối cùng

  return firstInitial + lastInitial; // Nối lại hai chữ cái đầu tiên và cuối cùng
};
