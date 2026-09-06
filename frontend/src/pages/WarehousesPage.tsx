import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Warehouse as WarehouseIcon, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  getWarehouses,
  createOrUpdateWarehouse,
  deleteWarehouse,
} from "@/api/warehouseApi";
import type { WarehouseRequest, WarehouseResponse } from "@/types";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

const EMPTY_FORM: WarehouseRequest = {
  name: "",
  code: "",
  longitude: 0,
  latitude: 0,
  capacity: 0,
  status: "ACTIVE",
  currentLoad: 0,
};

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<WarehouseResponse | null>(null);
  const [form, setForm] = useState<WarehouseRequest>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchWarehouses = async () => {
    setIsLoading(true);
    try {
      const res = await getWarehouses();
      setWarehouses(res.data);
    } catch {
      setError("Failed to load warehouses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (w: WarehouseResponse) => {
    setEditing(w);
    setForm({
      name: w.name,
      code: w.code,
      longitude: w.longitude,
      latitude: w.latitude,
      capacity: w.capacity,
      status: w.status,
      currentLoad: w.currentLoad,
    });
    setIsModalOpen(true);
  };

  const update =
    (key: keyof WarehouseRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const isNumeric = ["longitude", "latitude", "capacity", "currentLoad"].includes(key);
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
      await createOrUpdateWarehouse(form);
      setIsModalOpen(false);
      await fetchWarehouses();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data || "Failed to save warehouse.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteWarehouse(id);
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
    } catch {
      setError("Failed to delete warehouse.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/40">
          {warehouses.length} warehouse{warehouses.length !== 1 && "s"}
        </p>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={18} />
          Add warehouse
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
      ) : warehouses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <WarehouseIcon className="mb-3 h-10 w-10 text-white/20" />
          <p className="text-white/50">No warehouses yet</p>
          <p className="mt-1 text-sm text-white/30">Add your first one to get started</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/50">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Load</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {warehouses.map((w) => {
                  const loadPct = w.capacity > 0 ? Math.min(100, (w.currentLoad / w.capacity) * 100) : 0;
                  return (
                    <motion.tr
                      key={w.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-t border-white/5 text-white/80 hover:bg-white/5"
                    >
                      <td className="px-5 py-3.5 font-medium text-white">{w.name}</td>
                      <td className="px-5 py-3.5 text-white/50">{w.code}</td>
                      <td className="px-5 py-3.5">
                        <Badge status={w.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${loadPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/40">
                            {w.currentLoad}/{w.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(w)}
                            className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(w.id)}
                            disabled={deletingId === w.id}
                            className="rounded-lg p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                          >
                            {deletingId === w.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Edit warehouse" : "Add warehouse"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={update("name")} required />
          <Input
            label="Code"
            value={form.code}
            onChange={update("code")}
            required
            disabled={!!editing}
            className={editing ? "opacity-60" : ""}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={update("latitude")}
              required
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={update("longitude")}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capacity"
              type="number"
              value={form.capacity}
              onChange={update("capacity")}
              required
            />
            <Input
              label="Current load"
              type="number"
              value={form.currentLoad}
              onChange={update("currentLoad")}
              required
            />
          </div>
          <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={update("status")} />

          <Button type="submit" isLoading={isSaving} className="mt-2 w-full">
            {editing ? "Save changes" : "Create warehouse"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}