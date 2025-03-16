"use client";

import { formatNumber, getPriceByBestDiscount } from "@/helpers";
import CustomImage from "../_commons/CustomImage";
import NButton from "../_commons/NButton";
import SvgIcon from "../_commons/SvgIcon";
import { courseSearchService } from "@/services/courses/course-search.service";
import { Course, DiscountType, FullCourse } from "@/models";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_COURSE_THUMBNAIL, ROUTES } from "@/constants";
import { coursePaymentService } from "@/services/courses/course-subscription.service";
import {
  CourseSubscription,
  CourseSubType,
  CreateSubscriptionPayload,
} from "@/models/course/course-subscription.model";
import useAuth from "@/hooks/useAuth";
import I18n from "../_commons/I18n";
import { toastService } from "@/services/toast.service";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import HMSDisplay from "../_commons/HMSDisplay";

export const CourseCard = ({
  course,
  addToCart,
}: {
  course: FullCourse;
  addToCart: () => void;
}) => {
  const [subscription, setSubscription] = useState<CourseSubscription>();
  const { currentUser } = useAuth();
  const router = useI18nRouter();

  const getBySlug = async () => {
    try {
      if (!currentUser) {
        setSubscription(null);
        return;
      }
      const response: CourseSubscription =
        await coursePaymentService.getSubscription(course?.id);
      setSubscription(response);
    } catch (error) {}
  };

  const buyNow = () => {
    router.push(`${ROUTES.PAYMENT}/${course.id}`);
  };

  const onSubscribe = async () => {
    try {
      const subscriptionData: CreateSubscriptionPayload = {
        courseId: course.id,
      };
      const response: CourseSubscription =
        await coursePaymentService.createSubscription(subscriptionData);
      setSubscription(response);
      toastService.success("Subscribed successfully");
    } catch (error) {
      toastService.error(error.message);
    }
  };
  const totalPrice = useMemo(() => {
    if (!course) {
      return 0;
    }
    const discountedPrice = getPriceByBestDiscount(
      course.price,
      course.discounts
    );
    return discountedPrice;
  }, [course]);

  const action = useMemo(() => {
    const isInstructor = course.instructors.find(
      (item) => item.user?.id === currentUser.id
    );
    const isOwner = course.owner?.id === currentUser.id;
    const isSubscribed = subscription?.status === CourseSubType.ACTIVE;
    const gotoDetail = isInstructor || isOwner || isSubscribed;
    return {
      register: !gotoDetail && !totalPrice && !isSubscribed,
      buy: !gotoDetail && !!totalPrice && !isSubscribed,
      gotoDetail: gotoDetail,
      addCart: !gotoDetail && !isSubscribed && currentUser,
    };
  }, [course]);

  useEffect(() => {
    if (course?.id) {
      getBySlug();
    }
  }, [course?.id]);

  const onNavigateDetail = () => {
    router.push(ROUTES.COURSE_DETAIL(course.slug));
  };

  return (
    <>
      {course && (
        <div className="bg-white border border-stroke rounded-md p-3 shadow-lg cursor-pointer space-y-4 w-full">
          <div className="h-[170px] w-0 px-[50%] relative border border-stroke rounded-lg">
            <CustomImage
              src={course.thumbnail || DEFAULT_COURSE_THUMBNAIL}
              alt="Course Thumbnail"
              width={300}
              height={150}
              className="rounded-md w-[100%] h-[100%] absolute left-0 top-0"
            ></CustomImage>
          </div>

          <div className="flex items-center gap-1">
            {!totalPrice && (
              <>
                <div className="px-2 rounded-md bg-red text-white">
                  <I18n i18key={"Free"}></I18n>
                </div>
              </>
            )}
            {!!totalPrice && (
              <>
                <span className="text-title-md leading-[1rem] font-semibold">
                  {formatNumber(totalPrice || course.price || 0)}{" "}
                  {course.currency}
                </span>
                {totalPrice != course.price && (
                  <span className="line-through text-secondary translate-y-[2px]">
                    {formatNumber(course.price || 0)} {course.currency}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex space-x-2">
            {action.register && (
              <>
                <NButton size="lg" className="flex-1" onClick={onSubscribe}>
                  Register Now
                </NButton>
              </>
            )}

            {action.buy && (
              <NButton size="lg" className="flex-1" onClick={buyNow}>
                Buy Now
              </NButton>
            )}
            {action.addCart && (
              <NButton
                variant="outlined"
                size="lg-circle"
                className=""
                onClick={addToCart}
              >
                <SvgIcon
                  icon="cart"
                  className="icon icon-md text-system"
                ></SvgIcon>
              </NButton>
            )}

            {action.gotoDetail && (
              <NButton
                className="flex-1"
                size="lg-circle"
                onClick={() => onNavigateDetail()}
              >
                <I18n i18key={"Go to course"} />
              </NButton>
            )}
          </div>

          <div className="border-t border-t-stroke pt-2 space-y-2">
            <div className="font-semibold">This course includes</div>
            <div className="text-gray-500">
              <div>
                {course.totalSection} <span>Lessons</span>
              </div>
              <div>
                {course.totalFile} <span> Course materials </span>
              </div>
              <div>
                <HMSDisplay
                  seconds={course.estimatedTime}
                  showMinute={false}
                  showSecond={false}
                />{" "}
                <span>online learning</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
