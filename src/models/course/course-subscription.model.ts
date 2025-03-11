import { Currency } from "../utils.model";
import { Course } from "./course.model";


export interface PaymentPayload {
  courseIds: number[];
}

export interface CreatePaymentPayload {
  courseInfo: {
    id: number;
    amount: number;
    description?: string;
    expirationDate?: Date;
  }[];
  method: string;
  status: PaymentStatus;
  currency: Currency;
}

export class PaymentResponse {
  transaction: PaymentTransaction;
}

export interface PaymentTransaction {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  paymentDate: Date;
  method: string;
  status: string;
  transactionUId: string;
  paymentDetails?: PaymentDetail[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentDetail {
  id: number;
  amount: number;
  currency: string;
  course: Course;
  transactionId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionPayload {
  courseId: number;
  expirationDate?: string;
  transactionId?: number;
}

export interface CourseSubscription {
  id: number;
  userId: number;
  courseId: number;
  subscriptionDate: Date;
  expirationDate: Date;
  status: CourseSubType;
  transactionId: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum CourseSubType {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  MOMO = 'MOMO',
  CARD = 'CARD',
  PAYPAL = 'PAYPAL',
}
