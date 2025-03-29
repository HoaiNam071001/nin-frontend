import NInput from "@/components/_commons/NInput";
import BarChart, { BarChartPoint } from "@/components/Chart/BarChart";
import { DATE_FORMATS } from "@/constants";
import { formatNumber } from "@/helpers";
import { formatDate } from "@/helpers/date";
import { coursePaymentService } from "@/services/courses/course-subscription.service";
import { toastService } from "@/services/toast.service";
import moment from "moment";
import { useEffect, useState } from "react";

const ChartTooltip = ({ d }) => {
  return (
    <div className="w-[300px] p-3 bg-white border border-gray-200 rounded-lg shadow-md space-y-2">
      {/* Registrations */}
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-700">Registrations:</div>
        <div className="text-gray-900 font-semibold bg-gray-100 px-2 py-1 rounded-md">
          {d.extends?.subscriptionCount ?? 'N/A'}
        </div>
      </div>

      {/* Number of courses */}
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-700">Number of courses:</div>
        <div className="text-gray-900 font-semibold bg-gray-100 px-2 py-1 rounded-md">
          {d.extends?.courseCount ?? 'N/A'}
        </div>
      </div>

      {/* Amount */}
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-700">Amount:</div>
        <div className="text-gray-900 font-semibold bg-gray-100 px-2 py-1 rounded-md">
          {formatNumber(d.value) ?? 'N/A'}
          {d.extends?.currency && (
            <span className="ml-1 text-gray-600">{d.extends.currency}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseChart = ({ filter }) => {
  const [rows, setRows] = useState<BarChartPoint[]>([]);
  const getChart = async () => {
    try {
      const { data } =
        await coursePaymentService.getSubscriptionGroupByCourseOwner(filter);
      setRows(
        data.map((item) => ({
          label: formatDate({ date: item.date }),
          value: item.value,
          extends: {
            currency: item.currency,
            subscriptionCount: item.subscriptionCount,
            courseCount: item.courseCount,
          },
        }))
      );
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  useEffect(() => {
    if (filter) {
      getChart();
    }
  }, [filter]);

  return (
    <div className="flex justify-center">
      <BarChart data={rows} barWidth={100} TooltipComponent={ChartTooltip} />
    </div>
  );
};

export default CourseChart;
