import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { getTicketById, getAgents } from "../service/ticket.api";
import { useTickets } from "../hooks/useTickets";
import { useSelector } from "react-redux";
import StatusBadge from "../components/StatusBadge";
import { 
  ArrowLeft, 
  User, 
  Clock, 
  Tag, 
  Send, 
  MoreVertical,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Button from "../../auth/components/Button";
import { formatDistanceToNow } from "date-fns";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const { updateStatus, assignAgent } = useTickets(user.role);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [updating, setUpdating] = useState(false);

  const fetchTicketData = useCallback(async () => {
    try {
      const ticketData = await getTicketById(id);
      setTicket(ticketData.ticket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchTicketData();
        if (user.role === "admin") {
          const agentsData = await getAgents();
          setAgents(agentsData.agents);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user.role, fetchTicketData]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await updateStatus(id, newStatus);
      setTicket({ ...ticket, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async (agentId) => {
    setUpdating(true);
    try {
      await assignAgent(id, [agentId]);
      await fetchTicketData();
    } catch (error) {
      console.error("Failed to assign agent:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center text-white">Loading detailed intel...</div>;
  if (!ticket) return <div className="h-full flex items-center justify-center text-white">Ticket not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>
        
        <div className="flex items-center gap-3">
          <StatusBadge status={ticket.status} />
          <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
            ticket.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
            ticket.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
            'bg-slate-500/10 text-slate-500 border-slate-500/20'
          }`}>
            {ticket.priority} priority
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
                {ticket.subject}
              </h1>
              <button className="p-2 text-slate-500 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center text-sm text-slate-400 mb-8 pb-8 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <User size={16} />
                <span>Customer: <span className="text-white font-medium">{ticket.customerId?.name || "Unknown"}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span>Opened {formatDistanceToNow(new Date(ticket.createdAt))} ago</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag size={16} />
                <span>Ticket ID: <span className="text-white font-mono uppercase text-xs">{ticket._id.slice(-8)}</span></span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Activity Section Placeholder */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
             <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
               <Send size={18} className="text-emerald-500" />
               Internal Discussion
             </h3>
             
             <div className="space-y-4 mb-6">
               <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />
                 <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none flex-1">
                   <p className="text-sm text-slate-300">I've looked into the logs, seems like a caching issue on the CDN side. Working on a purge now.</p>
                   <span className="text-[10px] text-slate-500 mt-2 block uppercase font-bold">Today, 10:45 AM</span>
                 </div>
               </div>
             </div>

             <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Type a message to your team..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
                <Button size="icon" className="w-12 h-12 flex items-center justify-center">
                  <Send size={20} />
                </Button>
             </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Assignment Box */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              Assigned Agents
            </h4>
            
            <div className="space-y-3 mb-6">
              {ticket.assignedTo?.length > 0 ? (
                ticket.assignedTo.map((agent) => (
                  <div key={agent._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs">
                         {agent.name.charAt(0)}
                       </div>
                       <div className="text-xs">
                         <p className="text-white font-medium">{agent.name}</p>
                         <p className="text-slate-500 truncate max-w-[100px]">{agent.email}</p>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-amber-500/5 border border-dashed border-amber-500/20 rounded-xl flex flex-col items-center gap-2 text-center">
                  <AlertCircle size={24} className="text-amber-500/50" />
                  <p className="text-xs text-amber-500/70">No agent assigned to this task yet.</p>
                </div>
              )}
            </div>

            {user.role === "admin" && (
              <div className="space-y-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Reassign Agent</p>
                <select 
                  onChange={(e) => handleAssign(e.target.value)}
                  disabled={updating}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50"
                  value=""
                >
                  <option value="" disabled>Select an agent...</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>{agent.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Status Control */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              Manage Status
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {['open', 'pending', 'resolved', 'closed'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || ticket.status === s}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                    ticket.status === s
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                  } disabled:opacity-50`}
                >
                  {s === "pending" ? "In Progress" : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
