import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend, disabled = false }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
    // Re-focus after send
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (but not Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-slate-800 bg-slate-950/50">
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        <Send size={16} />
      </button>
    </form>
  );
};

export default ChatInput;
