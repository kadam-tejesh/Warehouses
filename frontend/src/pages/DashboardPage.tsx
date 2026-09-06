import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AlertTriangle, Loader2 } from "lucide-react";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import { getWarehouses } from "@/api/warehouseApi";
import { getProducts } from "@/api/productApi";
import { getCustomers } from "@/api/customerApi";
import { getOrders } from "@/api/orderApi";
import { getInventories } from "@/api/inventoryApi";
import type {
  CustomerResponse,
  InventoryResponse,
  OrderResponse,
  ProductResponse,
  WarehouseResponse,
} from "@/types";

const LOW_STOCK_THRESHOLD = 10;
const STATUS_COLORS: Record<string, string> = {
  CREATED: "#3fa9a0",
  CONFIRMED: "#7b8394",
  SHIPPED: "#e8873a",
  DELIVERED: "#4ade80",
  CANCELLED: "#f87171",
};

export default function DashboardPage() {
  const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [inventory, setInventory] = useState<InventoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [whRes, prodRes, custRes, orderRes, invRes] = await Promise.all([
          getWarehouses(),
          getProducts(),
          getCustomers(),
          getOrders(),
          getInventories(),
        ]);
        setWarehouses(whRes.data);
        setProducts(prodRes.data);
        setCustomers(custRes.data);
        setOrders(orderRes.data);
        setInventory(invRes.data);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
    [orders]
  );

  const capacityData = useMemo(
    () =>
      warehouses.map((w) => ({
        name: w.code,
        used: w.currentLoad,
        free: Math.max(0, w.capacity - w.currentLoad),
      })),
    [warehouses]
  );

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [orders]);

  const lowStock = useMemo(
    () => inventory.filter((i) => i.quantity <= LOW_STOCK_THRESHOLD).slice(0, 5),
    [inventory]
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [orders]
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-white/40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero metric */}
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="text-sm text-white/40">Total revenue</p>
          <p className="font-display mt-1 text-5xl font-semibold text-white">
            ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="mt-2 text-sm text-white/40">across {orders.length} orders</p>
        </div>
        <div className="flex flex-col justify-center border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="font-display text-2xl font-semibold text-white">{warehouses.length}</p>
          <p className="text-sm text-white/40">Warehouses</p>
        </div>
        <div className="flex flex-col justify-center border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="font-display text-2xl font-semibold text-white">{products.length}</p>
          <p className="text-sm text-white/40">Products</p>
        </div>
        <div className="flex flex-col justify-center border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="font-display text-2xl font-semibold text-white">{customers.length}</p>
          <p className="text-sm text-white/40">Customers</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-medium text-white/70">Warehouse capacity utilization</h3>
          {capacityData.length === 0 ? (
            <p className="py-16 text-center text-sm text-white/30">No warehouse data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={capacityData}>
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
                <YAxis stroke="#ffffff40" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "#0e1116", border: "1px solid #ffffff20", borderRadius: 8 }}
                  labelStyle={{ color: "white" }}
                />
                <Bar dataKey="used" stackId="a" fill="#e8873a" radius={[0, 0, 0, 0]} name="Used" />
                <Bar dataKey="free" stackId="a" fill="#ffffff15" radius={[6, 6, 0, 0]} name="Free" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 text-sm font-medium text-white/70">Orders by status</h3>
          {statusData.length === 0 ? (
            <p className="py-16 text-center text-sm text-white/30">No orders yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#64748b"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0e1116", border: "1px solid #ffffff20", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "white" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Low stock + recent orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="text-sm font-medium text-white/70">Low stock alerts</h3>
          </div>
          {lowStock.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/30">All stock levels healthy</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((i) => (
                <div key={i.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{i.productName}</p>
                    <p className="text-xs text-white/40">{i.warehouseName}</p>
                  </div>
                  <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-400">
                    {i.quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 text-sm font-medium text-white/70">Recent orders</h3>
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/30">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.orderId} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{o.orderNo}</p>
                    <p className="text-xs text-white/40">{o.customerName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/70">${Number(o.totalAmount).toFixed(2)}</span>
                    <OrderStatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}