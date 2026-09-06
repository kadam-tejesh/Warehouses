import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageBackground from "./PageBackground";

type BgVariant = "grid" | "blueprint" | "crates" | "barcode" | "contour" | "routes" | "compass";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Overview of your operations" },
  "/warehouses": { title: "Warehouses", subtitle: "Manage storage locations" },
  "/customers": { title: "Customers", subtitle: "Your customer directory" },
  "/products": { title: "Products", subtitle: "Catalog and pricing" },
  "/inventory": { title: "Inventory", subtitle: "Stock across warehouses" },
  "/orders": { title: "Orders", subtitle: "Track and fulfil orders" },
  "/routes": { title: "Routes", subtitle: "Warehouse-to-warehouse network" },
};

const PAGE_BG: Record<string, BgVariant> = {
  "/": "grid",
  "/warehouses": "blueprint",
  "/customers": "contour",
  "/products": "crates",
  "/inventory": "barcode",
  "/orders": "routes",
  "/routes": "compass",
};

export default function DashboardLayout() {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] ?? { title: "", subtitle: "" };
  const bgVariant = PAGE_BG[location.pathname] ?? "grid";

  return (
    <div className="relative flex h-screen bg-surface">
      <PageBackground variant={bgVariant} />
      <div className="relative z-10 flex h-screen w-full">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar title={meta.title} subtitle={meta.subtitle} />
          <main className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}