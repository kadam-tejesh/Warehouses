import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Users, Loader2, Mail, Phone, MapPin } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/api/customerApi";
import type { CustomerRequest, CustomerResponse } from "@/types";

const EMPTY_FORM: CustomerRequest = {
  name: "",
  email: "",
  phoneNo: "",
  addressLine: "",
  city: "",
  state: "",
  pinCode: "",
  latitude: 0,
  longitude: 0,
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerResponse | null>(null);
  const [form, setForm] = useState<CustomerRequest>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch {
      setError("Failed to load customers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (c: CustomerResponse) => {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email,
      phoneNo: c.phoneNo,
      addressLine: c.addressLine,
      city: c.city,
      state: c.state,
      pinCode: c.pinCode,
      latitude: c.latitude,
      longitude: c.longitude,
    });
    setIsModalOpen(true);
  };

  const update =
    (key: keyof CustomerRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isNumeric = key === "latitude" || key === "longitude";
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
      if (editing) {
        await updateCustomer(editing.id, form);
      } else {
        await addCustomer(form);
      }
      setIsModalOpen(false);
      await fetchCustomers();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data || "Failed to save customer.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete customer.");
    } finally {
      setDeletingId(null);
    }
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/40">
          {customers.length} customer{customers.length !== 1 && "s"}
        </p>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={18} />
          Add customer
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
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <Users className="mb-3 h-10 w-10 text-white/20" />
          <p className="text-white/50">No customers yet</p>
          <p className="mt-1 text-sm text-white/30">Add your first one to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {customers.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                      {initials(c.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{c.name}</h3>
                      <p className="text-xs text-white/40">{c.city}, {c.state}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(c)}
                      className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      className="rounded-lg p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                    >
                      {deletingId === c.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-white/50">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-white/30" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-white/30" />
                    <span>{c.phoneNo}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-white/30" />
                    <span>
                      {c.addressLine}, {c.pinCode}
                    </span>
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
        title={editing ? "Edit customer" : "Add customer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={update("name")} required />
            <Input label="Email" type="email" value={form.email} onChange={update("email")} required />
          </div>
          <Input label="Phone" value={form.phoneNo} onChange={update("phoneNo")} required />
          <Input label="Address" value={form.addressLine} onChange={update("addressLine")} required />
          <div className="grid grid-cols-3 gap-4">
            <Input label="City" value={form.city} onChange={update("city")} required />
            <Input label="State" value={form.state} onChange={update("state")} required />
            <Input label="Pin code" value={form.pinCode} onChange={update("pinCode")} required />
          </div>
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

          <Button type="submit" isLoading={isSaving} className="mt-2 w-full">
            {editing ? "Save changes" : "Create customer"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}