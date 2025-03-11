import { Discount, DiscountType } from "@/models";

export const getPriceByBestDiscount = (price: number, discounts: Discount[]): number => {
  if (!price || !discounts || discounts.length === 0) {
    return price || 0; // Trả về giá gốc nếu không có discount
  }

  let bestDiscountAmount = 0;

  for (const discount of discounts) {
    let discountAmount = 0;

    if (discount.discountType === DiscountType.PERCENT) {
      discountAmount = +((price * discount.amount) / 100).toFixed(2);
    } else if (discount.discountType === DiscountType.AMOUNT) {
      discountAmount = discount.amount;
    }

    if (discountAmount > bestDiscountAmount) {
      bestDiscountAmount = discountAmount;
    }
  }

  return Math.max(price - bestDiscountAmount, 0);
};
