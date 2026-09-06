// ── Auth ──
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}

// ── Warehouse ──
export interface WarehouseRequest {
  name: string;
  code: string;
  longitude: number;
  latitude: number;
  capacity: number;
  status: string;
  currentLoad: number;
}

export interface WarehouseResponse extends WarehouseRequest {
  id: number;
}
// ── Customer ──
export interface CustomerRequest {
  name: string;
  email: string;
  phoneNo: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: number;
  longitude: number;
}

export interface CustomerResponse extends CustomerRequest {
  id: number;
}

// ── Product ──
export interface ProductRequest {
  sku: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  active: boolean;
}

export interface ProductResponse {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  active: boolean; // was isActive — wrong key, would silently break the toggle
}

// ── Inventory ──
export interface InventoryRequest {
  productId: number;
  warehouseId: number;
  quantity: number;
}

export interface InventoryResponse {
  id: number;
  productId: number;
  productName: string;
  warehouseId: number;
  warehouseName: string;
  quantity: number;
  reversedQuantity: number;
  lastUpdated: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  customerId: number;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  warehouseId: number;
  warehouseName: string;
}

export interface OrderResponse {
  orderId: number;
  orderNo: string;
  customerId: number;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItemResponse[];
}

// ── Route ──
export interface RouteRequest {
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  distance: number;
  averageTime: number;
}

export interface RouteResponse {
  id: number;
  sourceWarehouseId: number;
  sourceWarehouseName: string;
  destinationWarehouseId: number;
  destinationWarehouseName: string;
  distance: number;
  averageTime: number;
}