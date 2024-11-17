import { Category } from "@/models";
import React, { useEffect, useState } from "react";

type CategoryTabProps = {
  tabs: Category[];
};

export const CategoryTab: React.FC<CategoryTabProps> = ({ tabs }) => {
  const [tab, setTab] = useState<Category>(null);

  useEffect(() => {
    setTab(tabs?.[0]);
  }, [tabs]);

  const handleTabClick = (selectedTab: Category) => {
    setTab(selectedTab);
  };

  return (
    <>
      <div className="text-sm font-medium text-center text-gray-500 border-b-[0.5px] border-stroke dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
        {tabs?.map((category) => (
            <li key={category.id} className="me-2">
              <a
                href="#"
                onClick={() => handleTabClick(category)} // Xử lý sự kiện click
                className={`inline-block px-7 py-3 border-b-2 rounded-t-lg font-semibold ${
                  tab?.id === category.id
                    ? "text-system border-system active dark:text-system dark:border-system"
                    : "text-secondary border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
              >
                {category.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
