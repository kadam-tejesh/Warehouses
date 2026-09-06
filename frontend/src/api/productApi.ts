import axiosClient from "./axiosClient";
import type { ProductRequest, ProductResponse } from "@/types";

export const getProducts = () =>
  axiosClient.get<ProductResponse[]>("/products");

export const getProductById = (id: number) =>
  axiosClient.get<ProductResponse>(`/products/${id}`);

export const createOrUpdateProduct = (data: ProductRequest) =>
  axiosClient.post<ProductResponse>("/products", data);

export const deleteProduct = (id: number) =>
  axiosClient.delete<ProductResponse>(`/products/${id}`);