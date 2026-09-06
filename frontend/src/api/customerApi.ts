import axiosClient from "./axiosClient";
import type { CustomerRequest, CustomerResponse } from "@/types";

export const getCustomers = () =>
  axiosClient.get<CustomerResponse[]>("/customer/get/all");

export const getCustomerById = (id: number) =>
  axiosClient.get<CustomerResponse>(`/customer/${id}`);

export const addCustomer = (data: CustomerRequest) =>
  axiosClient.post<CustomerResponse>("/customer/add", data);

export const updateCustomer = (id: number, data: CustomerRequest) =>
  axiosClient.put<CustomerResponse>(`/customer/update/${id}`, data);

export const deleteCustomer = (id: number) =>
  axiosClient.delete<string>(`/customer/delete/${id}`);