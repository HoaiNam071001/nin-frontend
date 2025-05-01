import {
  ChartCoursePayload,
  ChartCourseResponse,
  CourseSubscription,
  CourseSubscriptionFull,
  CreatePaymentPayload,
  CreateSubscriptionPayload,
  PaymentDetail,
  PaymentStatus,
  PaymentTransaction,
} from "@/models/course/course-subscription.model";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";
import queryString from "query-string";
import apiClient from "../config";

export const coursePaymentService = {
  // PaymentTransaction APIs
  createTransaction: async (payload: CreatePaymentPayload) => {
    // {
    //   transaction: PaymentTransaction;
    //   details: PaymentDetail[];
    // }
    const response = await apiClient.post<any>(
      "/payments/transactions",
      payload
    );
    return response.data;
  },

  findAllTransactions: async () => {
    const response = await apiClient.get<PaymentTransaction[]>(
      "/payments/transactions"
    );
    return response.data;
  },

  findOneTransaction: async (id: number) => {
    const response = await apiClient.get<PaymentTransaction>(
      `/payments/transactions/${id}`
    );
    return response.data;
  },

  updateTransaction: async (
    id: number,
    transactionData: Partial<PaymentTransaction>
  ) => {
    const response = await apiClient.put<PaymentTransaction>(
      `/payments/transactions/${id}`,
      transactionData
    );
    return response.data;
  },

  removeTransaction: async (id: number) => {
    await apiClient.delete(`/payments/transactions/${id}`);
  },

  updateTransactionStatus: async (id: number, status: PaymentStatus) => {
    const response = await apiClient.put<PaymentTransaction>(
      `/payments/transactions/${id}/status`,
      { status }
    );
    return response.data;
  },

  // PaymentDetail APIs
  createDetail: async (detailData: Partial<PaymentDetail>) => {
    const response = await apiClient.post<PaymentDetail>(
      "/payments/details",
      detailData
    );
    return response.data;
  },

  findAllDetails: async () => {
    const response = await apiClient.get<PaymentDetail[]>("/payments/details");
    return response.data;
  },

  findOneDetail: async (id: number) => {
    const response = await apiClient.get<PaymentDetail>(
      `/payments/details/${id}`
    );
    return response.data;
  },

  updateDetail: async (id: number, detailData: Partial<PaymentDetail>) => {
    const response = await apiClient.put<PaymentDetail>(
      `/payments/details/${id}`,
      detailData
    );
    return response.data;
  },

  removeDetail: async (id: number) => {
    await apiClient.delete(`/payments/details/${id}`);
  },

  // CourseSubscription APIs
  createSubscription: async (subscriptionData: CreateSubscriptionPayload) => {
    const response = await apiClient.post<CourseSubscription>(
      "/payments/subscriptions",
      subscriptionData
    );
    return response.data;
  },

  getSubscription: async (courseId: number) => {
    const response = await apiClient.get<CourseSubscription>(
      `/payments/subscriptions/${courseId}`
    );
    return response.data;
  },

  getSubscriptionByCourseOwner: async (
    payload: ChartCoursePayload,
    pageAble?: PageAble
  ) => {
    console.log(queryString.stringify(payload));
    const response = await apiClient.get<List2Res<CourseSubscriptionFull>>(
      `/payments/subscriptions/owner?${
        queryString.stringify(payload) +
        "&" +
        (pageAble ? stringifyPageAble(pageAble) : "")
      }`
    );
    return response.data;
  },

  // chart
  getSubscriptionGroupByCourseOwner: async (payload: ChartCoursePayload) => {
    const response = await apiClient.get<ChartCourseResponse>(
      `/payments/subscriptions/owner/chart?${queryString.stringify(payload)}`
    );
    return response.data;
  },
};
