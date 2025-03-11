"use client";

import { toastService } from "@/services/toast.service";
import { cartService } from "@/services/user/cart.service";
import React, { useEffect, useState } from "react";
import { courseService } from "@/services/courses/course.service";
import { CartItem } from "@/models/user/cart.model";
import PaymentContainer from "../_components/payment-container";
interface PageProps {
  params: { id: number };
}

const PaymentPage = ({ params }: PageProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const course = await courseService.getCourseById(params.id);
        if (!course) {
          toastService.error("Course not found");
          return;
        }
        setCartItems([
          {
            course,
          },
        ]);
      } catch (error: any) {
        toastService.error(error?.message || "500 Error");
      }
    };

    fetchCartItems();
  }, []);

  return (
    <>
      <PaymentContainer cartItems={cartItems} />
    </>
  );
};

export default PaymentPage;
