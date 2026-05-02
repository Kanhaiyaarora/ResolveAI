import React from "react";

const TicketSkeleton = () => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-20 h-4 bg-slate-800 rounded-md" />
        <div className="w-16 h-4 bg-slate-800 rounded-full" />
      </div>
      <div className="w-full h-6 bg-slate-800 rounded-md" />
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-800/50 rounded-md" />
        <div className="w-3/4 h-3 bg-slate-800/50 rounded-md" />
      </div>
      <div className="pt-4 border-t border-slate-800/50 flex justify-between">
        <div className="w-24 h-4 bg-slate-800 rounded-md" />
        <div className="w-20 h-4 bg-slate-800 rounded-md" />
      </div>
    </div>
  );
};

export default TicketSkeleton;
