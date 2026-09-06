import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  ShoppingCart,
  Loader2,
  ChevronDown,
  X,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import { getOrders, placeOrder, updateOrderStatus, deleteOrder } from "@/api/orderApi";
import { getCustomers } from "@/api/customerApi";
import { getProducts } from "@/api/productApi";
import type { CustomerResponse, OrderRequest, OrderResponse, ProductResponse } from "@/types";

const STATUS_OPTIONS = [
  { value: "CREATED", label: "Created" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface ItemRow {
  productId: string;
  quantity: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<ItemRow[]>([{ productId: "", quantity: 1 }]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [orderRes, custRes, prodRes] = await Promise.all([
        getOrders(),
        getCustomers(),
        getProducts(),
      ]);
      setOrders(orderRes.data);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setCustomerId("");
    setItems([{ productId: "", quantity: 1 }]);
    setIsModalOpen(true);
  };

  const addItemRow = () => setItems((prev) => [...prev, { productId: "", quantity: 1 }]);
  const removeItemRow = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItemRow = (idx: number, patch: Partial<ItemRow>) =>
    setItems((prev) => prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)));

  const productPrice = (id: string) =>
    Number(products.find((p) => String(p.id) === id)?.price ?? 0);

  const estimatedTotal = items.reduce(
    (sum, row) => sum + productPrice(row.productId) * (row.quantity || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      setError("Select a customer.");
      return;
    }
    const validItems = items.filter((r) => r.productId && r.quantity > 0);
    if (validItems.length === 0) {
      setError("Add at least one item.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const payload: OrderRequest = {
        customerId: Number(customerId),
        items: validItems.map((r) => ({
          productId: Number(r.productId),
          quantity: r.quantity,
        })),
      };
      await placeOrder(payload);
      setIsModalOpen(false);
      await fetchAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data || "Failed to place order.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (orderId: number, status: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
      );
    } catch {
      setError("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId: number) => {
    setDeletingId(orderId);
    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    } catch {
      setError("Failed to delete order.");
    } finally {
      setDeletingId(null);
    }
  };

  const customerOptions = [
    { value: "", label: "Select a customer..." },
    ...customers.map((c) => ({ value: String(c.id), label: c.name })),
  ];
  const productOptions = [
    { value: "", label: "Select a product..." },
    ...products.map((p) => ({ value: String(p.id), label: `${p.name} — $${p.price}` })),
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/40">
          {orders.length} order{orders.length !== 1 && "s"}
        </p>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={18} />
          New order
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-white/40">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <ShoppingCart className="mb-3 h-10 w-10 text-white/20" />
          <p className="text-white/50">No orders yet</p>
          <p className="mt-1 text-sm text-white/30">Place your first order to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {orders.map((o) => {
              const isExpanded = expandedId === o.orderId;
              return (
                <motion.div
                  key={o.orderId}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : o.orderId)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <ChevronDown
                        size={16}
                        className={`text-white/30 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                      <div>
                        <p className="font-medium text-white">{o.orderNo}</p>
                        <p className="text-xs text-white/40">{o.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-white">
                        ${Number(o.totalAmount).toFixed(2)}
                      </p>
                      <OrderStatusBadge status={o.status} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 px-5 py-4"
                      >
                        <table className="w-full text-left text-sm">
                          <thead className="text-white/40">
                            <tr>
                              <th className="pb-2 font-medium">Product</th>
                              <th className="pb-2 font-medium">Warehouse</th>
                              <th className="pb-2 font-medium">Qty</th>
                              <th className="pb-2 font-medium">Unit price</th>
                              <th className="pb-2 font-medium text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            {o.items.map((item, idx) => (
                              <tr key={idx} className="border-t border-white/5">
                                <td className="py-2">{item.productName}</td>
                                <td className="py-2 text-white/40">{item.warehouseName}</td>
                                <td className="py-2">{item.quantity}</td>
                                <td className="py-2">${Number(item.unitPrice).toFixed(2)}</td>
                                <td className="py-2 text-right">${Number(item.subTotal).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                          <p className="text-xs text-white/40">
                            Placed {new Date(o.createdAt).toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2">
                            <select
                              value={o.status}
                              disabled={updatingId === o.orderId}
                              onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-primary"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value} className="bg-surface">
                                  {s.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleDelete(o.orderId)}
                              disabled={deletingId === o.orderId}
                              className="rounded-lg p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                            >
                              {deletingId === o.orderId ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Place new order">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Customer"
            options={customerOptions}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Items</label>
            <div className="space-y-3">
              {items.map((row, idx) => (
                <div key={idx} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Select
                      label=""
                      options={productOptions}
                      value={row.productId}
                      onChange={(e) => updateItemRow(idx, { productId: e.target.value })}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      label=""
                      type="number"
                      min={1}
                      value={row.quantity}
                      onChange={(e) => updateItemRow(idx, { quantity: Number(e.target.value) })}
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      className="mb-3 rounded-lg p-2.5 text-white/30 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItemRow}
              className="mt-2 text-sm text-primary hover:underline"
            >
              + Add another item
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <span className="text-sm text-white/50">Estimated total</span>
            <span className="text-lg font-semibold text-white">
              ${estimatedTotal.toFixed(2)}
            </span>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <Button type="submit" isLoading={isSaving} className="w-full">
            Place order
          </Button>
        </form>
      </Modal>
    </div>
  );
}