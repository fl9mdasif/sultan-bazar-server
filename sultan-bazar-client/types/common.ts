/* eslint-disable @typescript-eslint/no-explicit-any */
// import { USER_ROLE } from "@/contains/role";

export type ResponseSuccessType = {
  data: any;
  meta?: TMeta;
};

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  // totalPage: number;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};







// ─── Category Types ──────────────────────────────────────────────────────────

export interface TCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
}

// ─── Product Types ────────────────────────────────────────────────────────────

export interface TVariant {
  _id?: string;
  name: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  weight?: number;
  isAvailable?: boolean;
}

export interface TProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags?: string[];
  thumbnail: string;
  gallery?: string[];
  variants: TVariant[];
  rating?: number;
  reviewCount?: number;
  status?: "active" | "draft" | "archived";
  isFeatured?: boolean;
}
