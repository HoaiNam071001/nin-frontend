import { Course } from "../course";

// src/models/cart.model.ts (hoặc vị trí phù hợp)
export interface CartItem {
    id?: number;
    course: Course;
    quantity?: number;
    createdAt?: string;
    updatedAt?: string;
  }