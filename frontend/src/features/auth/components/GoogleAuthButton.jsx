import React from "react";
import { motion } from "framer-motion";

/**
 * GoogleAuthButton - A production-ready Google sign-in button
 * following Google's official branding guidelines.
 * 
 * @param {Object} props
 * @param {string} props.theme - "light" or "dark" (default: "dark")
 * @param {string} props.text - The button text (default: "Continue with Google")
 * @param {function} props.onClick - Click handler
 */
const GoogleAuthButton = ({ 
  theme = "dark", 
  text = "Continue with Google", 
  onClick,
  className = "" 
}) => {
  const isDark = theme === "dark";

  // ResolveAI Glassmorphism Styles (Strictly neutral for Google Compliance)
  const themeStyles = isDark 
    ? "bg-white/[0.05] text-[#E8EAED] border-white/10 hover:bg-white/[0.08] hover:border-white/20 backdrop-blur-md" 
    : "bg-[#FFFFFF] text-[#3C4043] border-[#DADCE0] hover:bg-[#F8F9FA]";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.95 }}
      aria-label={text}
      className={`
        relative flex items-center justify-center gap-3 w-full px-4 h-11 
        rounded-xl font-semibold text-sm border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
        ${themeStyles}
        ${className}
      `}
    >
      {/* Official Google "G" Logo */}
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          width="100%" 
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      </div>

      {/* Button Text */}
      <span className="truncate">{text}</span>
    </motion.button>
  );
};

export default GoogleAuthButton;
