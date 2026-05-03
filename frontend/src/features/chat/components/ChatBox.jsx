import React, { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { MessageSquare, Loader2, Sparkles, AlertTriangle } from "lucide-react";

const ChatBox = ({ ticketId, fullHeight = false }) => {
  const { messages, suggestions, loading, sending, error, sendMessage, currentUser } = useChat(ticketId);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className={`bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col ${fullHeight ? "h-full" : "h-[500px]"} shadow-2xl backdrop-blur-sm`}>

      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-emerald-500" />
          <h3 className="text-white font-bold text-sm">Internal Discussion</h3>
          <span className="text-[10px] text-slate-500">({messages.length} messages)</span>
        </div>
        {currentUser?.role === "agent" && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Sparkles size={12} className="text-purple-400" />
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">AI Assisted</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0"
      >
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-slate-500" size={24} />
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-red-400 gap-2">
            <AlertTriangle size={28} />
            <p className="text-xs">{error}</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, i) => (
            <MessageBubble
              key={msg._id || i}
              message={msg}
              isOwn={
                (msg.senderId?._id || msg.senderId) === currentUser?.id
              }
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 opacity-50">
            <MessageSquare size={32} />
            <p className="text-xs">No messages yet. Start the conversation.</p>
          </div>
        )}
      </div>

      {/* AI Suggestions (Agent only) */}
      {suggestions.length > 0 && currentUser?.role === "agent" && (
        <div className="px-4 py-2.5 bg-slate-900/80 border-t border-slate-800 shrink-0">
          <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Sparkles size={10} /> AI Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => sendMessage(suggestion)}
                disabled={sending}
                className="text-[11px] px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/20 hover:text-purple-200 transition-all text-left max-w-xs truncate disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={sending} />
    </div>
  );
};

export default ChatBox;
