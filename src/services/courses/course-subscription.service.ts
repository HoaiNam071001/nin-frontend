import {
  PaymentTransaction,
  PaymentDetail,
  CourseSubscription,
  PaymentStatus,
  CreatePaymentPayload,
  CreateSubscriptionPayload,
} from "@/models/course/course-subscription.model";
import apiClient from "../config";

export const coursePaymentService = {
  // PaymentTransaction APIs
  createTransaction: async (payload: CreatePaymentPayload) => {
    const response = await apiClient.post<{
      transaction: PaymentTransaction;
      details: PaymentDetail[];
    }>("/payments/transactions", payload);
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

  // extendSubscription: async (id: number, expirationDate: Date) => {
  //   const response = await apiClient.put<CourseSubscription>(
  //     `/payments/subscriptions/${id}/extend`,
  //     { expirationDate }
  //   );
  //   return response.data;
  // },

  // cancelSubscription: async (id: number) => {
  //   const response = await apiClient.put<CourseSubscription>(
  //     `/payments/subscriptions/${id}/cancel`
  //   );
  //   return response.data;
  // },

  // createFreeSubscription: async (courseId: number, userId: number) => {
  //   const response = await apiClient.post<CourseSubscription>(
  //     `/payments/courses/${courseId}/free-subscriptions/${userId}`
  //   );
  //   return response.data;
  // },
};
