import { motion } from "framer-motion";

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

export default function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-white/10"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 h-4 w-4 rounded-full bg-white"
          style={{ left: checked ? "calc(100% - 1.25rem)" : "0.25rem" }}
        />
      </button>
      {label && <span className="text-sm text-white/70">{label}</span>}
    </label>
  );
}