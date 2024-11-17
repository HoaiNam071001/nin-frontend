import { useState } from "react";
import SvgIcon from "../_commons/SvgIcon";
import I18n from "../_commons/I18n";

const SystemSearch = () => {
  const [keyword, setKeyword] = useState<string>("");

  const onSearch = () => {
    if (keyword.trim()) {
      console.log("Searching for:", keyword);
      // Add search logic here
    } else {
      console.log("Please enter a search term");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="w-full border-stroke border-[1px] p-2 flex rounded-md">
      <button className="px-2" >
        <SvgIcon
          icon="search"
          className="icon icon-md text-black"
        />
      </button>

      <input
        type="text"
        placeholder="Type to search..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent pl-3 pr-4 font-medium focus:outline-none min-w-[30vw]"
      />

      <button
        className="px-2 text-black rounded-md py-1 font-medium bg-gray-4 hover:bg-gray"
        onClick={onSearch}
      >
        <I18n i18key="Search"></I18n>
      </button>
    </div>
  );
};

export default SystemSearch;
