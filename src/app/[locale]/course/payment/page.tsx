"use client";

import { toastService } from "@/services/toast.service";
import { cartService } from "@/services/user/cart.service";
import React, { useEffect, useState } from "react";
import PaymentContainer from "./_components/payment-container";
import { CartItem } from "@/models/user/cart.model";
interface PageProps {
  params: { courseId: number };
}

const PaymentPage = ({ params }: PageProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await cartService.getCartItems();
        setCartItems(data);
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
