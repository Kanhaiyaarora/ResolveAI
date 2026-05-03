import React, { useEffect } from "react";
import {
  Users,
  Ticket,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  User
} from "lucide-react";
import { motion } from "framer-motion";

import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { useTickets } from "../../tickets/hooks/useTickets";
import { formatDistanceToNow } from "date-fns";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats, agents, activity, loading, fetchStats, fetchAgents, fetchActivity } = useTickets(user?.role);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchStats(),
          fetchAgents(),
          fetchActivity()
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000); 
    return () => clearInterval(interval);
  }, [fetchStats, fetchAgents, fetchActivity]);

  const cards = [
    { label: "Total Tickets", value: stats?.total || 0, icon: Ticket, color: "text-blue-500", bg: "bg-blue-500/10", path: "/tickets" },
    { label: "Open Issues", value: stats?.open || 0, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10", path: "/tickets?status=open" },
    { label: "Resolved", value: stats?.resolved || 0, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", path: "/tickets?status=resolved" },
    { label: "Active Agents", value: agents.length, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", path: "/agents" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time performance metrics and ticket distribution.</p>
        </div>
        <Link 
          to="/tickets"
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          View All Tickets
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(card.path)}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl group hover:border-slate-700 transition-all shadow-lg cursor-pointer"
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

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 overflow-hidden">
          <h4 className="text-white font-bold mb-6">Recent Activity</h4>
          <div className="space-y-6">
            {loading ? (
               [1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 animate-pulse">
                   <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
                   <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-800 rounded w-1/4" />
                   </div>
                </div>
               ))
            ) : activity.length > 0 ? (
              activity.map((item) => (
                <div 
                  key={item._id} 
                  onClick={() => navigate(`/tickets/${item._id}`)}
                  className="flex gap-4 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0 border border-slate-700 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                    <User size={16} className="text-slate-500 group-hover:text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      <span className="text-white font-bold">{item.assignedTo?.[0]?.name || "System"}</span> {item.status === 'resolved' ? 'resolved' : 'updated'} ticket <span className="text-emerald-500 font-mono">#{item._id.slice(-4)}</span>
                    </p>
                    <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block tracking-wider">
                      {formatDistanceToNow(new Date(item.updatedAt))} ago
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm italic">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
