import axiosClient from "./axiosClient";
import type { InventoryRequest, InventoryResponse } from "@/types";

export const getInventories = () =>
  axiosClient.get<InventoryResponse[]>("/inventory");

export const addOrUpdateInventory = (data: InventoryRequest) =>
  axiosClient.post<InventoryResponse>("/inventory", data);

export const getByProductId = (id: number) =>
  axiosClient.get<InventoryResponse[]>(`/inventory/product/${id}`);

export const getByWarehouseId = (id: number) =>
  axiosClient.get<InventoryResponse[]>(`/inventory/warehouse/${id}`);

export const getByProductAndWarehouse = (pid: number, wid: number) =>
  axiosClient.get<InventoryResponse>(`/inventory/product/${pid}/warehouse/${wid}`);

export const deleteInventory = (id: number) =>
  axiosClient.delete<InventoryResponse>(`/inventory/${id}`);