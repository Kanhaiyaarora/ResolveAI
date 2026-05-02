import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Activity, Users } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-black font-sans lg:overflow-hidden selection:bg-emerald-500/30 selection:text-white">
      
      {/* LEFT SIDE: ILLUSTRATION / BRANDING (Visible on lg+) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 h-full relative p-12 overflow-hidden">
        {/* Image and Dark Overlay */}
        <div className="absolute inset-0 z-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            alt="ResolveAI High-Tech Infrastructure" 
            className="w-full h-full object-cover opacity-50"
          />
          {/* Gradient that fades to solid black on the right edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black" />
        </div>

        {/* Branding Top */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ResolveAI</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 my-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight">
              Smart Ticket <br />
              <span className="text-emerald-400">Management System.</span>
            </h1>
            <p className="text-zinc-400 text-base max-w-md leading-relaxed">
              Empower your support team with AI-driven insights. Resolve issues faster and keep your customers happy.
            </p>

            <div className="flex items-center gap-6 pt-4">
               <div className="flex items-center gap-2">
                 <Activity className="text-emerald-500 w-5 h-5" />
                 <span className="text-sm text-zinc-300 font-medium">Real-time Analytics</span>
               </div>
               <div className="flex items-center gap-2">
                 <Users className="text-amber-500 w-5 h-5" />
                 <span className="text-sm text-zinc-300 font-medium">Team Collaboration</span>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-1/2 min-h-screen lg:h-full flex flex-col items-center justify-start lg:justify-center p-6 py-12 lg:py-6 relative bg-black lg:overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-white/[0.02] border border-white/[0.05] p-6 sm:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group/card"
        >
          {/* Sparkle Border Effect (Animated Beam) */}
          <div className="absolute inset-0 p-[1px] rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_25%,#10b981_50%,transparent_75%,transparent_100%)] animate-[spin_4s_linear_infinite] opacity-10 group-hover/card:opacity-30 transition-opacity duration-500" />
          </div>

          {/* Subtle top glow on the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Header */}
          <div className="mb-6 space-y-1 text-center relative z-10">
            {/* Logo for mobile/tablet only */}
            <div className="lg:hidden flex flex-col items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="text-white w-7 h-7" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">ResolveAI</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
          </div>

          {/* Form Content */}
          <div className="flex flex-col gap-4 w-full">
            {children}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default AuthLayout;