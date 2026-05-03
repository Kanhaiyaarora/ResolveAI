import React, { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { MessageSquare, Loader2 } from "lucide-react";

const ChatBox = ({ ticketId }) => {
  const { messages, loading, sendMessage, currentUser } = useChat(ticketId);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center gap-2">
        <MessageSquare size={18} className="text-emerald-500" />
        <h3 className="text-white font-bold text-sm">Internal Discussion</h3>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide"
      >
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-slate-500" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, i) => (
            <MessageBubble 
              key={i} 
              message={msg} 
              isOwn={msg.senderId?._id === currentUser?.id || msg.senderId === currentUser?.id} 
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 opacity-50">
            <MessageSquare size={32} />
            <p className="text-xs">No messages yet. Start the conversation.</p>
          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;
