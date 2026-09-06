import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, options, ...props }: SelectProps) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-white/70">
        {label}
      </label>
      <div className="relative">
        <select
          className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-10 text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
        />
      </div>
    </div>
  );
}