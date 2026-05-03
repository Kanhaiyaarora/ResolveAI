import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    open: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    resolved: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    closed: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.open} uppercase tracking-tight`}>
      {status}
    </span>
  );
};

export default StatusBadge;
