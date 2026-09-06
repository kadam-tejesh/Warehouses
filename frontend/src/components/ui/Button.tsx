import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  variant?: "primary" | "ghost";
}

export default function Button({
  children,
  isLoading,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "relative flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    primary:
      "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-indigo-500",
    ghost: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  );
}