import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const isDisabled = isLoading || disabled;

  const baseStyles =
    "relative flex items-center justify-center w-full h-12 px-6 rounded-xl font-semibold text-base transition-all duration-200 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ring-offset-slate-900";

  const variants = {
    primary:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow",
    outline:
      "bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white",
    ghost:
      "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${variants[variant]} ${
        isDisabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {/* Subtle shimmer (only primary, toned down) */}
      {variant === "primary" && !isDisabled && (
        <motion.div
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
        />
      )}

      {/* Content */}
      <div className="flex items-center gap-2 relative z-10">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </div>

      {/* Subtle border glow */}
      {variant === "primary" && (
        <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none" />
      )}
    </motion.button>
  );
};

export default Button;