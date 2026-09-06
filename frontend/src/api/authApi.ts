import axiosClient from "./axiosClient";
import type { LoginRequest, RegisterRequest, UserResponse } from "@/types";

export const login = (data: LoginRequest) =>
  axiosClient.post<string>("/auth/login", data); // backend returns raw JWT string

export const register = (data: RegisterRequest) =>
  axiosClient.post<UserResponse>("/auth/register", data);