import React, { useState } from "react";
import { useNavigate } from "react-router";
import { createTicket } from "../service/ticket.api";
import { useSelector } from "react-redux";
import { ArrowLeft, Send, AlertCircle, Loader2 } from "lucide-react";
import Button from "../../auth/components/Button";

const CreateTicket = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "medium",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // For manual creation, we pass the companyId and a dummy customerId if backend requires it
      // In a real app, you'd select a customer from a list
      await createTicket({
        ...formData,
        companyId: user.companyId,
        customerId: "67c3ec78e47400d33e75e9f8" // Placeholder dummy customer
      });
      navigate("/tickets");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Support Ticket</h1>
          <p className="text-slate-400 text-sm mt-1">Manually log a new support request for your organization.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Subject</label>
            <input
              required
              type="text"
              placeholder="Brief summary of the issue"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Description</label>
            <textarea
              required
              rows={5}
              placeholder="Provide detailed information about the support request..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Priority</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            
            <div className="flex items-end">
               <Button 
                 type="submit" 
                 disabled={loading}
                 className="w-full h-[46px] flex items-center justify-center gap-2"
               >
                 {loading ? (
                   <Loader2 size={18} className="animate-spin" />
                 ) : (
                   <>
                     <Send size={18} />
                     Create Ticket
                   </>
                 )}
               </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
