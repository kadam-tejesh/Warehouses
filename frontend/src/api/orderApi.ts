import axiosClient from "./axiosClient";
import type { OrderRequest, OrderResponse } from "@/types";

export const placeOrder = (data: OrderRequest) =>
  axiosClient.post<OrderResponse>("/order/place", data);

export const getOrders = () =>
  axiosClient.get<OrderResponse[]>("/order/get/orders");

export const getOrderById = (id: number) =>
  axiosClient.get<OrderResponse>(`/order/get/order/${id}`);

export const updateOrderStatus = (id: number, status: string) =>
  axiosClient.put<string>(`/order/update/${id}?status=${status}`);

export const deleteOrder = (id: number) =>
  axiosClient.delete<string>(`/order/delete/${id}`);

export const ordersByCustomer = (id: number) =>
  axiosClient.get<OrderResponse[]>(`/order/customer/${id}`);

export const getOrdersByStatus = (status: string) =>
  axiosClient.get<OrderResponse[]>(`/order/status?status=${status}`);