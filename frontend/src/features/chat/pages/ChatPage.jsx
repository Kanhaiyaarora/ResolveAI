import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { ArrowLeft, Info, MoreVertical, MessageSquare } from "lucide-react";
import ChatBox from "../components/ChatBox";
import { getTicketById } from "../../tickets/service/ticket.api";
import StatusBadge from "../../tickets/components/StatusBadge";

const ChatPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketById(ticketId);
        setTicket(data.ticket);
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  if (loading) return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (!ticket) return (
    <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-slate-500 gap-3">
      <MessageSquare size={48} className="opacity-20" />
      <p className="font-semibold">Ticket not found</p>
      <button onClick={() => navigate(-1)} className="text-emerald-500 text-sm hover:underline">
        Go back
      </button>
    </div>
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4">
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-4 rounded-3xl shadow-xl shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="h-10 w-px bg-slate-800" />

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-white font-bold leading-tight truncate max-w-[300px]">
                {ticket.subject}
              </h2>
              <StatusBadge status={ticket.status} />
            </div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              Ticket #{ticket._id.slice(-8)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Agent avatars */}
          {ticket.assignedTo?.length > 0 && (
            <div className="flex -space-x-2 mr-2">
              {ticket.assignedTo.map((agent, i) => (
                <div 
                  key={agent._id || i} 
                  className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg" 
                  title={agent.name}
                >
                  {agent.name?.charAt(0) || "A"}
                </div>
              ))}
            </div>
          )}
          <button 
            onClick={() => navigate(`/tickets/${ticketId}`)} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-all"
          >
            <Info size={14} />
            Details
          </button>
        </div>
      </div>

      {/* Chat body — takes remaining space */}
      <div className="flex-1 min-h-0">
        <ChatBox ticketId={ticketId} fullHeight />
      </div>
    </div>
  );
};

export default ChatPage;
