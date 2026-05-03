import React, { useEffect } from "react";
import {
  Users,
  Ticket,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

import { useSelector } from "react-redux";
import { useTickets } from "../../tickets/hooks/useTickets";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { stats, loading, fetchStats, fetchAgents } = useTickets(user?.role);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchStats(),
          fetchAgents()
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [fetchStats, fetchAgents]);

  const cards = [
    { label: "Total Tickets", value: stats?.total || 0, icon: Ticket, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Open Issues", value: stats?.open || 0, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Resolved", value: stats?.resolved || 0, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Agents", value: stats?.activeAgents, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time performance metrics and ticket distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl group hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-3 rounded-2xl`}>
                <card.icon className={card.color} size={24} />
              </div>
              <TrendingUp className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
            </div>
            <p className="text-slate-400 text-sm font-medium">{card.label}</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {loading ? "..." : card.value}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
            <Clock className="text-emerald-500" size={32} />
          </div>
          <h4 className="text-white font-bold text-xl">SLA Compliance Tracking</h4>
          <p className="text-slate-400 max-w-sm mt-2">
            Analytics engine is processing recent ticket data. Detailed performance charts will appear here shortly.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <h4 className="text-white font-bold mb-6">Recent Activity</h4>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0 border border-slate-700 flex items-center justify-center">
                  <Users size={16} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-300"><span className="text-white font-bold">Agent Alpha</span> resolved ticket #402</p>
                  <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">12 mins ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
