import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Package, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import {
  getProducts,
  createOrUpdateProduct,
  deleteProduct,
} from "@/api/productApi";
import type { ProductRequest, ProductResponse } from "@/types";

const EMPTY_FORM: ProductRequest = {
  sku: "",
  name: "",
  description: "",
  price: 0,
  weight: 0,
  active: true,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductResponse | null>(null);
  const [form, setForm] = useState<ProductRequest>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (p: ProductResponse) => {
    setEditing(p);
    setForm({
      sku: p.sku,
      name: p.name,
      description: p.description,
      price: p.price,
      weight: p.weight,
      active: p.active,
    });
    setIsModalOpen(true);
  };

  const update =
    (key: keyof ProductRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const isNumeric = key === "price" || key === "weight";
      setForm((f) => ({
        ...f,
        [key]: isNumeric ? Number(e.target.value) : e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await createOrUpdateProduct(form);
      setIsModalOpen(false);
      await fetchProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data || "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/40">
          {products.length} product{products.length !== 1 && "s"}
        </p>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={18} />
          Add product
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
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <Package className="mb-3 h-10 w-10 text-white/20" />
          <p className="text-white/50">No products yet</p>
          <p className="mt-1 text-sm text-white/30">Add your first one to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {products.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.active
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {p.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <h3 className="font-semibold text-white">{p.name}</h3>
                <p className="mt-0.5 text-xs text-white/40">SKU: {p.sku}</p>
                <p className="mt-2 line-clamp-2 text-sm text-white/50">
                  {p.description || "No description"}
                </p>

                <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      ${Number(p.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-white/40">{p.weight} kg</p>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="rounded-lg p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                    >
                      {deletingId === p.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Edit product" : "Add product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="SKU" value={form.sku} onChange={update("sku")} required disabled={!!editing} />
            <Input label="Name" value={form.name} onChange={update("name")} required />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={update("description") as any}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Short product description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              value={form.price}
              onChange={update("price")}
              required
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.01"
              value={form.weight}
              onChange={update("weight")}
              required
            />
          </div>

          <Switch
            checked={form.active}
            onChange={(v) => setForm((f) => ({ ...f, active: v }))}
            label="Active"
          />

          <Button type="submit" isLoading={isSaving} className="mt-2 w-full">
            {editing ? "Save changes" : "Create product"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}