"use client";

import NAvatar from "@/components/_commons/NAvatar";
import {
  CommentModel,
  CreateCommentPayload,
} from "@/models/course/course-comment.model";
import { FullCourse } from "@/models"; // Import CommentItem
import { useEffect, useState } from "react";
import { commentService } from "@/services/courses/course-comment.service";
import { formatDate } from "@/helpers/date";
import { DATE_FORMATS, DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import {
  DropdownOption,
  OrderBy,
  PageAble,
  PageInfo,
  SortOrder,
} from "@/models/utils.model";
import NSelection from "@/components/_commons/NSelection";
import useAuth from "@/hooks/useAuth";
import NButton from "@/components/_commons/NButton";
import { NTextarea } from "@/components/_commons/NTextarea";
import { uniqBy } from "lodash";
import SvgIcon from "@/components/_commons/SvgIcon";
import NTooltip from "@/components/_commons/NTooltip";
import { useModal } from "@/providers/ModalProvider";

interface CommentItemProps {
  comment: CommentModel;
  courseId?: number;
  order?: OrderBy;
  remove?: () => void;
}

export const CommentItem = ({
  comment,
  courseId,
  order,
  remove,
}: CommentItemProps) => {
  const { openConfirm } = useModal();
  const [isReplying, setIsReplying] = useState(false);
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
    sort: [order],
  });
  const [showReply, setShowReply] = useState(false);
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const fetchComments = async () => {
    try {
      if (!courseId) {
        return;
      }
      const { content, ...rest } = await commentService.find(
        courseId,
        {
          parentId: comment.id,
        },
        pageAble
      );
      if (pageAble.page === FIRST_PAGE) {
        setComments(content);
      } else {
        const combinedComments = [...comments, ...content];
        const uniqueComments = uniqBy(combinedComments, "id");
        setComments(uniqueComments);
      }
      setPageInfo(rest);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };
  useEffect(() => {
    if (pageAble && showReply) {
      fetchComments();
    }
  }, [pageAble]);

  const setPageAbleValue = (value: PageAble) => {
    setPageAble({
      ...pageAble,
      ...value,
    });
  };

  const onSetShowReply = () => {
    const _show = !showReply;
    setShowReply(_show);
    setComments([]);
    if (_show) {
      setPageAbleValue({ page: FIRST_PAGE });
    }
  };

  const handleCommentCreated = () => {
    setIsReplying(false);
    fetchComments(); // Gọi lại fetchComments để cập nhật danh sách comment
  };

  const onRemove = async () => {
    // Xử lý xóa comment
    try {
      await commentService.remove(comment.id);
      remove?.();
    } catch (error) {
      console.error("Failed to remove comment:", error);
    }
  };
  const onRemoveChild = (item: CommentModel) => {
    setComments(comments.filter((e) => item.id !== e.id));
  };
  return (
    <div className="flex items-start space-x-3 mb-3">
      <div className="flex items-center gap-2">
        <NAvatar
          tooltip=""
          src={comment.user?.avatar}
          name={comment.user?.fullName}
        />
      </div>
      <div className="flex-1">
        <div className="rounded-lg bg-slate-50 px-3 py-1 inline-block relative group">
          <div className="flex items-center gap-2">
            <NTooltip
              title={formatDate({
                date: comment.createdAt,
                format: DATE_FORMATS.SHORT_DATE_TIME,
              })}
            >
              <div className="font-semibold ">{comment.user?.fullName}</div>
            </NTooltip>

            {comment.user?.id === currentUser?.id && (
              <div className="absolute -right-[30px] top-0 h-full group-hover:visible invisible">
                <NButton
                  variant="link"
                  color="black"
                  className="relative top-[50%] -translate-y-[50%]"
                  disabled={!currentUser}
                  onClick={() =>
                    openConfirm({
                      header: "Delete ",
                      content: "Are you sure you want to delete this Comment?",
                      onOk: () => onRemove(),
                    })
                  }
                >
                  <SvgIcon className="icon icon-sm" icon={"remove"}></SvgIcon>
                </NButton>
              </div>
            )}
          </div>
          <p className="">{comment.commentText}</p>
        </div>

        {currentUser && !comment.parentId && (
          <div className="">
            <div className="flex items-center text-gray-600 mt-2">
              {!isReplying && (
                <>
                  <NButton
                    variant="link"
                    color="black"
                    className="!py-0"
                    onClick={() => setIsReplying(true)}
                  >
                    Reply
                  </NButton>

                  {!!comment.replyCount && (
                    <>
                      <NButton
                        variant="link"
                        color="black"
                        className="!py-0 flex items-center gap-1"
                        onClick={() => onSetShowReply()}
                      >
                        {comment.replyCount}{" "}
                        {comment.replyCount > 1 ? "Replies" : "Reply"}
                        <SvgIcon
                          icon="arrow"
                          className={`icon icon-sm ${
                            showReply ? "rotate-180" : "rotate-90"
                          }`}
                        />
                      </NButton>
                    </>
                  )}
                </>
              )}
              {isReplying && (
                <div className="flex-1">
                  <CommentForm
                    courseId={courseId}
                    parentId={comment.id}
                    onCommentCreated={handleCommentCreated}
                    cancel={() => setIsReplying(false)}
                  />
                </div>
              )}
            </div>

            {comments.length > 0 && (
              <div className="mt-2">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    remove={() => onRemoveChild(comment)}
                  />
                ))}
              </div>
            )}

            {!!pageInfo && pageAble.page < pageInfo.totalPages && (
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
        )}
      </div>
    </div>
  );
};

interface CommentFormProps {
  courseId: number;
  parentId?: number;
  cancel?: () => void;
  onCommentCreated: (comment: CommentModel) => void; // Callback để cập nhật danh sách comment
}

export const CommentForm = ({
  courseId,
  onCommentCreated,
  parentId,
  cancel,
}: CommentFormProps) => {
  const [commentText, setCommentText] = useState("");
  const { currentUser } = useAuth();

  const handleSubmit = async () => {
    try {
      const payload: CreateCommentPayload = {
        commentText: commentText,
        parentId: parentId,
      };
      const item = await commentService.create(courseId, payload);
      setCommentText("");
      onCommentCreated(item);
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
        <NTextarea
          value={commentText}
          autoHeight={true}
          placeholder={"Enter your Comment..."}
          minRow={2}
          onChange={(e) => setCommentText(e)}
        />

        <div className="flex justify-end gap-2">
          {cancel && (
            <NButton color="gray" variant="filled" onClick={cancel}>
              Cancel
            </NButton>
          )}
          {commentText && <NButton onClick={handleSubmit}>Save</NButton>}
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

export const CourseComment = ({ courseId }: { courseId: number }) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [sorter, setSorter] = useState<DropdownOption<OrderBy>>(sortItems[0]);
  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
    sort: [sorter?.value],
  });
  const { currentUser } = useAuth();
  const [pageInfo, setPageInfo] = useState<PageInfo>();

  const fetchComments = async () => {
    try {
      if (!courseId) {
        return;
      }
      const { content, ...rest } = await commentService.find(
        courseId,
        {},
        pageAble
      );
      if (pageAble.page === FIRST_PAGE) {
        setComments(content);
      } else {
        const combinedComments = [...comments, ...content];
        const uniqueComments = uniqBy(combinedComments, "id");
        setComments(uniqueComments);
      }
      setPageInfo(rest);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };
  useEffect(() => {
    if (pageAble) {
      fetchComments();
    }
  }, [pageAble]);

  const setPageAbleValue = (value: PageAble) => {
    setPageAble({
      ...pageAble,
      ...value,
    });
  };

  const handleCommentCreated = (item: CommentModel) => {
    setComments([item, ...comments]);
  };

  const onRemove = (item: CommentModel) => {
    setComments(comments.filter((e) => item.id !== e.id));
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">
          Bình luận ({pageInfo?.totalElements || 0})
        </h2>
        <div className="flex items-center">
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

      {currentUser && (
        <CommentForm
          courseId={courseId}
          onCommentCreated={handleCommentCreated}
        />
      )}

      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          courseId={courseId}
          order={sorter.value}
          remove={() => onRemove(comment)}
        />
      ))}
      <div>
        {!!pageInfo && pageAble.page < pageInfo.totalPages && (
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
