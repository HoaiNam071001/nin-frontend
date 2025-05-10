"use client";

import { CourseTargetType } from "@/models";
import { useEffect, useState } from "react";

const CourseTargetList = ({ items }) => {
  const [targets, setTargets] = useState<{
    [key in CourseTargetType]?: string[];
  }>({});

  useEffect(() => {
    if (items?.length) {
      const _targets = items.reduce((acc, cur) => {
        if (!cur?.type || !cur?.content) {
          return acc;
        }
        try {
          acc[cur.type] = JSON.parse(cur.content); // Parse content thành mảng chuỗi
        } catch (error) {
          acc[cur.type] = []; // Nếu parse lỗi, gán mảng rỗng
        }
        return acc;
      }, {} as { [key in CourseTargetType]?: string[] });
      setTargets(_targets);
    } else {
      setTargets({});
    }
  }, [items]);
  return (
    <>
      {/* Hiển thị Targets theo từng loại */}
      {Object.keys(targets).length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Mục tiêu khóa học</h4>
          {Object.entries(targets).map(([type, targetList]) => (
            <div key={type} className="mb-4">
              <h5 className="text-md font-medium ">
                {type === CourseTargetType.achieved
                  ? "Bạn sẽ học gì?"
                  : type === CourseTargetType.requirement
                  ? "Yêu cầu tham gia"
                  : type === CourseTargetType.object
                  ? "Đối tượng hướng đến"
                  : type}
              </h5>
              <ul className="list-disc pl-5 space-y-2">
                {targetList?.map((target, index) => (
                  <li key={index} className="text-gray-700">
                    {target}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CourseTargetList;
