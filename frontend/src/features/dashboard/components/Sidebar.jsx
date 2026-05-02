import React from "react";
import { 
  LayoutDashboard, 
  Ticket, 
  UserPlus, 
  Settings, 
  HelpCircle, 
  LogOut,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";

const Sidebar = ({ role, onLogout, isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = role === "admin" 
    ? [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { id: "tickets", label: "All Tickets", icon: Ticket, path: "/tickets" },
        { id: "assign", label: "Assign Tickets", icon: UserPlus, path: "/tickets?view=unassigned" },
        { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
      ]
    : [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/agent" },
        { id: "my-tickets", label: "My Tickets", icon: Ticket, path: "/tickets" },
        { id: "help", label: "Help Center", icon: HelpCircle, path: "/help" },
      ];

  return (
    <aside className={`w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ResolveAI</span>
        </Link>
        <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.id === 'tickets' && location.pathname.startsWith('/tickets'));
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={20} className={isActive ? "text-emerald-400" : "group-hover:text-white transition-colors"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
