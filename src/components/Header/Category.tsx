import { useState } from "react";
import I18n from "../_commons/I18n";
import SvgIcon from "../_commons/SvgIcon";
import Link from "next/link";
import { ROUTES } from "@/constants";

const categoryList = [
  {
    name: "Development",
  },
  {
    name: "Development 2",
  },
  {
    name: "Development 3",
  },
  {
    name: "Development 4",
  },
  {
    name: "Development 4",
  },
  {
    name: "Development 4",
  },
  {
    name: "Development 4",
  },
  {
    name: "Development 4",
  },
  {
    name: "Development 4",
  },  
];

export function Category() {
  const [categories] = useState(categoryList);

  return (
    <div className="group relative cursor-pointer">
      <div className="flex items-center justify-between space-x-2 px-4 py-4">
        <a className="menu-hover text-base font-medium text-system">
          <I18n i18key="Category"></I18n>
        </a>
        <span className="group-hover:rotate-0 rotate-180 transition-all">
          <SvgIcon icon="arrow" className="icon icon-md text-system"></SvgIcon>
        </span>
      </div> 

      <div className="invisible absolute z-50 flex w-[300px] flex-col rounded-md max-h-[300px] overflow-auto
        space-y-3 bg-gray-100 py-3 px-4 text-gray-800 shadow-xl group-hover:visible">
        {categories.map((category, index) => (
          <Link href={ROUTES.HOME} key={index} className="bg-gray-3 rounded-md border border-stroke px-3 py-1">
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
