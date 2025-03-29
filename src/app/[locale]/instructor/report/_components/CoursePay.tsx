"use client";

import NButton from "@/components/_commons/NButton";
import { useEffect, useMemo, useState } from "react";
import CourseSub from "./CourseSub";
import CourseChart from "./CourseChart";
import moment from "moment";
import { DATE_FORMATS } from "@/constants";
import NInput from "@/components/_commons/NInput";
import { ChartCoursePayload } from "@/models/course/course-subscription.model";

const CoursePay: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>(
    moment().subtract(7, "d").format(DATE_FORMATS.FULL_DATE_NO_TIME)
  );
  const [toDate, setToDate] = useState<string>(
    moment().endOf("d").format(DATE_FORMATS.FULL_DATE_NO_TIME)
  );

  const [filter, setFilter] = useState<ChartCoursePayload>();

  useEffect(() => {
    setFilter({
      startDate: moment
        .utc(fromDate, DATE_FORMATS.FULL_DATE_NO_TIME)
        .toISOString(),
      endDate: moment
        .utc(toDate, DATE_FORMATS.FULL_DATE_NO_TIME)
        .endOf("d")
        .toISOString(),
    });
  }, [fromDate, toDate]);

  return (
    <div className="w-full container mx-auto rounded-md shadow h-full overflow-auto">
      <div className="flex items-center gap-4 sticky top-0 bg-slate-200 z-10 pt-4 px-4 border-b border-stroke">
        <div className="form-group">
          <label>From Date</label>
          <NInput
            type="date"
            value={fromDate}
            onValueChange={(value) => setFromDate(value as string)}
          />
        </div>
        <div className="form-group">
          <label>To Date</label>
          <NInput
            type="date"
            value={toDate}
            onValueChange={(value) => setToDate(value as string)}
          />
        </div>
      </div>
      <div className="px-4 space-y-4 bg-slate-50 ">
        <CourseChart filter={filter}></CourseChart>
        <CourseSub filter={filter}></CourseSub>
      </div>
    </div>
  );
};

export default CoursePay;
