import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Warehouse, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import PageBackground from "@/components/layout/PageBackground";
import { register } from "@/api/authApi";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "STAFF", label: "Staff" },
];

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "STAFF",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      if (!err?.response) {
        setError("Can't reach the server. Check the backend is running and CORS is configured.");
      } else {
        setError(
          err.response.data?.message || err.response.data || "Registration failed. Try a different email."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4">
      <PageBackground variant="compass" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <CheckCircle2 className="mb-4 h-14 w-14 text-emerald-400" />
              <h2 className="font-display text-xl font-semibold text-white">
                Account created
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Redirecting you to sign in...
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }}>
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
                  <Warehouse className="h-7 w-7 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-semibold text-white">
                  Create account
                </h1>
                <p className="mt-1 text-sm text-white/50">
                  Set up access to the warehouse dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Username"
                  type="text"
                  placeholder="johndoe"
                  icon={<User size={18} />}
                  value={form.username}
                  onChange={update("username")}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  icon={<Mail size={18} />}
                  value={form.email}
                  onChange={update("email")}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  value={form.password}
                  onChange={update("password")}
                  required
                  minLength={6}
                />
                <Select
                  label="Role"
                  options={ROLE_OPTIONS}
                  value={form.role}
                  onChange={update("role")}
                />

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400"
                    >
                      {String(error)}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button type="submit" isLoading={isLoading} className="w-full">
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-white/50">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}