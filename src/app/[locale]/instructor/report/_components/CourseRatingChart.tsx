import { CourseRatingContent } from "@/app/[locale]/course/[slug]/_components/CourseRatingContent";
import CustomImage from "@/components/_commons/CustomImage";
import Rating from "@/components/_commons/Rating";
import PieChart, { PieChartData } from "@/components/Chart/PieChart";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants";
import { RatingStats } from "@/models";
import { courseRatingService } from "@/services/courses/course-rating.service";
import { useEffect, useState } from "react";

const customTooltip = (data: PieChartData) => (
  <div className="flex flex-col">
    <span className="font-bold">{data.label}</span>
    <span>Value: {data.value}</span>
  </div>
);

const CourseRatingChart = ({ course }) => {
  const [rating, setRating] = useState<PieChartData[]>();
  const [data, setData] = useState<RatingStats>();
  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!course?.id) {
          return;
        }
        const response = await courseRatingService.getByCourseSummary(
          course?.id
        );
        const ratingData = Object.keys(response.ratingCounts)
          .map((key) => ({
            label: `${key} Star${parseInt(key) > 1 ? "s" : ""}`,
            value: response.ratingCounts[key],
          }))
          .filter((e) => e.value);
        setRating(ratingData);
        setData(response);
      } catch (error) {}
    };
    fetchReport();
  }, [course?.id]);
  return (
    <div className="h-[70vh] overflow-auto mt-10 flex flex-col gap-4 relative">
      <div className="sticky top-0 z-999 bg-white p-1 flex gap-2">
        <CustomImage
          src={course.thumbnail || DEFAULT_COURSE_THUMBNAIL}
          alt="preview"
          className="w-[100px] h-[60px] rounded-md border-stroke border"
        />
        <div className="font-bold mb-4 ">{course.name}</div>
      </div>
      <PieChart
        data={rating}
        width={300}
        height={200}
        innerRadius={60}
        customTooltip={customTooltip}
        centerContent={
          <div>
            <div className="text-[30px] relative flex items-center justify-center gap-2">
              {data?.averageRating}
              <div className="">
                <Rating maxStars={1} initialValue={1} />
              </div>
            </div>
            <div className="">{data?.totalRatings || 0} Ratings</div>
          </div>
        }
        outerRadius={80}
      />
      <div>
        <CourseRatingContent course={course} editable={false} />
      </div>
    </div>
  );
};

export default CourseRatingChart;
