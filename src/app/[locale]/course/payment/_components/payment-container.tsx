"use client";

import CustomImage from "@/components/_commons/CustomImage";
import I18n from "@/components/_commons/I18n";
import NButton from "@/components/_commons/NButton";
import { DEFAULT_COURSE_THUMBNAIL, ROUTES } from "@/constants";
import { formatNumber, getPriceByBestDiscount } from "@/helpers";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { Course } from "@/models";
import {
  CreatePaymentPayload,
  PaymentMethod,
  PaymentStatus,
} from "@/models/course/course-subscription.model";
import { CartItem } from "@/models/user/cart.model";
import { Currency } from "@/models/utils.model";
import { coursePaymentService } from "@/services/courses/course-subscription.service";
import { toastService } from "@/services/toast.service";
import { useMemo, useState } from "react";

// Định nghĩa mảng phương thức thanh toán
const PAYMENT_METHODS = [
  {
    value: PaymentMethod.CARD,
    label: "Credit Card/Debit Card",
    icon: "/images/card-payment.png",
  },
  {
    value: PaymentMethod.PAYPAL,
    label: "Paypal",
    icon: "/images/paypal.png",
  },
  {
    value: PaymentMethod.MOMO,
    label: "Momo",
    icon: "/images/momo.png",
  },
];

const PaymentContainer = ({ cartItems }: { cartItems: CartItem[] }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.MOMO
  );

  const router = useI18nRouter();

  const totalPrice = useMemo(() => {
    if (!cartItems) return 0;
    return cartItems.reduce((acc, item) => {
      const discountedPrice = getPriceByBestDiscount(
        item.course.price,
        item.course.discounts
      );
      return acc + discountedPrice * (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const originPrice = useMemo(() => {
    if (!cartItems) return 0;
    return cartItems.reduce((acc, item) => {
      return acc + item.course.price * (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const handlePayment = async () => {
    try {
      const payload: CreatePaymentPayload = {
        courseInfo: cartItems.map((item) => ({
          id: item.course?.id,
          amount: getPriceByBestDiscount(
            item.course.price,
            item.course.discounts
          ),
          description: "",
        })),
        method: paymentMethod,
        status: PaymentStatus.SUCCESS,
        currency: Currency.VND,
      };
      const { payUrl } = await coursePaymentService.createTransaction(payload);
      if (payUrl) {
        window.location.href = payUrl;
      }
    } catch (error) {
      toastService.error(error?.message || "500 Error");
    }
  };

  return (
    <div className="flex justify-center p-5">
      <div className="w-1/2 p-5 border-r border-gray-300">
        <h2 className="text-2xl font-semibold mb-4">
          <I18n i18key={"Pay"} />
        </h2>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">
            <I18n i18key={"Payment method"} />
          </h3>
          <div className="space-y-1">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                className={`flex items-center gap-2 border border-stroke px-3 py-2 ${
                  paymentMethod === method.value ? "bg-slate-100" : ""
                }`}
              >
                <input
                  type="radio"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={() => setPaymentMethod(method.value)}
                  className="mr-2"
                />
                <CustomImage width={25} src={method.icon} />
                <I18n i18key={method.label} />
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4 overflow-hidden">
          <h3 className="text-lg font-medium mb-2">
            <I18n i18key={"Order information"} />
          </h3>
          {cartItems.map((item) => (
            <CartItemDisplay key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className="w-1/3 p-5">
        <div className="border border-stroke p-4 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            <I18n i18key={"Summary"} />
          </h2>
          <div className="flex items-center">
            <I18n i18key={"Original price"} />:{" "}
            <div className="ml-auto">
              {formatNumber(originPrice)} {Currency.VND}
            </div>
          </div>
          <div className="flex items-center">
            <I18n i18key={"Discount"} />:{" "}
            <div className="ml-auto">
              {formatNumber(originPrice - totalPrice)} {Currency.VND}
            </div>
          </div>
          <div className="my-2 border-stroke border-[0.5px]"></div>
          <div className="flex items-center">
            <I18n i18key={"Total"} />:
            <div className="ml-auto">
              {formatNumber(totalPrice)} {Currency.VND}
            </div>
          </div>
          <NButton onClick={handlePayment} className="mt-3 w-full" size="lg">
            <I18n i18key={"Complete payment"} />
          </NButton>
        </div>
      </div>
    </div>
  );
};

export default PaymentContainer;

const CartItemDisplay = ({ item }: { item: CartItem }) => {
  const router = useI18nRouter();

  const totalPrice = useMemo(() => {
    return getPriceByBestDiscount(item.course.price, item.course.discounts);
  }, [item]);

  const gotoDetail = (course: Course) => {
    router.push(`${ROUTES.COURSE}/${course.slug}`);
  };

  return (
    <div
      className="flex items-center gap-2 border border-stroke rounded-md mb-2"
      key={item.id}
    >
      <CustomImage
        src={item.course?.thumbnail || DEFAULT_COURSE_THUMBNAIL}
        alt={""}
        className="rounded-s"
      />
      <div className="flex flex-col overflow-hidden">
        <div
          className="cursor-pointer hover:underline  text-ellipsis"
          onClick={() => gotoDetail(item.course)}
        >
          {item.course?.name}
        </div>
        <div className="flex items-center gap-2">
          <div className="font-semibold">
            {formatNumber(totalPrice)} {item.course.currency}
          </div>
          {item.course.discounts?.length > 0 && (
            <div className="line-through text-sm">
              {formatNumber(item.course.price)} {item.course.currency}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
