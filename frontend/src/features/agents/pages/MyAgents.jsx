import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAgents } from "../service/agent.api";
import { Copy, Check, Users, ShieldAlert, Key } from "lucide-react";
import toast from "react-hot-toast";

const MyAgents = () => {
  const { user } = useSelector((state) => state.auth);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        if (data.success) {
          setAgents(data.agents);
        }
      } catch (error) {
        toast.error("Failed to load agents");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const handleCopyCode = () => {
    if (user?.inviteCode) {
      navigator.clipboard.writeText(user.inviteCode);
      setCopied(true);
      toast.success("Invite code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-emerald-500" />
            My Agents
          </h1>
          <p className="text-slate-400 mt-1">Manage the agents in your company</p>
        </div>
        
        {/* Invite Code Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-slate-400 flex items-center gap-1.5 mb-1">
              <Key size={14} className="text-emerald-500" />
              Company Invite Code
            </p>
            <p className="text-lg font-mono font-bold text-white tracking-widest bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/50 selection:bg-emerald-500/30">
              {user?.inviteCode || "Loading..."}
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            disabled={!user?.inviteCode}
            className="h-10 w-10 flex items-center justify-center bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copy Invite Code"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            Loading agents...
          </div>
        ) : agents.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Agents Found</h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              You haven't added any agents to your company yet. Share your invite code to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/30 border-b border-slate-800 text-sm font-medium text-slate-400">
                  <th className="p-4">Agent Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {agents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{agent.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{agent.email}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAgents;
