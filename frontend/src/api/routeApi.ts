import axiosClient from "./axiosClient";
import type { RouteRequest, RouteResponse } from "@/types";

export const getRoutes = () =>
  axiosClient.get<RouteResponse[]>("/routes/get");

export const getRouteById = (id: number) =>
  axiosClient.get<RouteResponse>(`/routes/get/${id}`);

export const addRoute = (data: RouteRequest) =>
  axiosClient.post<RouteResponse>("/routes/add", data);

export const deleteRoute = (id: number) =>
  axiosClient.delete<string>(`/routes/delete/${id}`);