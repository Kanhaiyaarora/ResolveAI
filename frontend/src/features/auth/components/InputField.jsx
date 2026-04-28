import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const InputField = ({ label, type = 'text', id, name, placeholder, value, onChange, error, icon: Icon }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Determine if the label should be in the "floating" position
  const isFloating = isFocused || (value && value.length > 0);

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <div className="relative group">
        {/* Label - Integrated with the Glassmorphism UI */}
        <label
          htmlFor={id}
          className={`absolute transition-all duration-200 pointer-events-none z-20 ${
            isFloating
              ? '-top-2 left-3 text-[11px] font-bold uppercase tracking-wider text-primary'
              : `top-3.5 text-slate-500 ${Icon ? 'left-10' : 'left-4'} text-sm`
          }`}
        >
          <span className="relative px-1">
            {/* This ensures the label "cuts" through the border cleanly */}
            <span className={`absolute inset-0 bg-[#0b0f1a] h-[2px] top-1/2 -translate-y-1/2 z-[-1] ${isFloating ? 'opacity-100' : 'opacity-0'}`} />
            {label}
          </span>
        </label>

        {/* Icon with active color state */}
        {Icon && (
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10 ${
            isFocused ? 'text-primary' : 'text-slate-500 group-hover:text-slate-400'
          }`}>
            <Icon size={16} strokeWidth={2} />
          </div>
        )}

        {/* The Input Field */}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete="off"
          className={`w-full bg-white/[0.03] backdrop-blur-md border rounded-xl px-4 py-3 text-sm text-white transition-all duration-200 outline-none ${
            Icon ? 'pl-10' : ''
          } ${
            error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border-white/10 group-hover:border-white/20 focus:border-primary focus:ring-4 focus:ring-primary/10'
          }`}
          placeholder={isFocused ? placeholder : ""}
        />

        {/* Success Checkmark (Optional UX Polish) */}
        {!error && value && value.length > 3 && !isFocused && (
           <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
           >
             <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
           </motion.div>
        )}
      </div>

      {/* Error Message with AnimatePresence */}
      <div className="h-5"> {/* Fixed height prevents "jumping" UI */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1.5 text-[12px] text-red-400 font-medium px-1"
            >
              <AlertCircle size={12} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InputField;