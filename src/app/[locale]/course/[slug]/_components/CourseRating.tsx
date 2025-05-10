// components/CourseReviews.tsx
import ProgressBar from "@/components/_commons/ProgressBar";
import Rating from "@/components/_commons/Rating";
import { FullCourse } from "@/models";
import { RatingStats } from "@/models/course/course-rating.model";
import { courseRatingService } from "@/services/courses/course-rating.service";
import { useEffect, useMemo, useState } from "react";
import { CourseRatingContent } from "./CourseRatingContent";

interface CourseReviewsProps {
  course: FullCourse;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ course }) => {
  const [summary, setSummary] = useState<RatingStats | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await courseRatingService.getByCourseSummary(
          course?.id
        );
        setSummary(response);
      } catch (error) {}
    };
    if (!course) {
      return;
    }
    fetchRatings();
  }, [course?.id]);

  const ratingItems = useMemo(() => {
    return [...Array(5)].map((_, index) => {
      const starCount = 5 - index;
      const percentage = summary?.ratingPercentages?.[starCount] || 0; // Lấy phần trăm từ summary
      return (
        <div key={index} className="flex items-center mb-2 gap-4">
          <div className="flex w-[100px]">
            <Rating
              initialValue={starCount}
              maxStars={starCount}
              editable={false}
              size="sm"
            />
          </div>
          <ProgressBar
            value={percentage}
            size="md"
            inactiveColor="bg-gray-200"
            className="w-[200px]"
          />
        </div>
      );
    });
  }, [summary]);

  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Phản hồi của học viên
      </h2>
      <div className="flex items-center mb-4">
        <div className="text-4xl font-bold text-gray-800 mr-4">
          {summary.averageRating.toFixed(1)}
        </div>
        <Rating initialValue={summary.averageRating} maxStars={5} size="sm" />
        <div className="ml-4 text-sm text-gray-500">Xếp hạng khóa học</div>
      </div>

      <div className="mb-6">{ratingItems}</div>

      <CourseRatingContent course={course} />
    </div>
  );
};

export default CourseReviews;
