import React from "react";
import { format } from "date-fns";

const MessageBubble = ({ message, isOwn }) => {
  const sender = message.senderId;
  const senderName = typeof sender === "object" && sender !== null 
    ? sender.name 
    : "User";
  const senderRole = typeof sender === "object" && sender !== null
    ? sender.role
    : null;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      {/* Avatar for others */}
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-2 mt-1 shrink-0 border border-slate-600">
          <span className="text-[10px] font-bold text-white uppercase">
            {senderName.charAt(0)}
          </span>
        </div>
      )}

      <div className={`max-w-[75%]`}>
        {/* Sender name for others */}
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {senderName}
            </span>
            {senderRole && (
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                senderRole === "admin" 
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {senderRole}
              </span>
            )}
          </div>
        )}

        {/* Bubble */}
        <div className={`px-4 py-2.5 rounded-2xl ${
          isOwn 
            ? "bg-emerald-500 text-white rounded-tr-sm" 
            : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
        </div>

        {/* Timestamp */}
        <div className={`mt-1 px-1 ${isOwn ? "text-right" : "text-left"}`}>
          <span className="text-[9px] text-slate-600">
            {message.createdAt 
              ? format(new Date(message.createdAt), "h:mm a") 
              : "Just now"
            }
          </span>
        </div>
      </div>

      {/* Avatar for self */}
      {isOwn && (
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center ml-2 mt-1 shrink-0">
          <span className="text-[10px] font-bold text-white uppercase">
            You
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
