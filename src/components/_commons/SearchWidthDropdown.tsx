import React, { useState, useCallback } from "react";
import { Input, AutoComplete, Spin } from "antd";
import { debounce } from "lodash";
import NInput from "./NInput";

interface SearchWithAPIProps {
  apiCall: (keyword: string) => Promise<any[]>; // Hàm gọi API
  placeholder?: string;
  debounceTime?: number; // Thời gian debounce
  bindLabel?: string;
  onSearchChange?: (value: string) => void; // Callback khi giá trị thay đổi
  onSelect?: (value: { id: string; name: string }) => void; // Callback khi người dùng chọn một giá trị
}

const SearchWithDropdown: React.FC<SearchWithAPIProps> = ({
  apiCall,
  placeholder = "Tìm kiếm...",
  debounceTime = 500,
  bindLabel,
  onSearchChange,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Sử dụng useCallback để tránh việc tạo lại hàm fetchData mỗi lần render
  const fetchData = useCallback(
    debounce(async (keyword: string) => {
      if (!keyword) {
        setOptions([]);
        return;
      }

      setLoading(true);

      try {
        const data = await apiCall(keyword); // Gọi API
        setOptions(data); // Cập nhật kết quả tìm kiếm
      } catch (error) {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, debounceTime),
    [] // Chỉ tạo lại fetchData khi lần đầu tiên render
  );

  // Xử lý sự thay đổi trong ô tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
    fetchData(value); // Gọi API
  };

  // Xử lý sự kiện khi người dùng chọn kết quả
  const handleSelect = (value: string) => {
    const selectedOption = options.find((option) => (bindLabel ? option[bindLabel] : option) === value);
    if (selectedOption && onSelect) {
      onSelect(selectedOption); // Truyền đối tượng {id, name} ra ngoài khi người dùng chọn
    }
  };

  return (
    <div className="w-full">
      <AutoComplete
        value={searchTerm}
        onChange={handleSearch}
        onSelect={handleSelect}
        placeholder={placeholder}
        style={{ width: "100%" }}
        popupMatchSelectWidth={false}
        options={options.map((option) => ({
          value: bindLabel ? option[bindLabel] : option,
        }))}
      >
        <Input className="border-stroke" size="large"/>
      </AutoComplete>
      
    </div>
  );
};

export default SearchWithDropdown;
