import React from "react";
import { format } from "date-fns";

const MessageBubble = ({ message, isOwn }) => {
  const sender = message.senderId;
  const senderName = typeof sender === 'string' ? 'User' : sender?.name || 'System';
  
  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} mb-4`}>
      <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
        isOwn 
          ? "bg-emerald-500 text-white rounded-tr-none" 
          : "bg-slate-800 text-slate-200 rounded-tl-none"
      }`}>
        {!isOwn && (
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-50">
            {senderName}
          </p>
        )}
        <p className="text-sm leading-relaxed">{message.text}</p>
        <span className={`text-[9px] mt-1 block opacity-70 ${isOwn ? "text-right" : "text-left"}`}>
          {format(new Date(message.createdAt), "HH:mm")}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
