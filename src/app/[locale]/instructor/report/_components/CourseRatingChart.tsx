import Rating from "@/components/_commons/Rating";
import BarChart, { BarChartPoint } from "@/components/Chart/BarChart";
import PieChart, { PieChartData } from "@/components/Chart/PieChart";
import { formatDate } from "@/helpers/date";
import { RatingStats } from "@/models";
import { courseRatingService } from "@/services/courses/course-rating.service";
import { useEffect, useState } from "react";

const customTooltip = (data: PieChartData) => (
  <div className="flex flex-col">
    <span className="font-bold">{data.label}</span>
    <span>Value: {data.value}</span>
  </div>
);

const CourseRatingChart = ({ courseId }) => {
  const [rating, setRating] = useState<PieChartData[]>();
  const [data, setData] = useState<RatingStats>();
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await courseRatingService.getByCourseSummary(courseId);
        const ratingData = Object.keys(response.ratingCounts).map((key) => ({
          label: `${key} Star${parseInt(key) > 1 ? 's' : ''}`,
          value: response.ratingCounts[key],
        })).filter(e=> e.value);
        setRating(ratingData);
        setData(response);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };
    fetchReport();
  }, [courseId]);
  return (
    <div className="h-screen p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Course Evaluation Breakdown
      </h1>
      <PieChart
        data={rating}
        width={500}
        height={400}
        innerRadius={90}
        customTooltip={customTooltip}
        centerContent={<div>
          <div className="text-[50px] relative">
            {data?.averageRating}
            <div className="absolute top-0 -right-[15px]">
            <Rating maxStars={1} initialValue={1}/>
            </div>
          </div>
          <div className="">
            {data?.totalRatings || 0} Ratings
          </div>
        </div>}
        outerRadius={150}
      />
    </div>
  );
};

export default CourseRatingChart;
