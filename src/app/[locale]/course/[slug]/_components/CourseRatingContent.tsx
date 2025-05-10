"use client";

import NAvatar from "@/components/_commons/NAvatar";
import NButton from "@/components/_commons/NButton";
import NSelection from "@/components/_commons/NSelection";
import { NTextarea } from "@/components/_commons/NTextarea";
import Rating from "@/components/_commons/Rating";
import SvgIcon from "@/components/_commons/SvgIcon";
import TimeAgo from "@/components/_commons/TimeAgo";
import { DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { Course, FullCourse } from "@/models";
import {
  CourseRating,
  CreateCourseRatingDto,
} from "@/models/course/course-rating.model";
import {
  DropdownOption,
  OrderBy,
  PageAble,
  PageInfo,
  SortOrder,
} from "@/models/utils.model";
import { useModal } from "@/providers/ModalProvider";
import { courseRatingService } from "@/services/courses/course-rating.service";
import { uniqBy } from "lodash";
import { useEffect, useState } from "react";

interface ItemProps {
  rating: CourseRating;
  courseId?: number;
  editable?: boolean;
  remove?: () => void;
  onUpdated?: (updatedRating: CourseRating) => void; // Callback để cập nhật đánh giá
}

export const CommentItem = ({
  editable,
  rating,
  remove,
  onUpdated,
}: ItemProps) => {
  const { openConfirm } = useModal();
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa

  const onRemove = async () => {
    try {
      await courseRatingService.remove(rating.id);
      remove?.();
    } catch (error) {}
  };

  const handleUpdate = (updatedRating: CourseRating) => {
    setIsEditing(false);
    onUpdated?.(updatedRating);
  };

  if (isEditing) {
    return (
      <CommentForm
        courseId={rating.courseId}
        onCreated={handleUpdate}
        cancel={() => setIsEditing(false)} // Hủy chỉnh sửa
        initialRating={rating} // Truyền dữ liệu hiện tại để chỉnh sửa
      />
    );
  }

  return (
    <div className="flex items-start space-x-3 mb-3">
      <div className="flex items-center gap-2">
        <NAvatar
          tooltip=""
          src={rating.user?.avatar}
          name={rating.user?.fullName}
          userId={rating.user?.id}
        />
      </div>
      <div className="flex-1">
        <div className="rounded-lg bg-slate-50 px-3 py-1 space-y-1 inline-block relative group">
          <div className="flex items-center gap-3">
            <div className="font-semibold">{rating.user?.fullName}</div>
            <TimeAgo date={rating.updatedAt} className="text-secondary" />
          </div>
          <Rating initialValue={rating.rating} />
          <p>{rating.content}</p>

          {editable && rating.user?.id === currentUser?.id && (
            <div className="absolute -right-1 translate-x-full top-0 h-full group-hover:visible invisible flex items-center gap-2">
              {/* Nút Edit */}
              <NButton
                variant="filled"
                color="primary"
                disabled={!currentUser}
                onClick={() => setIsEditing(true)}
              >
                <SvgIcon className="icon icon-sm" icon={"edit"} />
              </NButton>
              {/* Nút Delete */}
              <NButton
                variant="filled"
                color="red"
                className=""
                disabled={!currentUser}
                onClick={() =>
                  openConfirm({
                    header: "Delete",
                    content: "Are you sure you want to delete this Rating?",
                    onOk: () => onRemove(),
                  })
                }
              >
                <SvgIcon className="icon icon-sm" icon={"remove"} />
              </NButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface FormProps {
  courseId: number;
  cancel?: () => void;
  onCreated: (rate: CourseRating) => void;
  initialRating?: CourseRating; // Dữ liệu ban đầu để chỉnh sửa
}

export const CommentForm = ({
  courseId,
  onCreated,
  cancel,
  initialRating,
}: FormProps) => {
  const [text, setText] = useState(initialRating?.content || "");
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(initialRating?.rating || 5);

  const handleSubmit = async () => {
    try {
      const payload: CreateCourseRatingDto = {
        content: text,
        rating,
      };
      let item: CourseRating;
      if (initialRating) {
        // Nếu đang chỉnh sửa, gọi API update
        item = await courseRatingService.update(initialRating.id, payload);
      } else {
        // Nếu tạo mới, gọi API create
        item = await courseRatingService.create(courseId, payload);
      }
      setText("");
      onCreated(item);
    } catch (error) {}
  };

  return (
    <div className="mb-3 flex gap-3">
      <NAvatar
        tooltip=""
        src={currentUser?.avatar}
        name={currentUser?.fullName}
      />
      <div className="flex-1">
        <div className="mb-3">
          <Rating
            initialValue={rating}
            size="lg"
            editable={true}
            onChange={(value) => setRating(value)}
          />
        </div>

        <NTextarea
          value={text}
          autoHeight={true}
          placeholder={"Enter your review..."}
          minRow={2}
          onChange={(e) => setText(e)}
        />

        <div className="flex justify-end gap-2">
          {cancel && (
            <NButton color="gray" variant="filled" onClick={cancel}>
              Cancel
            </NButton>
          )}
          {(text || initialRating) && (
            <NButton onClick={handleSubmit}>
              {initialRating ? "Update" : "Save"}
            </NButton>
          )}
        </div>
      </div>
    </div>
  );
};

const sortItems: DropdownOption<OrderBy>[] = [
  {
    name: "Mới nhất",
    value: {
      property: "createdAt",
      direction: SortOrder.DESC,
    },
  },
  {
    name: "Cũ nhất",
    value: {
      property: "createdAt",
      direction: SortOrder.ASC,
    },
  },
];

const filterItems: DropdownOption<number>[] = [
  {
    name: "Đánh giá 1 *",
    value: 1,
  },
  {
    name: "Đánh giá 2 *",
    value: 2,
  },
  {
    name: "Đánh giá 3 *",
    value: 3,
  },
  {
    name: "Đánh giá 4 *",
    value: 4,
  },
  {
    name: "Đánh giá 5 *",
    value: 5,
  },
];

export const CourseRatingContent = ({
  course,
  editable = true,
}: {
  course: FullCourse | Course;
  editable?: boolean;
}) => {
  const [ratings, setRatings] = useState<CourseRating[]>([]);
  const [sorter, setSorter] = useState<DropdownOption<OrderBy>>(sortItems[0]);
  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
    sort: [sorter?.value],
  });
  const { currentUser } = useAuth();
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [filter, setFilter] = useState<DropdownOption<number>>();
  const [selfRating, setSelfRating] = useState<CourseRating>();

  const fetchRatings = async () => {
    try {
      if (!course) {
        return;
      }
      const { content, ...rest } = await courseRatingService.getByCourse(
        course.id,
        pageAble,
        { rating: filter?.value || undefined }
      );
      const _content = content.filter(
        (e) => !((e.userId || e.user?.id) === currentUser?.id)
      );
      if (pageAble.page === FIRST_PAGE) {
        setRatings(_content);
      } else {
        const combinedRatings = [...ratings, ..._content];
        const unique = uniqBy(combinedRatings, "id");
        setRatings(unique);
      }
      setPageInfo(rest);
    } catch (error) {}
  };

  const fetchSelf = async () => {
    try {
      if (!currentUser) {
        return;
      }
      if (!course) {
        setSelfRating(null);
        return;
      }
      const item = await courseRatingService.getByUser(course?.id);
      setSelfRating(item);
    } catch (error) {
      setSelfRating(null);
    }
  };

  useEffect(() => {
    fetchSelf();
  }, [course]);

  useEffect(() => {
    if (pageAble) {
      fetchRatings();
    }
  }, [pageAble]);

  useEffect(() => {
    setPageAbleValue({
      page: FIRST_PAGE,
    });
  }, [course]);

  const setPageAbleValue = (value: PageAble) => {
    setPageAble({
      ...pageAble,
      ...value,
    });
  };

  const handleCommentCreated = (item: CourseRating) => {
    setSelfRating(item);
  };

  const onRemove = (item: CourseRating) => {
    setRatings(ratings.filter((e) => item.id !== e.id));
  };

  const onUpdated = (updatedRating: CourseRating) => {
    // Cập nhật danh sách đánh giá sau khi chỉnh sửa
    setRatings(
      ratings.map((rating) =>
        rating.id === updatedRating.id ? updatedRating : rating
      )
    );
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">
          Đánh giá ({pageInfo?.totalElements || 0})
        </h2>
        <div className="flex items-center gap-2">
          <NSelection
            options={filterItems}
            value={filter}
            bindLabel="name"
            className="ml-auto"
            clearable={true}
            onChange={(value: DropdownOption<number>) => {
              setFilter(value);
              setPageAbleValue({
                ...pageAble,
              });
            }}
          />
          <NSelection
            value={sorter}
            bindLabel="name"
            className="ml-auto"
            onChange={(value: DropdownOption<OrderBy>) => {
              setSorter(value);
              setPageAbleValue({
                sort: value?.value ? [value.value] : undefined,
              });
            }}
            options={sortItems}
          />
        </div>
      </div>

      {editable && currentUser && !selfRating && (
        <CommentForm courseId={course?.id} onCreated={handleCommentCreated} />
      )}
      {currentUser && selfRating && (
        <CommentItem
          editable={editable}
          rating={selfRating}
          courseId={course.id}
          remove={() => setSelfRating(null)}
          onUpdated={(rating) => setSelfRating(rating)}
        />
      )}

      {ratings.map((rating) => (
        <CommentItem
          editable={editable}
          key={rating.id}
          rating={rating}
          courseId={course.id}
          remove={() => onRemove(rating)}
          onUpdated={onUpdated} // Truyền callback để cập nhật
        />
      ))}
      <div>
        {!!pageInfo && pageAble.page < pageInfo.totalPages - 1 && (
          <NButton
            className="w-full"
            variant="filled"
            onClick={() =>
              setPageAbleValue({
                page: pageInfo?.page + 1,
              })
            }
          >
            Xem thêm
          </NButton>
        )}
      </div>
    </div>
  );
};
