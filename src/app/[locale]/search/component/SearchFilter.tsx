"use client";

import I18n from "@/components/_commons/I18n";
import { PARAMS, ROUTES } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { Category, Level } from "@/models";
import { categoryService } from "@/services/courses/category.service";
import { levelService } from "@/services/courses/level.service";
import { isArray, isNumber, isString } from "lodash";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../page";

const SearchFilter: React.FC = () => {
  const searchParams = useSearchParams().toString();
  const [params, setParams] = useState<queryString.ParsedQuery<string>>({});
  const router = useI18nRouter();
  const context = useContext(SearchContext);
  const [levels, setLevels] = useState<Level[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchAPI();
  }, []);

  const fetchAPI = async () => {
    const [category, level] = await Promise.all([
      fetchCategories(),
      fetchLevels(),
    ]);
    setCategories(category);
    setLevels(level);
    setFilter(searchParams);
  };

  const parseToArray = (param: string | string[] | undefined): number[] => {
    if (!param) return [];
    return Array.isArray(param) ? param.map(Number) : [Number(param)];
  };
  const setFilter = (params: string) => {
    const _params = queryString.parse(params);
    setParams(_params);
    const categoryIds = parseToArray(_params[PARAMS.SEARCH.CATEGORY]);
    const levelNames = _params[PARAMS.SEARCH.LEVEL];
    let levelIds: number[] = [];

    if (levelNames) {
      const levelNameArray = Array.isArray(levelNames)
        ? levelNames
        : [levelNames];

      levelIds = levels
        .filter((lvl) => levelNameArray.includes(lvl.name)) // Tìm id theo name
        .map((lvl) => lvl.id);
    }
    context.setFilter({
      ...context.filter,
      levelIds,
      categoryIds,
    });
  };

  const updateFilter = (updated) => {
    const newParams = queryString.stringify({
      ...params,
      ...updated,
    });
    router.push(`${ROUTES.SEARCH}?${newParams}`);
    setFilter(newParams);
  };

  const updateParam = (param: string, selected: string[]) => {
    updateFilter({
      [param]: selected,
    });
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="text-title-md font-semibold mb-4">
        <I18n i18key="Filter By"></I18n>
      </div>
      <div className="space-y-2 overflow-auto">
        <div className="gap-4">
          <LevelFilter
            levels={levels}
            change={(value) => updateParam(PARAMS.SEARCH.LEVEL, value)}
            params={params}
          />
        </div>
        <div className="gap-4">
          <CategoryFilter
            categories={categories}
            change={(value) => updateParam(PARAMS.SEARCH.CATEGORY, value)}
            params={params}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;

const LevelFilter = ({
  change,
  params,
  levels,
}: {
  params: queryString.ParsedQuery<string>;
  change: (levels: string[]) => void;
  levels: Level[];
}) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const levelName = params?.[PARAMS.SEARCH.LEVEL];
    if (!params || !levelName) {
      setSelected({});
      return;
    }
    if (isString(levelName)) {
      setSelected({ [levelName]: true });
    } else if (isArray<string>(levelName)) {
      setSelected(
        levels.reduce((prev, cur) => {
          prev[cur.name] = levelName.includes(cur.name);
          return prev;
        }, {})
      );
    }
  }, [levels, params]);

  const onChange = (level: Level) => {
    const _levels = { ...selected };
    _levels[level.name] = !_levels[level.name];
    // setSelected({ ...selected });
    const trueKeys = Object.keys(_levels).filter((key) => _levels[key]);
    change?.(trueKeys);
  };

  return (
    <div>
      <div className="font-semibold">
        <I18n i18key="Level"></I18n>
      </div>
      <div className="gap-3 ">
        {levels?.map((level) => (
          <label
            key={level.id}
            className="flex items-center"
            onClick={() => onChange(level)}
          >
            <div
              className={`custom-checkbox-input ${
                selected[level.name] ? "checked" : ""
              }`}
            ></div>
            <span className="ml-2">{level.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const CategoryFilter = ({
  change,
  params,
  categories,
}: {
  params: queryString.ParsedQuery<string>;
  change: (categories: string[]) => void;
  categories: Category[];
}) => {
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  useEffect(() => {

    if (!params) {
      return;
    }
    const categoryIds = params[PARAMS.SEARCH.CATEGORY];
    console.log(categoryIds);
    if (isArray<string>(categoryIds)) {
      setSelected(
        categoryIds.reduce((acc, curr) => {
          acc[curr] = true;
          return acc;
        }, {})
      );
    }
    else if (isString(categoryIds)) {
      setSelected({ [+categoryIds]: true });
    }
  }, [categories, params]);

  const onChange = (category: Category) => {
    selected[category.id] = !selected[category.id];
    setSelected({ ...selected });
    const trueKeys = Object.keys(selected).filter((key) => selected[key]);
    change?.(trueKeys);
  };

  return (
    <div>
      <div className="font-semibold">
        <I18n i18key="Category"></I18n>
      </div>
      <div className="flex flex-col">
        {categories?.map((category) => (
          <label
            key={category.id}
            className="flex items-center"
            style={{
              order: selected[category.id] ? '-1' : 0
            }}
            onClick={() => onChange(category)}
          >
            <div
              className={`custom-checkbox-input ${
                selected[category.id] ? "checked" : ""
              }`}
            ></div>
            <span className="ml-2">{category.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const fetchCategories = async () => {
  try {
    const response: Category[] = await categoryService.getAll();
    return response;
  } catch (error) {
    return [];
  }
};

const fetchLevels = async () => {
  try {
    const levels: Level[] = await levelService.get();
    return levels;
  } catch (error) {
    return [];
  }
};
