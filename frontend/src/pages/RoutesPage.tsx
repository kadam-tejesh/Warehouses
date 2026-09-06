import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Route as RouteIcon, Loader2, Clock, Milestone } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import RouteGraph from "@/components/routes/RouteGraph";
import { getRoutes, addRoute, deleteRoute } from "@/api/routeApi";
import { getWarehouses } from "@/api/warehouseApi";
import type { RouteRequest, RouteResponse, WarehouseResponse } from "@/types";

const EMPTY_FORM = {
  sourceWarehouseId: "",
  destinationWarehouseId: "",
  distance: 0,
  averageTime: 0,
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<RouteResponse[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [routeRes, whRes] = await Promise.all([getRoutes(), getWarehouses()]);
      setRoutes(routeRes.data);
      setWarehouses(whRes.data);
    } catch {
      setError("Failed to load routes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sourceWarehouseId || !form.destinationWarehouseId) {
      setError("Select both a source and destination warehouse.");
      return;
    }
    if (form.sourceWarehouseId === form.destinationWarehouseId) {
      setError("Source and destination must be different warehouses.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const payload: RouteRequest = {
        sourceWarehouseId: Number(form.sourceWarehouseId),
        destinationWarehouseId: Number(form.destinationWarehouseId),
        distance: form.distance,
        averageTime: form.averageTime,
      };
      await addRoute(payload);
      setIsModalOpen(false);
      await fetchAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data || "Failed to add route.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteRoute(id);
      setRoutes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Failed to delete route.");
    } finally {
      setDeletingId(null);
    }
  };

  const warehouseOptions = [
    { value: "", label: "Select a warehouse..." },
    ...warehouses.map((w) => ({ value: String(w.id), label: `${w.name} (${w.code})` })),
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/40">
          {routes.length} route{routes.length !== 1 && "s"} across {warehouses.length} warehouse
          {warehouses.length !== 1 && "s"}
        </p>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={18} />
          Add route
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
      ) : warehouses.length < 2 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <RouteIcon className="mb-3 h-10 w-10 text-white/20" />
          <p className="text-white/50">Need at least 2 warehouses to create a route</p>
          <p className="mt-1 text-sm text-white/30">Add more warehouses first</p>
        </div>
      ) : (
        <div className="space-y-6">
          <RouteGraph warehouses={warehouses} routes={routes} />

          {routes.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/50">
                  <tr>
                    <th className="px-5 py-3 font-medium">From</th>
                    <th className="px-5 py-3 font-medium">To</th>
                    <th className="px-5 py-3 font-medium">Distance</th>
                    <th className="px-5 py-3 font-medium">Avg. time</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {routes.map((r) => (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-t border-white/5 text-white/80 hover:bg-white/5"
                      >
                        <td className="px-5 py-3.5 font-medium text-white">
                          {r.sourceWarehouseName}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-white">
                          {r.destinationWarehouseName}
                        </td>
                        <td className="px-5 py-3.5 text-white/60">
                          <div className="flex items-center gap-1.5">
                            <Milestone size={14} className="text-white/30" />
                            {r.distance} km
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-white/60">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-white/30" />
                            {r.averageTime} min
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleDelete(r.id)}
                            disabled={deletingId === r.id}
                            className="rounded-lg p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                          >
                            {deletingId === r.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add route">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Source warehouse"
            options={warehouseOptions}
            value={form.sourceWarehouseId}
            onChange={(e) => setForm((f) => ({ ...f, sourceWarehouseId: e.target.value }))}
            required
          />
          <Select
            label="Destination warehouse"
            options={warehouseOptions}
            value={form.destinationWarehouseId}
            onChange={(e) => setForm((f) => ({ ...f, destinationWarehouseId: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Distance (km)"
              type="number"
              step="any"
              value={form.distance}
              onChange={(e) => setForm((f) => ({ ...f, distance: Number(e.target.value) }))}
              required
            />
            <Input
              label="Avg. time (min)"
              type="number"
              value={form.averageTime}
              onChange={(e) => setForm((f) => ({ ...f, averageTime: Number(e.target.value) }))}
              required
            />
          </div>

          <Button type="submit" isLoading={isSaving} className="mt-2 w-full">
            Create route
          </Button>
        </form>
      </Modal>
    </div>
  );
}