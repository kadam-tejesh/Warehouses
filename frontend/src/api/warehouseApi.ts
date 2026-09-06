import axiosClient from "./axiosClient";
import type { WarehouseRequest, WarehouseResponse } from "@/types";

export const getWarehouses = () =>
  axiosClient.get<WarehouseResponse[]>("/warehouses");

export const getWarehouseById = (id: number) =>
  axiosClient.get<WarehouseResponse>(`/warehouses/${id}`);

export const createOrUpdateWarehouse = (data: WarehouseRequest) =>
  axiosClient.post<WarehouseResponse>("/warehouses", data);

export const deleteWarehouse = (id: number) =>
  axiosClient.delete<string>(`/warehouses/${id}`);