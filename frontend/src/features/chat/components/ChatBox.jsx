import React, { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { MessageSquare, Loader2, Sparkles } from "lucide-react";

const ChatBox = ({ ticketId }) => {
  const { messages, suggestions, loading, sendMessage, currentUser } = useChat(ticketId);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-emerald-500" />
          <h3 className="text-white font-bold text-sm">Internal Discussion</h3>
        </div>
        {currentUser?.role === 'agent' && (
           <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
             <Sparkles size={12} className="text-purple-400" />
             <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">AI Assisted</span>
           </div>
        )}
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

      {/* AI Suggestions */}
      {suggestions.length > 0 && currentUser?.role === 'agent' && (
        <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => sendMessage(suggestion)}
              className="text-[11px] px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/20 transition-all text-left max-w-xs truncate"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;
