import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllTickets, getMyTickets } from "../service/ticket.api";
import TicketCard from "../components/TicketCard";
import TicketSkeleton from "../components/TicketSkeleton";
import { Filter, Search, Plus, Loader2, Ticket } from "lucide-react";
import Button from "../../auth/components/Button";

import { useLocation, Link } from "react-router";

import { useTickets } from "../hooks/useTickets";

const TicketList = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const view = queryParams.get("view");

  const { tickets, loading, fetchTickets } = useTickets(user.role);
  const [filter, setFilter] = useState({ status: "", priority: "" });

  useEffect(() => {
    // If view=unassigned, we might need special handling or just filter client side as before
    fetchTickets(filter);
  }, [user.role, filter, fetchTickets]);

  // Handle client-side unassigned filter if view is set
  const displayTickets = view === "unassigned" 
    ? tickets.filter(t => !t.assignedTo || t.assignedTo.length === 0)
    : tickets;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {user.role === "admin" ? "All Tickets" : "My Assigned Tickets"}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage and track support requests across your organization.
          </p>
        </div>
        
        {user.role === "admin" && (
          <Link to="/tickets/create">
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Create Ticket
            </Button>
          </Link>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-widest border border-slate-700">
          <Filter size={14} />
          Filters
        </div>

        <select 
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select 
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="ml-auto text-slate-500 text-sm">
          Showing {displayTickets.length} tickets
        </div>
      </div>

      {/* Tickets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TicketSkeleton key={i} />
          ))}
        </div>
      ) : displayTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="h-64 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500 gap-2">
          <Ticket size={48} className="opacity-20 mb-2" />
          <p className="font-semibold text-lg">No tickets found</p>
          <p className="text-sm">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default TicketList;
