import { useState, useCallback } from "react";
import {
  getAllTickets,
  getMyTickets,
  updateTicketStatus,
  assignTicket as assignTicketApi,
  getTicketStats,
  getAgents,
  getRecentActivity,
} from "../service/ticket.api";

export const useTickets = (role) => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivity = useCallback(async () => {
    try {
      const data = await getRecentActivity();
      setActivity(data.activity || []);
      return data.activity;
    } catch (err) {
      console.error("Failed to fetch activity:", err);
    }
  }, []);

  const fetchAgents = useCallback(async () => {
    try {
      const data = await getAgents();
      setAgents(data.agents || []);
      return data.agents;
    } catch (err) {
      console.error("Failed to fetch agents:", err);
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
        setTickets(data.tickets || []);
        return data.tickets;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    },
    [role],
  );

  // fetchStats should NOT set global loading — it runs on a 10s poll
  const fetchStats = useCallback(async () => {
    try {
      const data = await getTicketStats();
      setStats(data.stats);
      return data.stats;
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateTicketStatus(id, status);
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
    activity,
    loading,
    error,
    fetchTickets,
    fetchStats,
    fetchAgents,
    fetchActivity,
    updateStatus,
    assignAgent,
  };
};
