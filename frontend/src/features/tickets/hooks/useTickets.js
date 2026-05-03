import { useState, useCallback } from "react";
import {
  getAllTickets,
  getMyTickets,
  updateTicketStatus,
  assignTicket as assignTicketApi,
  getTicketStats,
  getAgents,
} from "../service/ticket.api";

export const useTickets = (role) => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAgents = useCallback(async () => {
    try {
      const data = await getAgents;
      setAgents(data.agents);
      return data.agents;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch agents");
    }
  }, []);

  const fetchTickets = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data =
          role === "admin"
            ? await getAllTickets(filters)
            : await getMyTickets();
        setTickets(data.tickets);
        return data.tickets;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch tickets");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [role],
  );

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTicketStats();
      setStats(data.stats);
      return data.stats;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateTicketStatus(id, status);
      // Optimistic update or just refresh
      setTickets((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      throw err;
    }
  };

  const assignAgent = async (id, agentIds) => {
    try {
      await assignTicketApi(id, agentIds);
      // Refresh to get full agent objects if needed, or update locally
      await fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign agent");
      throw err;
    }
  };

  return {
    tickets,
    stats,
    agents,
    loading,
    error,
    fetchTickets,
    fetchStats,
    fetchAgents,
    updateStatus,
    assignAgent,
  };
};
