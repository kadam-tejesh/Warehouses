import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Boxes, Loader2, AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getInventories, addOrUpdateInventory, deleteInventory } from "@/api/inventoryApi";
import { getProducts } from "@/api/productApi";
import { getWarehouses } from "@/api/warehouseApi";
import type { InventoryResponse, ProductResponse, WarehouseResponse } from "@/types";

const LOW_STOCK_THRESHOLD = 10;

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ productId: "", warehouseId: "", quantity: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [invRes, prodRes, whRes] = await Promise.all([
        getInventories(),
        getProducts(),
        getWarehouses(),
      ]);
      setInventory(invRes.data);
      setProducts(prodRes.data);
      setWarehouses(whRes.data);
    } catch {
      setError("Failed to load inventory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setForm({ productId: "", warehouseId: "", quantity: 0 });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.warehouseId) {
      setError("Select both a product and a warehouse.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await addOrUpdateInventory({
        productId: Number(form.productId),
        warehouseId: Number(form.warehouseId),
        quantity: form.quantity,
      });
      setIsModalOpen(false);
      await fetchAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data || "Failed to save inventory.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteInventory(id);
      setInventory((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError("Failed to delete inventory record.");
    } finally {
      setDeletingId(null);
    }
  };

  const productOptions = [
    { value: "", label: "Select a product..." },
    ...products.map((p) => ({ value: String(p.id), label: `${p.name} (${p.sku})` })),
  ];
  const warehouseOptions = [
    { value: "", label: "Select a warehouse..." },
    ...warehouses.map((w) => ({ value: String(w.id), label: `${w.name} (${w.code})` })),
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/40">
          {inventory.length} record{inventory.length !== 1 && "s"}
        </p>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={18} />
          Add stock
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
      ) : inventory.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <Boxes className="mb-3 h-10 w-10 text-white/20" />
          <p className="text-white/50">No inventory records yet</p>
          <p className="mt-1 text-sm text-white/30">Add stock to a warehouse to get started</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/50">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Warehouse</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Reserved</th>
                <th className="px-5 py-3 font-medium">Last updated</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {inventory.map((i) => {
                  const isLow = i.quantity <= LOW_STOCK_THRESHOLD;
                  return (
                    <motion.tr
                      key={i.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-t border-white/5 text-white/80 hover:bg-white/5"
                    >
                      <td className="px-5 py-3.5 font-medium text-white">{i.productName}</td>
                      <td className="px-5 py-3.5 text-white/50">{i.warehouseName}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={isLow ? "font-medium text-amber-400" : "text-white"}>
                            {i.quantity}
                          </span>
                          {isLow && <AlertTriangle size={14} className="text-amber-400" />}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-white/50">{i.reversedQuantity}</td>
                      <td className="px-5 py-3.5 text-white/40">
                        {new Date(i.lastUpdated).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(i.id)}
                          disabled={deletingId === i.id}
                          className="rounded-lg p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                        >
                          {deletingId === i.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add / update stock">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Product"
            options={productOptions}
            value={form.productId}
            onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
            required
          />
          <Select
            label="Warehouse"
            options={warehouseOptions}
            value={form.warehouseId}
            onChange={(e) => setForm((f) => ({ ...f, warehouseId: e.target.value }))}
            required
          />
          <Input
            label="Quantity"
            type="number"
            min={0}
            value={form.quantity}
            onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
            required
          />
          <p className="text-xs text-white/30">
            If stock already exists for this product/warehouse pair, it will be updated rather than duplicated.
          </p>
          <Button type="submit" isLoading={isSaving} className="mt-2 w-full">
            Save
          </Button>
        </form>
      </Modal>
    </div>
  );
}