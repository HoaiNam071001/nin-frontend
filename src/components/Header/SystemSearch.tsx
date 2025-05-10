"use client";

import { CourseStatus, PARAMS, ROUTES } from "@/constants";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import useDebounce from "@/hooks/useDebounce";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { useTranslate } from "@/hooks/useTranslate";
import { Course } from "@/models";
import { RecentSearch } from "@/models/course/recent-search.model";
import { List2Res } from "@/models/utils.model";
import { utilsAction } from "@/redux";
import { courseSearchService } from "@/services/courses/course-search.service";
import { recentSearchService } from "@/services/courses/recent-search.service";
import { usePathname, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import ClickOutside from "../_commons/ClickOutside";
import CustomImage from "../_commons/CustomImage";
import HighlightedText from "../_commons/HighlightedText";
import I18n from "../_commons/I18n";
import NButton from "../_commons/NButton";
import SvgIcon from "../_commons/SvgIcon";

const SystemSearch = () => {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState<string>(
    searchParams.get(PARAMS.SEARCH.KEYWORD) || ""
  );
  const dispatch = useDispatch();
  const router = useI18nRouter();
  const pathname = usePathname();
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchTextDebounce = useDebounce(keyword, 500);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const translate = useTranslate();
  const [searches, setSearches] = useState<RecentSearch[]>([]);

  const isSearchPage = useMemo(
    () => pathname.includes(ROUTES.SEARCH),
    [pathname]
  );
  useEffect(() => {
    if (searchTextDebounce) {
      onQuickSearch?.(searchTextDebounce);
    } else {
      setCourses([]);
    }
  }, [searchTextDebounce]);

  const onQuickSearch = async (text: string) => {
    try {
      if (isSearchPage) {
        return;
      }
      setLoading(true);
      const { content }: List2Res<Course> =
        await courseSearchService.getCourses(
          {
            status: [CourseStatus.READY],
          },
          {
            keyword: text,
          }
        );
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
    const updatedParams = !isSearchPage
      ? { [PARAMS.SEARCH.KEYWORD]: trimmedKeyword }
      : { ...currentParams, [PARAMS.SEARCH.KEYWORD]: trimmedKeyword };

    const targetUrl = `${ROUTES.SEARCH}?${queryString.stringify(
      updatedParams
    )}`;

    router.push(targetUrl);
    setShowSuggestions(false);
    addSearches(trimmedKeyword); // Thêm hoặc cập nhật recent search khi search
  };

  const onChange = (keyword: string) => {
    setKeyword(keyword);
  };

  const fetchSearches = async () => {
    try {
      const data = await recentSearchService.getRecentByUserId();
      setSearches(data);
    } catch (error) {}
  };

  const addSearches = async (keyword: string) => {
    try {
      await recentSearchService.create({
        searchQuery: keyword,
      });
      fetchSearches(); // Cập nhật lại danh sách recent searches
    } catch (error) {}
  };

  const removeSearch = async (item: RecentSearch) => {
    try {
      await recentSearchService.remove(item.id);
      setSearches(searches.filter((e) => e.id !== item.id));
    } catch (error) {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const onFocus = () => {
    setShowSuggestions(true);
    fetchSearches();
  };

  // Lọc các recent searches khớp với keyword
  const filteredSearches = useMemo(
    () =>
      searches.filter((search) =>
        search.searchQuery.toLowerCase().includes(keyword.toLowerCase())
      ),
    [searches, keyword]
  );

  const navigateCourse = (course: Course) => {
    setShowSuggestions(false);
    router.push(`${ROUTES.COURSE}/${course.slug}`);
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
            placeholder={`${translate("Type to search")}...`}
            value={keyword}
            onChange={(e) => onChange(e.target.value || "")}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            className={`placeholder:text-secondary w-full bg-transparent pl-3 pr-4 font-medium focus:outline-none min-w-[30vw] py-1 border-b transition-colors duration-200 ease-in-out
            ${showSuggestions ? "border-stroke" : "border-transparent"}
          `}
          />
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
          {/* Hiển thị recent searches khi có keyword và có kết quả khớp */}
          {keyword && filteredSearches.length > 0 && (
            <div>
              <div className="p-2 text-[var(--n-secondary)]">
                <I18n i18key="Recent searches"></I18n>
              </div>
              <div>
                {filteredSearches.map((item) => (
                  <div
                    key={item.id}
                    className="group p-2 cursor-pointer flex items-center hover:bg-[var(--n-row-hover)] gap-3"
                    onClick={() => {
                      setKeyword(item.searchQuery); // Điền keyword khi click
                      onSearch();
                    }}
                  >
                    <div>
                      <SvgIcon
                        icon="search"
                        className="icon icon-sm text-[var(--n-secondary)]"
                      />
                    </div>
                    <div className="flex-1">
                      <HighlightedText
                        text={item.searchQuery}
                        keyword={keyword}
                        className="text-ellipsis"
                      />
                    </div>
                    <NButton
                      className="ml-auto invisible group-hover:visible"
                      size="sm-circle"
                      shape="full"
                      variant="link"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn click vào suggestion khi xóa
                        removeSearch(item);
                      }}
                    >
                      <SvgIcon icon="close" className="icon icon-sm" />
                    </NButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hiển thị recent searches khi không có keyword */}
          {!keyword && searches.length > 0 && (
            <div>
              <div className="p-2 text-[var(--n-secondary)]">
                <I18n i18key="Recent searches"></I18n>
              </div>
              <div>
                {searches.map((item) => (
                  <div
                    key={item.id}
                    className="group p-2 cursor-pointer flex items-center hover:bg-[var(--n-row-hover)] gap-3"
                    onClick={() => {
                      setKeyword(item.searchQuery);
                      onSearch();
                    }}
                  >
                    <div>
                      <SvgIcon
                        icon="search"
                        className="icon icon-sm text-[var(--n-secondary)]"
                      />
                    </div>
                    <div className="flex-1">{item.searchQuery}</div>
                    <NButton
                      className="ml-auto invisible group-hover:visible"
                      size="sm-circle"
                      shape="full"
                      variant="link"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearch(item);
                      }}
                    >
                      <SvgIcon icon="close" className="icon icon-sm" />
                    </NButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hiển thị kết quả tìm kiếm khóa học */}
          {!isSearchPage && keyword && (
            <div>
              <div className="p-2 text-[var(--n-secondary)] bg-slate-50">
                <I18n i18key="Search results"></I18n>
              </div>
              {courses.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => navigateCourse(suggestion)}
                  className="p-2 cursor-pointer flex items-center hover:bg-[var(--n-row-hover)] gap-3"
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
              {!courses?.length && <div className="p-2">Empty</div>}
            </div>
          )}
        </div>
      </ClickOutside>
    </div>
  );
};

export default SystemSearch;
