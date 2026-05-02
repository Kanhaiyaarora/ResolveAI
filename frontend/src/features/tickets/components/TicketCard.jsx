import React from "react";
import { Clock, User as UserIcon, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import StatusBadge from "./StatusBadge";
import { formatDistanceToNow } from "date-fns";

const TicketCard = ({ ticket }) => {
  const priorityColors = {
    low: "bg-slate-500",
    medium: "bg-amber-500",
    high: "bg-red-500",
  };

  return (
    <Link 
      to={`/tickets/${ticket._id}`}
      className="group bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 hover:bg-slate-900 transition-all block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[ticket.priority]}`} />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{ticket.priority} priority</span>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
        {ticket.subject}
      </h3>
      
      <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <UserIcon size={12} className="text-slate-400" />
          </div>
          <span className="text-xs text-slate-400">
            {ticket.assignedTo?.length > 0 
              ? ticket.assignedTo[0].name 
              : "Unassigned"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-500">
            <Clock size={14} />
            <span className="text-xs">{formatDistanceToNow(new Date(ticket.createdAt))} ago</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <MessageSquare size={14} />
            <span className="text-xs">3</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;
