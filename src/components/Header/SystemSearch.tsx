"use client";

import { useEffect, useState } from "react";
import SvgIcon from "../_commons/SvgIcon";
import I18n from "../_commons/I18n";
import { useDispatch } from "react-redux";
import { utilsAction } from "@/redux";
import { usePathname, useSearchParams } from "next/navigation";

import { CourseStatus, PARAMS, ROUTES } from "@/constants";
import queryString from "query-string";
import ClickOutside from "../_commons/ClickOutside";
import useDebounce from "@/hooks/useDebounce";
import { Course } from "@/models";
import { List2Res } from "@/models/utils.model";
import CustomImage from "../_commons/CustomImage";
import HighlightedText from "../_commons/HighlightedText";
import { courseSearchService } from "@/services/course-search.service";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { useTranslate } from "@/hooks/useTranslate";

const SystemSearch = () => {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState<string>(
    searchParams.get(PARAMS.SEARCH.KEYWORD) || ""
  );
  const dispatch = useDispatch();
  const router = useI18nRouter();
  const pathname = usePathname();
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchTextDebounce = useDebounce<string>(keyword, 500);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const translate = useTranslate();

  useEffect(() => {
    if (searchTextDebounce) {
      onQuickSearch?.(searchTextDebounce);
    } else {
      setCourses([]);
    }
  }, [searchTextDebounce]);

  const onQuickSearch = async (text: string) => {
    try {
      setLoading(true);
      const { content }: List2Res<Course> =
        await courseSearchService.getCourses({
          status: [CourseStatus.READY],
        }, {
          keyword: text,
        });
      setCourses(content);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onSearch = () => {
    const trimmedKeyword = keyword.trim();
    dispatch(utilsAction.changeKeyword(trimmedKeyword));
    const currentParams = queryString.parse(searchParams.toString());

    const updatedParams =
      pathname !== ROUTES.SEARCH
        ? { [PARAMS.SEARCH.KEYWORD]: trimmedKeyword }
        : { ...currentParams, [PARAMS.SEARCH.KEYWORD]: trimmedKeyword };

    const targetUrl = `${ROUTES.SEARCH}?${queryString.stringify(
      updatedParams
    )}`;

    router.push(targetUrl);
    setShowSuggestions(false);
  };

  const onChange = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div>
      <ClickOutside
        onClick={() => setShowSuggestions(false)}
        className="relative"
      >
        <div
          className={`w-full border-stroke border-[1px] px-2 py-1 flex rounded-md
            ${showSuggestions ? "border-b-transparent rounded-b-none" : ""}
        `}
        >
          <button className="px-2">
            <SvgIcon
              icon="search"
              className="icon icon-md text-[var(--n-secondary)]"
            />
          </button>

          <input
            type="text"
            placeholder={`${translate('Type to search')} ...`}
            value={keyword}
            onChange={(e) => onChange(e.target.value || "")}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            className={`w-full bg-transparent pl-3 pr-4 font-medium focus:outline-none min-w-[30vw] py-1 border-b transition-colors duration-200 ease-in-out
            ${showSuggestions ? "border-stroke" : "border-transparent"}
        `}
          />

          {/* <button
            className="px-2 text-black rounded-md py-1 font-medium bg-gray-200 hover:bg-[var(--n-row-hover]"
            onClick={onSearch}
          >
            <I18n i18key="Search"></I18n>
          </button> */}
        </div>
        <div
          className={`absolute left-0 top-full w-full bg-white border border-t-0 border-[var(--n-border)] shadow-lg rounded-md rounded-t-none max-h-[70vh] overflow-y-auto transition-all duration-200 ease-in-out 
    ${
      showSuggestions
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-5 pointer-events-none"
    }
  `}
        >
          {/* <div className="flex items-center gap-3 p-2 ">
              <SvgIcon icon={"system-search"} className="h-[25px] " />
              <div>
                <I18n i18key="Results"></I18n>
              </div>
            </div> */}

          {!keyword && (
            <div>
              <div className="p-2 text-[var(--n-secondary)]">
                <I18n i18key="Recent searches"></I18n>
              </div>

              <div>
                <div
                  className={`p-2 cursor-pointer flex items-center hover:bg-[var(--n-row-hover)] gap-3`}
                >
                  <div>
                    <SvgIcon
                      icon="search"
                      className="icon icon-sm text-[var(--n-secondary)]"
                    />
                  </div>
                  <div className="">
                    <div>Công nghệ</div>
                  </div>
                </div>
                <div
                  className={`p-2 cursor-pointer flex items-center hover:bg-[var(--n-row-hover)] gap-3`}
                >
                  <div>
                    <SvgIcon
                      icon="search"
                      className="icon icon-sm text-[var(--n-secondary)]"
                    />
                  </div>
                  <div className="">
                    <div>Công nghệ</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {keyword && (
            <div>
              <div className="p-2 text-[var(--n-secondary)] bg-slate-50">
                <I18n i18key="Search results"></I18n>
              </div>
              {courses.map((suggestion, index) => (
                // <li
                //   key={index}
                //   onClick={() => onSearch()}
                //   className={`p-2 cursor-pointer hover:bg-gray-100 ${
                //     selectedIndex === index ? "bg-gray-200" : ""
                //   }`}
                // >
                //   {suggestion}
                // </li>
                <div
                  key={index}
                  onClick={() => onSearch()}
                  className={`p-2 cursor-pointer flex items-center hover:bg-[var(--n-row-hover)] gap-3`}
                >
                  <div>
                    <CustomImage
                      src={suggestion.thumbnail || DEFAULT_COURSE_THUMBNAIL}
                      alt="preview"
                      className="w-[50px] h-[30px] rounded-sm border-stroke border"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-ellipsis">
                      <HighlightedText
                        text={suggestion.name}
                        keyword={keyword}
                        className="text-ellipsis"
                      />
                    </div>
                    <div className="text-[12px] opacity-50 text-ellipsis">
                      <HighlightedText
                        text={suggestion.summary}
                        keyword={keyword}
                        className="text-ellipsis"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ClickOutside>
    </div>
  );
};

export default SystemSearch;
