import React, { useEffect, useState } from "react";
import { getMyTickets, getTicketStats } from "../../tickets/service/ticket.api";
import { 
  Ticket, 
  CheckCircle, 
  Clock, 
  Target,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import TicketCard from "../../tickets/components/TicketCard";

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [myStats, setMyStats] = useState({ active: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsData, ticketsData] = await Promise.all([
          getTicketStats(),
          getMyTickets()
        ]);
        
        setMyStats({
          active: statsData.stats.myTotal,
          resolved: statsData.stats.myResolved
        });
        setTickets(ticketsData.tickets);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Sync every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'pending');
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  const stats = [
    { label: "My Active Tickets", value: myStats.active, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Resolved", value: myStats.resolved, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "SLA Progress", value: "94%", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Agent Workspace</h1>
          <p className="text-slate-400 text-sm mt-1">Focus on resolving your assigned tickets efficiently.</p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           Online & Available
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{loading ? "..." : stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-xl font-bold text-white">Priority Queue</h3>
           <button className="text-emerald-500 text-sm font-semibold hover:underline underline-offset-4">View All</button>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center text-slate-500">Scanning priority queue...</div>
        ) : openTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {openTickets.slice(0, 3).map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center">
            <CheckCircle className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-400 font-medium">Inbox Zero! All clear for now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
