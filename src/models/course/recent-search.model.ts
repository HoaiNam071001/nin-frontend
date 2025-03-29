// Định nghĩa kiểu dữ liệu cho RecentSearch
export interface RecentSearch {
  id: number;
  userId: number;
  searchQuery: string;
  createdAt: string; // ISO string từ API
  updatedAt: string; // ISO string từ API
}

// Định nghĩa payload để tạo mới
export interface RecentSearchPayload {
  searchQuery: string;
}
