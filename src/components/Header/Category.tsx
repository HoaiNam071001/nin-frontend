"use client";

import { PARAMS, ROUTES } from "@/constants";
import { categoryService } from "@/services/courses/category.service";
import { useEffect, useState } from "react";
import I18n from "../_commons/I18n";
import { I18nLink } from "../_commons/I18nLink";
import SvgIcon from "../_commons/SvgIcon";

export function Category() {
  const [categories, setCategories] = useState([]);
  const getCategory = async () => {
    try {
      const response = await categoryService.getAllParent();
      setCategories(response);
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="relative">
      {/* Nút Categories */}
      <div className="group cursor-pointer">
        <div className="flex items-center justify-between space-x-2 px-4 py-4">
          <a className="menu-hover text-base font-medium text-system">
            <I18n i18key="Category"></I18n>
          </a>
          <span className="group-hover:rotate-0 rotate-180 transition-all">
            <SvgIcon
              icon="arrow"
              className="icon icon-md text-system"
            ></SvgIcon>
          </span>
        </div>

        {/* Danh mục cấp 1 */}
        <div
          className="invisible absolute left-0 flex w-[300px] flex-col rounded-md bg-white shadow-xl 
        group-hover:visible transition-all h-[60vh] border-[0.5px] border-stroke"
        >
          {categories.map((category, index) => (
            <div key={index} className="hover-parent">
              {/* Mục cấp 1 */}
              <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-100">
                <I18nLink
                  href={`${ROUTES.SEARCH}?${PARAMS.SEARCH.CATEGORY}=${category.id}`}
                  className="text-gray-800"
                >
                  <I18n i18key={category.name} />
                </I18nLink>
              </div>

              {/* Danh mục cấp 2 */}
              {category.subcategories && (
                <div className="hover-child absolute left-full top-0 pl-2 w-[250px]  border-[0.5px] border-stroke">
                  <div className="rounded-md bg-white flex-col shadow-xl flex h-[60vh]">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <I18nLink
                        key={subIndex}
                        href={`${ROUTES.SEARCH}?${PARAMS.SEARCH.CATEGORY}=${subcategory.id}`}
                        className="px-4 py-2 hover:bg-gray-100 text-gray-800"
                      >
                        <I18n i18key={subcategory.name} />
                      </I18nLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
