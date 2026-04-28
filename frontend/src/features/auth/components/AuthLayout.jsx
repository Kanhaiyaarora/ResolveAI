import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-slate-950 overflow-hidden selection:bg-indigo-500/30 font-sans selection:text-white relative">
      
      {/* GLOBAL BACKGROUND ELEMENTS (Z-0) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, 40, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]"
          />
      </div>

      {/* LEFT SIDE: BRANDING (Z-10) */}
      <div className="hidden md:flex md:w-1/2 h-full relative flex-col justify-between p-10 lg:p-16 border-r border-white/5 z-10">
        {/* Branding */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 mb-12"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/10">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white italic">ResolveAI</span>
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Master your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-500">
                infrastructure.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base text-slate-400 max-w-sm leading-relaxed"
            >
              Deploy with confidence. Our AI predicts anomalies before they impact your users.
            </motion.p>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Zap className="text-indigo-400 w-4 h-4" />
              <p className="text-xl font-mono font-bold text-white">99.99%</p>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Uptime SLA</p>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Activity className="text-purple-400 w-4 h-4" />
              <p className="text-xl font-mono font-bold text-white">2.4ms</p>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Avg Latency</p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: FORM CONTENT (Z-10) */}
      <div className="flex-1 h-full relative flex flex-col z-10 bg-slate-950 md:bg-transparent">
        
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden flex items-center justify-between p-6 border-b border-white/5 bg-slate-950/80 backdrop-blur-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white italic">ResolveAI</span>
          </div>
        </div>

        {/* Scrollable Form Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center p-6 lg:p-10 scrollbar-hide">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[420px] relative py-8 md:py-4"
          >
            {/* Glow Background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[3rem] blur-3xl opacity-50 pointer-events-none" />

            {/* The Glass Card */}
            <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl p-8 lg:p-10 rounded-[2.5rem] transition-all duration-500">
              
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h2>
                <p className="text-slate-400 text-xs leading-relaxed">{subtitle}</p>
              </div>

              {/* Form Content */}
              <div className="space-y-4">
                {children}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;