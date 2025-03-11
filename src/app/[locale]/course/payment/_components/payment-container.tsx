"use client";

import CustomImage from "@/components/_commons/CustomImage";
import { ROUTES } from "@/constants";
import { formatNumber, getPriceByBestDiscount } from "@/helpers";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { Course } from "@/models";
import {
  CourseSubscription,
  CreatePaymentPayload,
  PaymentDetail,
  PaymentMethod,
  PaymentStatus,
  PaymentTransaction,
} from "@/models/course/course-subscription.model";
import { CartItem } from "@/models/user/cart.model";
import { Currency } from "@/models/utils.model";
import { coursePaymentService } from "@/services/courses/course-subscription.service";
import { toastService } from "@/services/toast.service";
import { cartService } from "@/services/user/cart.service";
import React, { useEffect, useMemo, useState } from "react";

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
      await coursePaymentService.createTransaction(payload);
      toastService.success("Payment successful!");
      router.push(ROUTES.MY_COURSE);
    } catch (error) {
      toastService.error(error?.message || "500 Error");
    }
  };

  return (
    <div className="flex justify-center p-5">
      <div className="w-1/2 p-5 border-r border-gray-300">
        <h2 className="text-2xl font-semibold mb-4">Thanh toán</h2>
        {/* <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Địa chỉ thanh toán</h3>
          <div>
            <label className="block mb-1">Quốc gia</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="Việt Nam">Việt Nam</option>
            </select>
          </div>
        </div> */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Phương thức thanh toán</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value={PaymentMethod.CARD}
                checked={paymentMethod === PaymentMethod.CARD}
                onChange={() => setPaymentMethod(PaymentMethod.CARD)}
                className="mr-2"
              />
              Thẻ tín dụng/Thẻ ghi nợ
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value={PaymentMethod.PAYPAL}
                checked={paymentMethod === PaymentMethod.PAYPAL}
                onChange={() => setPaymentMethod(PaymentMethod.PAYPAL)}
                className="mr-2"
              />
              Paypal
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value={PaymentMethod.MOMO}
                checked={paymentMethod === PaymentMethod.MOMO}
                onChange={() => setPaymentMethod(PaymentMethod.MOMO)}
                className="mr-2"
              />
              Momo
            </label>
          </div>
        </div>
        <div className="mb-4 overflow-hidden">
          <h3 className="text-lg font-medium mb-2">Thông tin đặt hàng</h3>
          {cartItems.map((item) => (
            <CartItemDisplay key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className="w-1/4 p-5">
        <h2 className="text-2xl font-semibold mb-4">Tóm tắt</h2>
        <p>
          Giá gốc: {formatNumber(originPrice)} {Currency.VND}{" "}
        </p>
        <p>
          Chiết khấu: {formatNumber(originPrice - totalPrice)} {Currency.VND}{" "}
        </p>
        <p>
          Tổng: {formatNumber(totalPrice)} {Currency.VND}
        </p>
        <button
          onClick={handlePayment}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Hoàn tất thanh toán
        </button>
      </div>
    </div>
  );
};

export default PaymentContainer;

const CartItemDisplay = ({ item }) => {
  const router = useI18nRouter();

  const totalPrice = useMemo(() => {
    return getPriceByBestDiscount(item.course.price, item.course.discounts);
  }, [item]);

  const gotoDetail = (course: Course) => {
    router.push(`${ROUTES.COURSE}/${course.slug}`);
  };

  return (
    <div
      className="flex items-center gap-2 border border-stroke rounded-sm mb-2"
      key={item.id}
    >
      <CustomImage src={item.course?.thumbnail} alt={""} />
      <div className="flex flex-col overflow-hidden">
        <div
          className="cursor-pointer hover:underline capitalize text-ellipsis"
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
