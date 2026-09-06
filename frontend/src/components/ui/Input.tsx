import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export default function Input({ label, icon, type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-white/70">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-white/40">{icon}</span>
        )}
        <input
          type={isPassword && showPassword ? "text" : type}
          className={`w-full rounded-xl border border-white/10 bg-white/5 py-3 text-white placeholder:text-white/30 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 ${
            icon ? "pl-10" : "pl-4"
          } ${isPassword ? "pr-10" : "pr-4"}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 text-white/40 hover:text-white/70"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}