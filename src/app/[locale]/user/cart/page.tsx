"use client";

import CustomImage from "@/components/_commons/CustomImage";
import NButton from "@/components/_commons/NButton";
import NTable, { TableColumns } from "@/components/_commons/NTable";
import { ROUTES } from "@/constants";
import { formatNumber, getPriceByBestDiscount } from "@/helpers";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { Course } from "@/models";
import { CartItem } from "@/models/user/cart.model";
import { Currency } from "@/models/utils.model";
import { toastService } from "@/services/toast.service";
import { cartService } from "@/services/user/cart.service";
import React, { useEffect, useMemo, useState } from "react";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useI18nRouter();

  const gotoPayment = async () => {
    try {
      router.push(`${ROUTES.PAYMENT}`);
    } catch (error) {
      toastService.error(error);
    }
  };

  const totalPrice = useMemo(() => {
    if (!cartItems) return 0;
    return cartItems.reduce((acc, item) => {
      const discountedPrice = getPriceByBestDiscount(
        item.course.price,
        item.course.discounts
      );
      return acc + discountedPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await cartService.getCartItems();
        setCartItems(data);
      } catch (err: any) {
        setError(err.message || "Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await cartService.updateQuantity(itemId, quantity);
      const updatedItems = await cartService.getCartItems();
      setCartItems(updatedItems);
    } catch (err: any) {
      setError(err.message || "Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (recordId: number) => {
    try {
      await cartService.removeItem(recordId);
      const updatedItems = await cartService.getCartItems();
      setCartItems(updatedItems);
    } catch (err: any) {
      setError(err.message || "Failed to remove item.");
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (err: any) {
      setError(err.message || "Failed to clear cart.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 overflow-hidden">
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <CartTable
              cartItems={cartItems}
              handleUpdateQuantity={handleUpdateQuantity}
              handleRemoveItem={handleRemoveItem}
            />
          )}
        </div>
        <div className="md:col-span-1">
          <div className="border rounded-lg p-4 shadow-md bg-white">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Order Summary
            </h3>

            <div className="flex flex-col space-y-2">
              <div className="flex justify-between text-gray-800">
                <span>Total Items:</span>
                <span className="font-medium">{cartItems.length}</span>
              </div>

              <div className="flex justify-between text-gray-800">
                <span>Total Price:</span>
                <span className="font-medium text-lg">
                  {formatNumber(totalPrice)} {Currency.VND}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <NButton onClick={gotoPayment} size="lg" className="w-full">
                Payment
              </NButton>
              <NButton
                onClick={handleClearCart}
                className="w-full"
                color="red"
                variant="filled"
              >
                Clear Cart
              </NButton>
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default CartPage;

export const CartTable = ({
  cartItems,
  handleUpdateQuantity,
  handleRemoveItem,
}) => {
  const router = useI18nRouter();

  const gotoDetail = (item: Course) => {
    router.push(`${ROUTES.COURSE}/${item.slug}`);
  };

  const columns: TableColumns<CartItem> = [
    {
      title: "Course Name",
      dataIndex: "course",
      key: "courseName",
      render: (course) => (
        <div className="flex items-center gap-2">
          <CustomImage src={course.thumbnail} alt={""} />
          <span
            className="cursor-pointer hover:underline "
            onClick={() => gotoDetail(course)}
          >
            {course.name}
          </span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "course",
      key: "price",
      render: (course) => (
        <>
          {course.discounts?.length > 0 && (
            <div className="flex justify-end font-semibold">
              {formatNumber(
                getPriceByBestDiscount(course.price, course.discounts)
              )}{" "}
              {course.currency}
            </div>
          )}
          <div
            className={`flex justify-end ${
              course.discounts?.length > 0
                ? "line-through text-gray-500 text-[12px]"
                : ""
            }`}
          >
            {formatNumber(course.price)} {course.currency}
          </div>
        </>
      ),
    },
    // {
    //   title: "Quantity",
    //   dataIndex: "quantity",
    //   key: "quantity",
    //   render: (quantity, record) => (
    //     <div className="flex justify-center">
    //       <div className="flex items-stretch border rounded-lg overflow-hidden shadow">
    //         <NButton
    //           onClick={() => handleUpdateQuantity(record.id, quantity - 1)}
    //           disabled={quantity <= 1}
    //           shape="none"
    //           color="primary"
    //           variant="text"
    //           className=""
    //         >
    //           -
    //         </NButton>
    //         <NInput
    //           type="number"
    //           shape="none"
    //           value={quantity}
    //           align="center"
    //           onValueChange={(value) => {
    //             if (!isNaN(value as number)) {
    //               handleUpdateQuantity(record.id, +value);
    //             }
    //           }}
    //           className="w-16 border-0"
    //         />
    //         <NButton
    //           onClick={() => handleUpdateQuantity(record.id, quantity + 1)}
    //           shape="none"
    //           color="primary"
    //           variant="text"
    //           className=""
    //         >
    //           +
    //         </NButton>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <NButton
          color="red"
          variant="filled"
          onClick={() => handleRemoveItem(record.id)}
        >
          Remove
        </NButton>
      ),
    },
  ];

  return <NTable<CartItem> columns={columns} dataSource={cartItems} />;
};
